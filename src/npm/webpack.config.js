const path = require("path");
const nls = require.resolve("./nls-replace.js");

const LimitChunkCountPlugin = require("webpack/lib/optimize/LimitChunkCountPlugin");
const NormalModuleWebpackReplacementPlugin = require("webpack/lib/NormalModuleReplacementPlugin");

module.exports = (env, argv) => {
  env = env || {};
  env.production = env.production === false || env.production === "false" ? false : true;
  if (env.production) {
    console.log("Running webpack in production mode");
  }
  else {
    console.log("Running webpack in development mode");
  }
  return {
    mode: env.production ? "production" : "development",
    devtool: env.production ? undefined : "inline-source-map",
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
    target: ['web', 'es5'],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.ttf$/,
          use: ["url-loader"],
        }
      ]
    },
    plugins: [
      new NormalModuleWebpackReplacementPlugin(/\/(vscode\-)?nls\.js/, function (resource) {
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
};
