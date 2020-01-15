# primefaces-monaco

Monaco editor is the code editor which powers [VS Code](https://github.com/Microsoft/vscode), with the features better described [here](https://code.visualstudio.com/docs/editor/editingevolved).

`primefaces-monaco` is wrapper for monaco editor that lets your use it as a JSF component.

This is the documentation for the client-side part of the API, see the [project page on github](https://github.com/blutorange/primefaces-monaco) for more info on the project.

# Overview

You create the monaco editor widget by including it in an XHTML page. A basic
usage would look like this:

```xml
<blut:monaco widgetVar="editor" value="..." extender="createExtender()"/>
```

See [here](../vdldoc/index.html) for the tag documentation. The client-side API
consists of the following pieces:

* You can use `PF("editor")` to get access to the widget instance. This will
return an instance of [ExtMonacoEditorInline](./interfaces/primefaces.widget.extmonacoeditorinline.html) or [ExtMonacoEditorFramed](./interfaces/primefaces.widget.extmonacoeditorframed.html).
* If specified, the `extender` needs to either evaluate to an instance of
[MonacoExtenderInline](./interfaces/monacoextenderinline.html) (inline widget); or
be an URL to a script that creates an instance of [MonacoExtenderFramed](./interfaces/monacoextenderframed.html)
(framed widget) and saves it to `window.MonacoEnvironment.Extender`. It lets you
customize the editor if the widget options should not suffice.
* If you use this widget, the monaco editor library will be loaded and is available
via [window.monaco](./modules/monaco.html). This is the same as the
[official monaco editor API](https://microsoft.github.io/monaco-editor/api/index.html).