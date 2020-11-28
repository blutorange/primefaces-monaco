import { PromiseQueue } from "./promise-queue";
import { createEditorConstructionOptions, getScriptName, InlineEditorDefaults, loadEditorLib, loadExtender, loadLanguage } from "./util";
import { ExtMonacoEditorBase } from "./widget-base";

// Make sure the monaco environment is set.
const MonacoEnvironment = window.MonacoEnvironment = window.MonacoEnvironment || {};

// Queue for loading the editor.js only once
const GenericPromiseQueue = new PromiseQueue();

class ExtMonacoEditorInline extends ExtMonacoEditorBase {
  /**
   * @param  {...any[]} args Arguments as passed by PrimeFaces.
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * @param {Partial<typeof InlineEditorDefaults>} cfg
   */
  init(cfg) {
    super.init(cfg, InlineEditorDefaults);

    // Set monaco environment
    if (!("getWorker" in MonacoEnvironment)) {
      MonacoEnvironment.getWorker = this._createWorkerFactory();
    }
    if (!("Locale" in MonacoEnvironment)) {
      MonacoEnvironment.Locale = {
        data: {},
        language: "",
      };
    }

    this.addRefreshListener(() => this._onRefresh());
    this.addDestroyListener(() => this._onDestroy());

    // Begin loading the editor, but only load one editor at a time
    GenericPromiseQueue.add(() => this._setup())
      .then(args => this._renderDeferredAsync(args))
      .then(() => this._onInitSuccess())
      .catch(error => this._onInitError(error));
  }

  // === PUBLIC API, see primefaces-monaco.d.ts

  /**
   * @return {monaco.editor.IStandaloneCodeEditor}
   */
  getMonaco() {
    return this._editor;
  }

  /**
   * @template TReturn
   * @param {(editor: monaco.editor.IStandaloneCodeEditor) => TReturn} handler
   * @param {TReturn} defaultReturnValue
   * @return {TReturn | undefined}
   */
  withMonaco(handler, defaultReturnValue = undefined) {
    if (this._editor) {
      return handler(this._editor);
    }
    else {
      return defaultReturnValue;
    }
  }

  /**
   * @template TReturn
   * @param {(editor: monaco.editor.IStandaloneCodeEditor) => TReturn} handler
   * @param {TReturn} defaultReturnValue
   * @return {TReturn | undefined}
   */
  tryWithMonaco(handler, defaultReturnValue = undefined) {
    try {
      return this.withMonaco(handler, defaultReturnValue);
    }
    catch (e) {
      console.error("Handler failed to process monaco editor", e);
      return defaultReturnValue;
    }
  }

  /**
   * @return {string}
   */
  getValue() {
    if (this.isReady()) {
      return this.tryWithMonaco(monaco => monaco.getValue(), this._editorValue);
    }
    else {
      return this._editorValue;
    }
  }

  /**
   * @param {string} value
   */
  setValue(value) {
    if (this.isReady()) {
      this.tryWithMonaco(monaco => monaco.setValue(value));
    }
    else {
      this._editorValue = value;
    }
  }

  // === PRIVATE

  _onRefresh() {
    this._scrollTop = this.tryWithMonaco(monaco => monaco.getScrollTop(), 0);
    this._onDestroy();
  }

  _onDestroy() {
    const extender = this._extenderInstance;
    if (extender && typeof extender.beforeDestroy === "function") {
      extender.beforeDestroy(this);
    }
    if (this._resizeObserver !== undefined) {
      this._resizeObserver.disconnect(this.jq.get(0));
    }
    this.tryWithMonaco(monaco => monaco.dispose());
    if (extender && typeof extender.afterDestroy === "function") {
      extender.afterDestroy(this);
    }
  }

  /**
   * @return {Promise<{extender: any, options: Promise<monaco.editor.IEditorConstructionOptions>, wasLibLoaded: boolean}>}
   */
  async _setup() {
    const extender = loadExtender(this.options);
    this._extenderInstance = extender;
    const { forceLibReload, uiLanguageUri } = await loadLanguage(this.options);
    this._resolvedUiLanguageUri = uiLanguageUri;
    const wasLibLoaded = await loadEditorLib(this.options, forceLibReload);
    this.getEditorContainer().empty();
    const options = await createEditorConstructionOptions(this, extender, this._editorValue, wasLibLoaded);
    return { extender, options, wasLibLoaded };
  }

