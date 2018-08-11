const cloneOrPull = require('git-clone-or-pull');
const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");
const mkdirp = require('mkdirp');
const replaceInFile = require('replace-in-file');
const ncp = require('ncp').ncp;
const rimraf = require("rimraf");

const srcDir = path.join(__dirname, "..", "..", "src");
const nodeModulesDir= path.join(srcDir, "npm", "node_modules");
const monacoDir = path.join(nodeModulesDir, "monaco-editor");
const monacoModDir = path.join(nodeModulesDir, "monaco-editor-mod");
const monacoModEsmDir= path.join(monacoModDir, "esm");
const targetdir = path.join(__dirname, "..", "..", "target");
const gitdir = path.join(targetdir, "git");
const basedir = path.join(gitdir, "vscode-loc");
const i18ndir = path.join(basedir, "i18n");
const outdir = path.join(targetdir, "generated-sources", "npm", "locale");

const langDirPrefix = "vscode-language-pack-";

function injectSourcePath(callback) {
    rimraf(monacoModDir, function(err) {
        if (err) {
            callback(err);
            return;
        }
        ncp(monacoDir, monacoModDir, function(err) {
            if (err) {
                callback(err);
                return;
            }
            recursive(monacoModEsmDir, (err, files) => {
                if (err) {
                    callback(err);
                    return;
                }
                files.forEach(file => {
                    if (file.endsWith(".js")) {
                        const vsPath = path.relative(monacoModEsmDir, path.dirname(file));
                        const transPath = vsPath + "/" + path.basename(file, ".js");
                        replaceInFile({
                            files: file,
                            from: /localize\(/g,
                            to: `localize('${transPath}', `,
                        });
                    }
                });
                callback();
            });
        });
    });
}

function createLocale(lang, langPath, callback) {
    const map = {};
    recursive(langPath, function (err, files) {
        if (err) {
            callback(err);
            return;
        }
        files.forEach(file => {
            if (file.endsWith(".i18n.json")) {
                const data = fs.readFileSync(file, {encoding: "UTF-8"});
                let json;
                try {
                    json = JSON.parse(data);
                }
                catch (e1) {
                    try {
                        json = eval("(" + data + ")");
                    }
                    catch (e2) {
                        const newErr = new Error("Error while parsing i18n file " + file);
                        newErr.stack += "\n\ncaused by: " + e2.stack;
                        callback(newErr);
                        return;
                    }
                }
                if (typeof json.contents !== "object") {
                    console.warn("no translations found", file);
                    return;
                }
                for (const key of Object.keys(json.contents)) {
                    if (key) {
                        map[key] = json.contents[key];
                    }
                }
            }
        });
        callback(undefined, map);
    });
}

function createScript(lang, locale) {
    const sortedKeys = Object.keys(locale).sort((lhs, rhs) => {
        const l = lhs.toLowerCase();
        const r = rhs.toLowerCase();
        return l < r ? -1 : l > r ? 1 : 0;
    });
    const sortedLocale = {};
    for (const key of sortedKeys) {
        sortedLocale[key] = locale[key];
    }
    return "this.MonacoEnvironment = this.MonacoEnvironment || {}; this.MonacoEnvironment.Locale = {language: '" + lang + "', data: " + JSON.stringify(sortedLocale, null, 4) + "};";
}

function main() {
    mkdirp(gitdir, err => {
        if (err) throw err;
        injectSourcePath(err => {
            if (err) throw err;
            cloneOrPull('git://github.com/Microsoft/vscode-loc.git', basedir, function (err) {
                if (err) throw err;
                fs.readdir(i18ndir, (err, langDirs) => {
                    if (err) throw err;
                    langDirs.forEach(langDir => {
                        if (!langDir.startsWith(langDirPrefix)) {
                            return;
                        }
                        const lang = langDir.substring(langDirPrefix.length).toLowerCase();
                        const transPath = path.join(i18ndir, langDir, "translations");
                        if (fs.lstatSync(transPath).isDirectory()) {
                            createLocale(lang, transPath, (err, locale) => {
                                if (err) throw err;
                                mkdirp(outdir, err => {
                                    if (err) throw err;
                                    const mappedLang = lang;
                                    fs.writeFile(path.join(outdir, mappedLang + ".js"), createScript(mappedLang, locale), {encoding: "UTF-8"}, err => {
                                        if (err) throw err;
                                        console.log("generated locale " + mappedLang + ".js");
                                    });
                                });
                            });
                        }
                    })
                });
            });
        });
    });
}

main();