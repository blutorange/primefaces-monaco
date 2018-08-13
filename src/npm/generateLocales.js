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

const fileExistsCache = new Map();

const missingTranslations = {
    "vs/base/common/keybindingLabels": {
        "superKey": "Super",
        "superKey.long": "Super"
    },
    "vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp": {
        "noSelection": "No selection",
        "singleSelectionRange": ["vs/workbench/browser/parts/editor/editorStatus", "singleSelectionRange"],
        "singleSelection": ["vs/workbench/browser/parts/editor/editorStatus", "singleSelection"],
        "multiSelectionRange": ["vs/workbench/browser/parts/editor/editorStatus", "multiSelectionRange"],
        "multiSelection": ["vs/workbench/browser/parts/editor/editorStatus", "multiSelectionRange"],
        "ShowAccessibilityHelpAction": ["vs/workbench/parts/codeEditor/electron-browser/accessibility", "ShowAccessibilityHelpAction"],
    },
    "vs/editor/standalone/browser/inspectTokens/inspectTokens": {
        "inspectTokens": "Developer: Inspect Tokens"
    },
    "vs/editor/standalone/browser/quickOpen/quickOutline": {
        "quickOutlineActionInput": "Type the name of an identifier you wish to navigate to",
        "QuickOutlineAction.label": ["vs/workbench/parts/quickopen/browser/quickopen.contribution", "gotoSymbolDescription"],
        "symbols": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "symbols"],
        "method": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "method"],
        "function": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "function"],
        "_constructor": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "_constructor"],
        "variable": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "variable"],
        "class": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "class"],
        "interface": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "interface"],
        "namespace": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "namespace"],
        "package": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "package"],
        "modules": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "modules"],
        "property": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "property"],
        "enum": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "enum"],
        "string": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "string"],
        "rule": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "rule"],
        "file": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "file"],
        "array": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "array"],
        "number": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "number"],
        "boolean": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "boolean"],
        "object": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "object"],
        "key": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "key"],
        "entryAriaLabel": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "entryAriaLabel"],
        "modules": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "modules"],
        "noSymbolsMatching": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "noSymbolsMatching"],
        "noSymbolsFound": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "noSymbolsFound"],
        "gotoSymbolHandlerAriaLabel": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "gotoSymbolHandlerAriaLabel"],
        "cannotRunGotoSymbolInFile": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "cannotRunGotoSymbolInFile"],
        "cannotRunGotoSymbol": ["vs/workbench/parts/quickopen/browser/gotoSymbolHandler", "cannotRunGotoSymbol"],
    },
    "vs/editor/standalone/browser/quickOpen/gotoLine": {
        "gotoLineLabelEmptyWithLineLimit": ["vs/workbench/parts/quickopen/browser/gotoLineHandler", "gotoLineLabelEmptyWithLimit"],
        "gotoLineAriaLabel": ["vs/workbench/parts/quickopen/browser/gotoLineHandler", "gotoLineLabel"],
        "gotoLineLabelValidLine": ["vs/workbench/parts/quickopen/browser/gotoLineHandler", "gotoLineLabel"],
        "gotoLineActionInput": ["vs/workbench/parts/quickopen/browser/gotoLineHandler", "gotoLineLabelEmpty"],
        "GotoLineAction.label": ["vs/workbench/parts/quickopen/browser/gotoLineHandler", "gotoLine"],
    },
    "vs/editor/standalone/browser/quickOpen/quickCommand": {
        "quickCommandActionInput": "Type the name of an action you want to execute",
        "QuickCommandAction.label": ["vs/workbench/parts/quickopen/browser/quickopen.contribution", "miCommandPalette"],
        "ariaLabelEntry": ["vs/workbench/parts/quickopen/browser/commandsHandler", "entryAriaLabel"],
    },
    "vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast": {
        "toggleHighContrast": "Toggle High Contrast Theme"
    },
    "vs/editor/standalone/browser/standaloneCodeEditor": {
        "editorViewAccessibleLabel": ["vs/editor/common/config/editorOptions", "editorViewAccessibleLabel"],
        "accessibilityHelpMessage": ["vs/editor/common/config/editorOptions", "accessibilityOffAriaLabel"],
    }
};

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

/**
 * Some translations are missing in the microsoft/vscode-loc repository. Use the closest
 * available translations for these.
 * @param locale Object with the current i18n keys. Missing translations are merged into this object.
 * @param allTranslations All available translations from the microsoft/vscode-loc repository.
 */
function mergeMissingTranslations(locale, allTranslations) {
    for (const path of Object.keys(missingTranslations)) {
        const keys = missingTranslations[path];
        for (const key of Object.keys(keys)) {
            const mapping = keys[key];
            if (!locale[path] || !locale[path][key] && Array.isArray(mapping)) {
                const translation = (allTranslations[mapping[0]]||{})[mapping[1]];
                if (translation) {
                    locale[path] = locale[path] || {};
                    locale[path][key] = translation;
                }
            }
        }
    }
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
        // Merge in missing translations
        mergeMissingTranslations(locale, allTranslations);
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