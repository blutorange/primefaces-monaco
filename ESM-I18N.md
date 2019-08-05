# Localizing ESM version of monaco

I've seen multiple people ask about how to localize the ESM version of monaco. This is currently not officially supported as far as I know, especially if you want to support multiple languages (see also https://github.com/Microsoft/monaco-editor/issues/784).  Which is why I had to find a workaround for this project, as `require.js` does not integrate well with JSF.

## Strategy

To summarize what I ended up doing:

- Create a bundle with webpack
- Most localized text are hardcoded, but are still passed through a small helper function in `vscode/nls.js`. That function is also given an i18n key, but just returns the localized text. So I use the `NormalModuleWebpackReplacementPlugin` to replace that file with my own version that reads the localized text from a dynamic source.
- Now we need to get the translations for each i18n key. I pull from `github.com/Microsoft/vscode-loc`. It consists of many files, so I process them and write all i18n strings to one JS file.
- The i18n keys from that repo include the source file name of the file they are used in. This is not the case in the ESM version. So I preprocess the ESM code and replace all calls to `nls.localize("my.key", args)` with `nls.localize("source/file.js", "my.key", args)`.
- Some translations are missing (see https://github.com/Microsoft/monaco-editor/issues/822), but fortunately, for most keys, localized texts are available with another i18n key. This can be fixed while generating the locales by mapping to these keys.
- To make the localized strings available to the webworkers as well, we can just wrap the webworker by creating our own webworker that first loads the locale, then proceeds to load the original webworker.

## (Hopefully) working example

Here's a working example for how you can create your own bundle version of monaco with localization support:

```bash
git clone https://github.com/blutorange/primefaces-monaco
cd primefaces-monaco
cd src/npm
```

Open file `./index.js` and comment this line:

```javascript
// export * from "monaco-editor-mod/esm/monacoExtras"
```

Now go on

```bash
npm install
npm run generate-locales
npx webpack
```

This will bundle the monaco editor with localization support:

```bash
cd ../../target/generated-sources/npm/
```

To test it, create a simple HTML file in the directory above:

```bash
touch test.html
```

with this content:

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="author" content="">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

  <p>Hello, world!</p>

  <div id="monaco" style="height: 500px;">MONACO</div>

  <script>
    window.MonacoEnvironment = window.MonacoEnvironment || {};
    window.MonacoEnvironment.getWorkerUrl = function (moduleId, label) {
      if (label === 'json') return './json.worker.js';
      if (label === 'css') return './css.worker.js';
      if (label === 'html') return './html.worker.js';
      if (label === 'typescript' || label === 'javascript') return './ts.worker.js';
      return './editor.worker.js';
    }
  </script>

  <script src="./locale/fr.js"></script>
  <script src="./editor.js"></script>

  <script>monaco.editor.create(document.getElementById("monaco"), {language: "javascript"});</script>

  </script>

</body>

</html>
```

and run a simple server (otherwise you cannot load workers):

```bash
npx http-server
```

Now go to

```
http://localhost:8080/test.html
```

and you should see monaco editor in French (try opening the context menu with a right click)

Feel free to look at the `package.json` of this project and the `node.js` scripts in `src/npm` and take the parts you need for you project.