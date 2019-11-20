const fs = require("fs");
const TypeDoc = require("typedoc");
const Paths = require("./paths");

const typeDeclaration = fs.readFileSync(Paths.typedocInputFile, {encoding: "utf-8"});
const processed = [
    `/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />`,
    typeDeclaration.replace(/import\("monaco-editor"\)/g, "monaco")
].join("\n");
fs.writeFileSync(Paths.typedocTempFile, processed, {encoding: "utf-8"});

try {
    const app = new TypeDoc.Application({
        mode:   "File",
        target: "ES5",
        module: "CommonJS",
        experimentalDecorators: true,
        includeDeclarations: true,
        exclude: '**/node_modules/+(@types|typescript)/**',
        readme: Paths.typedocReadme,
    });

    const project = app.convert([Paths.typedocTempFile]);

    if (project) {
        // Rendered docs
        app.generateDocs(project, Paths.typedocOutputDir);
    }
    else {
        throw new Error("Could not generate typedoc");
    }
}
finally {
    fs.unlinkSync(Paths.typedocTempFile);
}