  /**
   * @param {{extender: MonacoExtender, options: monaco.editor.IEditorConstructionOptions, wasLibLoaded: boolean}} args Options to be passed on to the render method
   * @return {Promise<monaco.editor.IStandaloneCodeEditor>} A promise that resolves when the render method was called.
   */
  _renderDeferredAsync(args) {
    if (this.jq.closest(".ui-hidden-container").length === 0) {
      return Promise.reject("No hidden container found");
    }
    return new Promise((resolve, reject) => {
      this._renderArgs = { args, reject, resolve };
      this.renderDeferred();
    });
  }

  _render() {
    const { args, reject, resolve } = this._renderArgs;
    try {
      const editor = this._doRender(args);
      resolve(editor);
    }
    catch (e) {
      reject(e);
    }
  }

  /**
   * Creates a new monaco editor.
   * @param {{extender: MonacoExtender, options: monaco.editor.IEditorConstructionOptions, wasLibLoaded: boolean}} args Options to be passed on to the render method
   * @return {monaco.editor.IStandaloneCodeEditor}
   */
  _doRender(args) {
    const { extender, options, wasLibLoaded } = args;

    /** @type {monaco.editor.IEditorOverrideServices | undefined} */
    const override = extender && typeof extender.createEditorOverrideServices === "function" ? extender.createEditorOverrideServices(this, options) : undefined;

    // Create a new editor instance.
    this._editor = monaco.editor.create(this.getEditorContainer().get(0), options, override);

    // Restore scroll position (when ajax updating the editor)
    if (typeof this._scrollTop === "number" && this._scrollTop > 0) {
      this.tryWithMonaco(monaco => monaco.setScrollTop(this._scrollTop));
    }

    // Auto resize
    if (this.options.autoResize) {
      if (typeof ResizeObserver === "function") {
        this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
        this._resizeObserver.observe(this.jq.get(0));
      }
      else {
        console.warn("Browser environment does not support autoresize: window.ResizeObserver is not available.");
      }
    }

    // Event handling

    // Change event.
    // Set the value of the editor on the hidden textarea.
    this._editor.onDidChangeModelContent(changes => {
      this.tryWithMonaco(monaco => this.getInput().val(monaco.getModel().getValue()));
      this._fireEvent("change", changes);
    });

    // Focus / blur
    this._editor.onDidFocusEditorWidget(() => this._fireEvent("focus"));
    this._editor.onDidBlurEditorWidget(() => this._fireEvent("blur"));

    // Paste
    this._editor.onDidPaste(pasteEvent => this._fireEvent("paste", pasteEvent));

    // Mouse / Key
    this._editor.onMouseDown(mouseEvent => this._fireEvent("mousedown", mouseEvent));
    this._editor.onMouseMove(mouseEvent => this._fireEvent("mousemove", mouseEvent));
    this._editor.onMouseUp(mouseEvent => this._fireEvent("mouseup", mouseEvent));
    this._editor.onKeyDown(keyboardEvent => this._fireEvent("keydown", keyboardEvent));
    this._editor.onKeyUp(keyboardEvent => this._fireEvent("keyup", keyboardEvent));
    this._editor.onDidType(key => this._fireEvent("keypress", key));

    // After create callback
    if (typeof extender === "object" && typeof extender.afterCreate === "function") {
      extender.afterCreate(this, wasLibLoaded);
    }

    return this._editor;
  }

  _onResize() {
    this.tryWithMonaco(monaco => requestAnimationFrame(() => monaco.layout()));
  }

  /**
   * Create a web worker for the language services. This uses a proxied worker that imports the actual worker script.
   * The proxy imports the translated strings for the current locale to support localization even in the web workers
   *
   * @return {(moduleId: string, label: string) => Worker} The factory that creates the workers for JSON, CSS and other languages.
   */
  _createWorkerFactory() {
    return (moduleId, label) => {
      const extender = this._extenderInstance;
      if (typeof extender === "object" && typeof extender.createWorker === "function") {
        return extender.createWorker(this, moduleId, label);
      }
      else {
        const workerUrl = this._getMonacoResource(getScriptName(label));
        const interceptWorkerUrl = this._getMonacoResource("worker.js");
        return new Worker(interceptWorkerUrl + "&worker=" + encodeURIComponent(workerUrl) + "&locale=" + encodeURIComponent(this._resolvedUiLanguageUri || ""));
      }
    };
  }
}

PrimeFaces.widget.ExtMonacoEditorInline = ExtMonacoEditorInline;
