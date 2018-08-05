const cloneOrPull = require('git-clone-or-pull');
const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");
const mkdirp = require('mkdirp');

const targetdir = path.join(__dirname, "..", "..", "target");
const gitdir = path.join(targetdir, "git");
const basedir = path.join(gitdir, "vscode");
const i18ndir = path.join(basedir, "i18n");
const outdir = path.join(targetdir, "generated-sources", "npm", "locale");

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
                for (const key of Object.keys(json)) {
                    if (key) {
                        map[key] = json[key];
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

mkdirp(gitdir, err => {
    if (err) throw err;
    cloneOrPull('git://github.com/Microsoft/vscode.git', basedir, function(err) {
        if (err) throw err;
        fs.readdir(i18ndir, (err, langs) => {
            if (err) throw err;
            langs.forEach(lang => {
                const langPath = path.join(i18ndir, lang);
                if (fs.lstatSync(langPath).isDirectory()) {
                    createLocale(lang, langPath, (err, locale) => {
                        if (err) throw err;
                        mkdirp(outdir, err => {
                           if (err) throw err;
                            fs.writeFile(path.join(outdir, lang + ".js"), createScript(lang, locale), {encoding: "UTF-8"}, err => {
                                if (err) throw err;
                                console.log("generated locale " + lang + ".js");
                            });
                        });
                    });
                }
            })
        }) ;
    });
});
