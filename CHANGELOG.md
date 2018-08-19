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