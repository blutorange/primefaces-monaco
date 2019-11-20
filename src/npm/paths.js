const path = require("path");

exports.projectDir = path.join(__dirname, "..", "..");
exports.srcDir = path.join(exports.projectDir, "src");
exports.targetDir = path.join(exports.projectDir, "target");
exports.npmDir = path.join(exports.srcDir, "npm");

exports.nodeModulesDir= path.join(exports.npmDir, "node_modules");
exports.monacoDir = path.join(exports.nodeModulesDir, "monaco-editor");
exports.monacoModDir = path.join(exports.nodeModulesDir, "monaco-editor-mod");
exports.monacoModEsmDir= path.join(exports.monacoModDir, "esm");
exports.gitDir = path.join(exports.targetDir, "git");
exports.vsCodeLocDir = path.join(exports.gitDir, "vscode-loc");
exports.vsCodeLocI18nDir = path.join(exports.vsCodeLocDir, "i18n");
exports.generatedSourceLocaleDir = path.join(exports.targetDir, "generated-sources", "npm", "locale");
exports.typedocInputFile = path.join(exports.npmDir, "src", "primefaces-monaco.d.ts");
exports.typedocTempFile = path.join(exports.npmDir, "src", "tmp.d.ts");
exports.typedocOutputDir = path.join(exports.projectDir, "docs", "typedoc");
exports.typedocReadme = path.join(exports.npmDir, "typedoc-readme.md");