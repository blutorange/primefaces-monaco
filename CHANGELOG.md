See also [the changelog of monaco-editor](https://github.com/Microsoft/monaco-editor/blob/master/CHANGELOG.md).

# 0.17.1

- update to monaco editor 0.17.1
- add transparent `getValue` / `setValue` to the widget API
- The widget is now a `PrimeFaces.widget.DeferredWidget` so that it works better with 
  tabs etc.

# 0.17.0

- update to PrimeFaces 7.0 (no guarantees it will work with PrimeFaces 6)
- update to monaco editor 0.17.0
- no more uses of `eval`.
- due to the above: the property `extender` of the `monacoEditor` component, if given,
  must now be a valid JavaScript expression evaluating to an extender object. Loading the extender
  from an URL is not supported anymore. The recommended way is to define a factory function in
  an external file and call that.
- client-side script `widget.js` now gets minified
- add method `whenReady` to client-side widget
- update npm and maven dependencies

# 0.16.2

- reuse model (`ITextModel`) if it exists already

# 0.16.1

- update to monaco editor 0.16.1 (solves an issue with IE)
- add new languages to the Enum of available code languages (see `EditorOptions#setLanguage`)
- add an optional hook to the extender: `createWorker`. This lets you load your own workers instead of using the default ones.
- add 3 new options to the `monacoEditor` tag: `directory`, `basename`, `extension`. This may be useful in case you need to customize the editor on the client side.
- updated and corrected type definitions
- When the editor is instantiated, create an `ITextModel` manually instead of just passing a value and language in the `IEditorConstructionOptions`. If you are using an `MonacoExtender`, the properties `language` and `value` are still available in the `IEditorConstructionOptions` passed `#beforeCreate`, but they will be removed in version 0.17. Use the property `model` instead.

# 0.16.0
- update to monaco editor `0.16.0`
- update the editor options, added `cursorSmoothCaretAnimation`, `renderFinalNewline`, 
  and `fastScrollSensitivity`

# 0.15.2

- expose part of the interal vscode API to allow for deeper customization
- fix a type in the EditorOptions (codeActionsOnSave is a Map<String, Boolean>)
- update some NPM dependencies

# 0.15.1

- update Monaco Editor to 0.15.6.
- update NPM dependencies

# 0.15.0

- update Monaco Editor to 0.15.1.
- update NPM dependencies (webpack, style-loader, css-loader)

# 0.14.4

- update NPM dependencies (webpack)
- also trigger events on the main element (PrimeFaces.widget.BaseWidget.jq)

# 0.14.3

- update NPM dependencies
- fix a build error with Windows (\ instead of /)
- fix issues #1 and #2

# 0.14.2

* Updated to monaco editor 0.14.3.

# 0.14.1

* Updated monaco editor to 0.14.2.
* Remove unused i18n keys, this reduced the file size of locales from ~500 KB to ~50KB.
* Workaround for some missing i18n keys. See [Microsoft/monaco-editor/issues/822](https://github.com/Microsoft/monaco-editor/issues/822)
* Prepare localization within web workers. The localization file is now respected by web workers (CSS/HTML/TYPESCRIPT/HTML) as well.
* Fixed a bug with web workers, certain library functions were not available to the web workers. `global.monaco` was set via webpack, but `monaco-editor` sets the variable itself.

# 0.13.1

* Initial release for monaco editor 0.13.1
