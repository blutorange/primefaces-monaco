const path = require("path");

exports.srcDir = path.join(__dirname, "..", "..", "src");
exports.nodeModulesDir= path.join(exports.srcDir, "npm", "node_modules");
exports.monacoDir = path.join(exports.nodeModulesDir, "monaco-editor");
exports.monacoModDir = path.join(exports.nodeModulesDir, "monaco-editor-mod");
exports.monacoModEsmDir= path.join(exports.monacoModDir, "esm");
exports.targetDir = path.join(__dirname, "..", "..", "target");
exports.gitDir = path.join(exports.targetDir, "git");
exports.vsCodeLocDir = path.join(exports.gitDir, "vscode-loc");
exports.vsCodeLocI18nDir = path.join(exports.vsCodeLocDir, "i18n");
exports.generatedSourceLocaleDir = path.join(exports.targetDir, "generated-sources", "npm", "locale");