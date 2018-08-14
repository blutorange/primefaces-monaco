const path = require("path");
const nls = require.resolve("./nls-replace.js");

const LimitChunkCountPlugin = require("webpack/lib/optimize/LimitChunkCountPlugin");
const NormalModuleWebpackReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");

module.exports = {
    mode: "production",
    entry: {
        "editor": "./index.js",
        "editor.worker": "monaco-editor-mod/esm/vs/editor/editor.worker.js",
        "json.worker": "monaco-editor-mod/esm/vs/language/json/json.worker",
        "css.worker": "monaco-editor-mod/esm/vs/language/css/css.worker",
        "html.worker": "monaco-editor-mod/esm/vs/language/html/html.worker",
        "ts.worker": "monaco-editor-mod/esm/vs/language/typescript/ts.worker",
    },
    output: {
        globalObject: "this",
        path: path.resolve(__dirname, "..", "..", "target", "generated-sources", "npm"),
        filename: "[name].js",
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }]
    },
    plugins: [
        new NormalModuleWebpackReplacementPlugin(/\/(vscode\-)?nls\.js/, function(resource) {
            resource.request = nls;
            resource.resource = nls;
        }),
        new LimitChunkCountPlugin({
            maxChunks: 1,
        })
    ],
    optimization: {
        splitChunks: {
            minSize: 9999999999999999,
        },
    }
};
