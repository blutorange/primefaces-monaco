const gitPullOrClone = require('git-pull-or-clone');
const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");
const mkdirp = require("mkdirp");
const replaceInFile = require("replace-in-file");
const ncp = require("ncp").ncp;
const rimraf = require("rimraf");

const {
    monacoDir,
    monacoModDir,
    monacoModEsmDir,
    gitDir,
    vsCodeLocDir,
    vsCodeLocI18nDir,
    generatedSourceLocaleDir,
} = require("./paths");

const langDirPrefix = "vscode-language-pack-";
const vsCodeRepository = "git://github.com/Microsoft/vscode-loc.git";

const fileExistsCache = new Map();

/**
 * The microsoft/vscode-loc contains many more i18n keys that are used by monaco editor.
 * Keys are grouped by source files, so we include only those keys whose source files
 * exists in the monaco editor repository.
 * @param {string} key
 * @return {boolean}
 */
function sourceFileExists(key) {
    if (fileExistsCache.has(key)) {
        return fileExistsCache.get(key);
    }
    const filePath = path.join(monacoModEsmDir, key + ".js");
    const exists = fs.existsSync(filePath);
    fileExistsCache.set(key, exists);
    return exists;
}

/**
 * The call to the `localize` function only include the i18 key, but translations
 * in the microsoft/vscode-loc repository are first grouped by source file name,
 * then i18n key. So we modify the each call to `localize` so that it includes
 * the source file name.
 *
 * > nls.localize("my.key", args)
 *
 * becomes
 *
 * > nls.localize("source/file.js", "my.key", args)
 * @param callback
 */
function injectSourcePath(callback) {
    rimraf(monacoModDir, function (err) {
        if (err) {
            callback(err);
            return;
        }
        ncp(monacoDir, monacoModDir, function (err) {
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
                        const vsPath = path.relative(monacoModEsmDir, path.dirname(file)).replace(/\\/g, "/");
                        const transPath = vsPath + "/" + path.basename(file, ".js");
                        replaceInFile({
                            files: file,
                            from: [
                                /localize\(/g,
                                /localize\.apply\(\s*([^,]+)\s*,\s*\[/g,
                            ],
                            to: [
                                `localize('${transPath}', `,
                                `localize.apply($1, ['${transPath}', `,
                            ],
                        });
                    }
                });
                callback();
            });
        });
    });
}

/**
 * Reads all files from the microsoft/vscode-loc repository for the given language
 * and creates one object with all i18n keys.
 * @param lang Language, eg. `en` or `de`.
 * @param langPath Full path to the directory with the language files.
 * @param callback Called on completion with error and the created locale object.
 */
function createLocale(lang, langPath, callback) {
    const locale = {};
    const allTranslations = {};
    recursive(langPath, function (err, files) {
        if (err) {
            callback(err);
            return;
        }
        files.forEach(file => {
            if (file.endsWith(".i18n.json")) {
                const data = fs.readFileSync(file, { encoding: "UTF-8" });
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
                delete json.contents["package"];
                for (const key of Object.keys(json.contents)) {
                    if (key) {
                        if (sourceFileExists(key)) {
                            locale[key] = json.contents[key];
                        }
                        allTranslations[key] = json.contents[key];
                    }
                }
            }
        });
        callback(undefined, locale);
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
    mkdirp.sync(gitDir);
    injectSourcePath(err => {
        if (err) throw err;
        gitPullOrClone(vsCodeRepository, vsCodeLocDir, function (err) {
            if (err) throw err;
            fs.readdir(vsCodeLocI18nDir, (err, langDirs) => {
                if (err) throw err;
                langDirs.forEach(langDir => {
                    if (!langDir.startsWith(langDirPrefix)) {
                        return;
                    }
                    const lang = langDir.substring(langDirPrefix.length).toLowerCase();
                    const transPath = path.join(vsCodeLocI18nDir, langDir, "translations");
                    if (fs.existsSync(transPath) && fs.lstatSync(transPath).isDirectory()) {
                        createLocale(lang, transPath, (err, locale) => {
                            if (err) throw err;
                            mkdirp.sync(generatedSourceLocaleDir)
                            const mappedLang = lang;
                            fs.writeFile(path.join(generatedSourceLocaleDir, mappedLang + ".js"), createScript(mappedLang, locale), { encoding: "UTF-8" }, err => {
                                if (err) throw err;
                                console.log("generated locale " + mappedLang + ".js");
                            });
                        });
                    }
                })
            });
        });
    });

}

main();
