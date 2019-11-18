/// <reference path="../../npm/primefaces-monaco.d.ts" />

function getScriptName(label) {
    if (label === "json") {
        return "json.worker.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
        return "css.worker.js";
    }
    if (label === "html") {
        return "html.worker.js";
    }
    if (label === "typescript" || label === "javascript") {
        return "ts.worker.js";
    }
    return "editor.worker.js";
}

function endsWith(string, suffix) {
    var this_len = string.length;
    return string.substring(this_len - suffix.length, this_len) === suffix;
}

/**
 * @return {string} Base URL for resources
 */
function getBaseUrl() {
    var res = PrimeFaces.resources.getFacesResource("", "", "0");
    var idx = res.lastIndexOf(".xhtml");
    return idx >= 0 ? res.substring(0, idx) : res;
}

/**
 * @param {string} url URL from which to load the script.
 * @return {Promise<string>} The loaded JavaScript.
 */
async function getScript(url) {
    return jQuery.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        cache: true,
        async: true
    });
}

/**
 * Loads the extender for this monaco editor. It may be either
 *
 * - an empty string or undefined, in which case no extender is loaded
 * - a JavaScript expression that evaluates to an extender object
 * - a path to a resource (eg. `extender.js.xhtml?ln=mylib`) that evaluates to an extender object
 *
 * @param {Partial<typeof EditorDefaults>} options The extender string as specified on the component.
 * @return {Partial<MonacoExtender>}
 */
function loadExtender(options) {
    const extenderString = options.extender;

    // No extender given
    if (typeof extenderString === "undefined" || extenderString === "") {
        return {};
    }

    // Extender was evaluated already
    if (typeof extenderString === "object") {
        return extenderString;
    }

    // Try creating an extender from the factory
    if (typeof extenderString === "function") {
        try {
            const extender = extenderString();
            if (typeof extender === "object") {
                return extender;
            }
        }
        catch (e) {
            console.warn("Extender must be an expression that evaluates to MonacoExtender", e);
        }
    }

    // Could not create extender.
    console.warn("Extender was specified, but could not be loaded: ", extenderString);
    return {};
}

/**
 * @param {Partial<typeof EditorDefaults>} options
 * @return {Promise<{forceLibReload: boolean, uiLanguageUri: string}>}
 */
async function loadLanguage(options) {
    // Load language file, if requested.
    if (options.uiLanguage && MonacoEnvironment.Locale.language !== options.uiLanguage) {
        // Determine URI for loading the locale.
        const uri = options.uiLanguageUri ?
           getBaseUrl() + "uiLanguageUri" :
           PrimeFaces.resources.getFacesResource("/monacoEditor/locale/" + options.uiLanguage + ".js", "primefaces-blutorange", options.version);
        // And load UI language
        await getScript(uri);
        return {
            forceLibReload: true,
            uiLanguageUri: uri,
        };        
    }
    else {
        return {
            forceLibReload: MonacoEnvironment.Locale.language !== options.uiLanguage,
            uiLanguageUri: ""
        };
    }
}

/**
 * @param {Partial<typeof EditorDefaults>} options
 * @param {boolean} forceLibReload If true, loads the monaco editor again, even if it is loaded already. This is necessary in case the language changes.
 * @return {Promise<boolean>} Whether the monaco library was (re)loaded.
 */
async function loadEditorLib(options, forceLibReload) {
    if (!("monaco" in window) || forceLibReload) {
        if (!options.uiLanguage) {
            MonacoEnvironment.Locale = {
                language: "",
                data: {},
            };
        }
        const uriEditor = PrimeFaces.resources.getFacesResource("/monacoEditor/editor.js", "primefaces-blutorange", options.version);
        await getScript(uriEditor);
        return true;
    }
    else {
        return false;
    }
}

/**
 * Evaluate the `beforeCreate` callback of the extender. It is passed the current options and may
 *
 * - not return anything, in which case the passed options are used (which may have been modified inplace)
 * - return an options object, in which case these options are used
 * - return a promise, in which case the editor is initialized only once that promise resolves. The promise
 *   may resolve to a new options object to be used.
 *
 * @param {ExtMonacoEditor} widget
 * @param {MonacoExtender} extender 
 * @param {boolean} wasLibLoaded 
 * @return {Promise<monaco.editor.IEditorConstructionOptions>}
 */
async function createEditorConstructionOptions(widget, extender, wasLibLoaded) {
    const editorOptions = typeof widget.options.editorOptions === "object" ?
        widget.options.editorOptions :
        typeof widget.options.editorOptions === "string" ?
            JSON.parse(widget.options.editorOptions) :
            {};

    const model = createModel(widget.options, widget.id, widget._editorValue);
    const options = jQuery.extend({
        readOnly: widget.options.readonly || widget.options.disabled,
        model: model,
    }, editorOptions);

    if (typeof extender.beforeCreate === "function") {
        const result = extender.beforeCreate(widget, options, wasLibLoaded);
        if (typeof result === "object") {
            return typeof result.then === "function" ? (await result) || result : result;
        }
    }

    return options;
}

/**
 * @param {Partial<typeof EditorDefaults>} options
 * @param {string} id 
 * @param {string} value 
 * @returns {monaco.editor.ITextModel}
 */
function createModel(options, id, value = "") {
    const language = options.language || "plaintext";

    // Path, basename and extension
    /** @type {string} */
    let dir;
    /** @type {string} */
    let basename;
    /** @type {string} */
    let extension;

    if (options.directory) {
        dir = options.directory;
    }
    else {
        dir = String(id).replace(/[^a-zA-Z0-9_-]/g, "/");
    }
    if (basename) {
        basename = options.basename;
    }
    else {
        basename = "file";
    }
    if (options.ext) {
        extension = options.extension;
    }
    else {
        const langInfo = monaco.languages.getLanguages().filter(lang => lang.id === language)[0];
        extension = langInfo && langInfo.extensions.length > 0 ? langInfo.extensions[0] : "";
    }

    // Build path and uri
    if (dir.length > 0 && dir[dir.length - 1] !== "/") {
        dir = dir + "/";
    }
    if (extension.length > 0 && extension[0] !== ".") {
        extension = "." + extension;
    }
    if (endsWith(basename, extension)) {
        extension = "";
    }

    const uri = monaco.Uri.from({
        scheme: "inmemory",
        path: dir + basename + extension
    });

    // Create model and set value
    let model = monaco.editor.getModel(uri);
    if (!model) {
        model = monaco.editor.createModel(value, language, uri);
    }
    model.setValue(value);
    return model;
}

function isNullOrUndefined(x) {
    return x === null || x === undefined;
}

function isNotNullOrUndefined(x) {
    return x !== null && x !== undefined;
}

/**
 * Default options for the monaco editor widget configuration.
 */
const EditorDefaults = {
    autoResize: false,
    basename: "",
    directory: "",
    disabled: false,
    editorOptions: {},
    extender: "",
    extension: "",
    language: "plaintext",
    readonly: false,
    uiLanguage: "",
    uiLanguageUri: "",
    version: "1.0",
};

/**
 * @template T
 * @typedef {() => Promise<T>} PromiseFactory<T>
 */
const PromiseFactory = undefined; // jshint ignore:line

/**
 * A simple queue to which promise factories can be added. It makes sure the promises
 * are called (started) in the order as they were added.
 * @typedef {(value: any)=>void} PromiseCallback
 * @typedef {{factory: PromiseFactory<unknown>, resolve: PromiseCallback, reject: PromiseCallback}} QueueItem
 */
class PromiseQueue {
    constructor() {
        /** @type {QueueItem[]} */
        this.queue = [];
        /** @type {{resolve: PromiseCallback, reject: PromiseCallback}[]} */
        this.onDone = [];
    }
    /**
     * @template T
     * @param {PromiseFactory<T>} promiseFactory
     * @return {Promise<T>}
     */
    add(promiseFactory) {
        return this.addAll(promiseFactory)[0];
    }
    /**
     * @template T
     * @param {PromiseFactory<T>[]} promiseFactory 
     * @return {Promise<T>[]}
     */
    addAll(...promiseFactory) {
        return promiseFactory
            .filter(isNotNullOrUndefined)
            .map(factory => new Promise((resolve, reject) => {
                this.addQueueItem(factory, resolve, reject);
            }));
    }
    /**
     * 
     * @param {PromiseFactory<unknown>} factory 
     * @param {PromiseCallback} resolve 
     * @param {PromiseCallback} reject 
     */
    addQueueItem(factory, resolve, reject) {
        const wasEmpty = this.queue.length === 0;
        this.queue.push({
            factory: factory,
            resolve: resolve,
            reject: reject,
        });
        if (wasEmpty) {
            this.startQueue();
        }
    }
    startQueue() {
        this.processQueue(this.peek());
    }
    onPromiseDone() {
        this.poll();
        this.processQueue(this.peek());
    }
    /**
     * @param {QueueItem} queueItem 
     */
    processQueue(queueItem) {
        if (queueItem) {
            const promise = PromiseQueue.makePromise(queueItem.factory);
            promise
                .then(queueItem.resolve)
                .catch(queueItem.reject)
                .finally(() => this.onPromiseDone());    
        }
        else {
            this.onDone.forEach(({resolve}) => resolve());
            this.onDone = [];
        }
    }
    /**
     * @return {QueueItem}
     */
    poll() {
        return this.queue.shift();
    }
    /**
     * @return {QueueItem}
     */
    peek() {
        return this.queue[0];
    }
    /**
     * @return {Promise<undefined>}
     */
    allDone() {
        if (this.queue.length === 0) {
            return Promise.resolve();
        }
        else {
            return new Promise((resolve, reject) => {
                this.onDone.push({resolve, reject});
            });    
        }
    }
    /**
     * @param {PromiseFactory<unknown>} promiseFactory 
     * @return {Promise<unknown>}
     */
    static makePromise(promiseFactory) {
        try {
            const promise = promiseFactory();
            if (promise !== undefined) {
                return promise;
            }
        }
        catch (e) {
            console.error("Could not create promise", e);
        }
        return Promise.resolve();
    }
}

// Make sure the monaco environment is set.
const MonacoEnvironment = window.MonacoEnvironment = window.MonacoEnvironment || {};

// Queue for loading the editor.js only once
const GenericPromiseQueue = new PromiseQueue();

class ExtMonacoEditor extends PrimeFaces.widget.DeferredWidget {
    /**
     * @param  {...any[]} args Arguments as passed by PrimeFaces.
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * 
     * @param {Partial<typeof EditorDefaults>} cfg 
     */
    init(cfg) {
        super.init(cfg);

        // Set defaults.
        /** @type {typeof EditorDefaults} */
        this.options = jQuery.extend({}, EditorDefaults, this.cfg);

        /** @type {{resolve: (widget: ExtMonacoEditor) => void, reject: (reason: any) => void}[]} */
        this._onDone = [];
        this.jq.data("initialized", false);
        this.scrollTop = this.scrollTop || 0;

        // Get elements
        this._input = this.jq.find(".ui-helper-hidden-accessible textarea");
        this._editorContainer = this.jq.children(".ui-monaco-editor-ed");

        // Default to the given value
        this._editorValue = this.getInput().val();

        // English is the default.
        if (this.options.uiLanguage === "en") {
            this.options.uiLanguage = "";
        }

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

        this.addRefreshListener(() => this.onRefresh());
        this.addDestroyListener(() => this.onDestroy());

        // Begin loading the editor, but only load one editor at a time
        GenericPromiseQueue.add(() => this._setup()).then(() => {
            this._fireEvent("initialized");
            this.jq.data("initialized", true);
            this.setValue(this._editorValue);
            for (const {resolve} of this._onDone) {
                resolve(this);
            }
            this._onDone = [];
        }).catch(error => {
            console.error("Failed to initialize monaco editor", error);
            for (const {reject} of this._onDone) {
                reject(error);
            }
            this._onDone = [];
        });
    }

    /**
     * @return {monaco.editor.IStandaloneCodeEditor} Instance of the monacor editor, or undefined if this widget is not yet initialized.
     */
    getMonaco() {
        return this._editor;
    }

    /**
     * @returns {jQuery} The hidden textarea holding the value.
     */
    getInput() {
        return this._input;
    }

    /**
     * @returns {jQuery} The element holding the editor.
     */
    getEditorContainer() {
        return this._editorContainer;
    }

    /**
     * @return {Promise<ExtMonacoEditor>} A promise that is resolved once the editor has finished loading.
     */
    whenReady() {
        if (this.isReady()) {
            return Promise.resolve(this);
        }
        return new Promise((resolve, reject) => {
            this._onDone.push({resolve, reject});
        });
    }

    /**
     * Gets the value of this editor. May be called as soon as this widget is accessible,
     * even when the monaco editor was not loaded or initialized yet.
     * @return {string} The current value of this editor.
     */
    getValue() {
        if (this.isReady()) {
            return this.getMonaco().getValue();
        }
        else {
            return this._editorValue;
        }
    }

    /**
     * Sets the value of this editor. May be called as soon as this widget is accessible,
     * even when the monaco editor was not loaded or initialized yet.
     * @param {string} value The new value to set.
     */
    setValue(value) {
        if (this.isReady()) {
            this.getMonaco().setValue(value);
        }
        else {
            this._editorValue = value;
        }
    }

    onRefresh() {
        this.scrollTop = this.getMonaco().getScrollTop();
        this.onDestroy();
    }

    onDestroy() {
        const extender = this._extenderInstance;
        const monaco = this.getMonaco();
        if (extender && typeof extender.beforeDestroy === "function") {
            extender.beforeDestroy(this);
        }
        if (this._resizeObserver !== undefined) {
            this._resizeObserver.disconnect(this.jq.get(0));
        }
        if (monaco !== undefined) {
            monaco.dispose();
        }
        if (extender && typeof extender.afterDestroy === "function") {
            extender.afterDestroy(this);
        }
    }

    /**
     * @return {boolean} `true` if the monaco editor is fully initialized yet, `false` otherwise.
     */
    isReady() {
        return this.jq.data("initialized");
    }

    /**
     * @return {Promise<monaco.editor.IStandaloneCodeEditor>}
     */
    async _setup() {
        const extender = loadExtender(this.options);
        this._extenderInstance = extender;
        const {forceLibReload, uiLanguageUri} = await loadLanguage(this.options);
        this._resolvedUiLanguageUri = uiLanguageUri;
        const wasLibLoaded = await loadEditorLib(this.options, forceLibReload);
        this.getEditorContainer().empty();
        const options = await createEditorConstructionOptions(this, extender, wasLibLoaded);
        const editor = await this._renderDeferredAsync({extender, options, wasLibLoaded});
        return editor;
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
        if (typeof this.scrollTop === "number" && this.scrollTop > 0) {
            this.getMonaco().setScrollTop(this.scrollTop);
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
            this.getInput().val(this.getMonaco().getModel().getValue());
            this._fireEvent('change', changes);
        });

        // Focus / blur
        this._editor.onDidFocusEditorWidget(() => this._fireEvent('focus'));
        this._editor.onDidBlurEditorWidget(() => this._fireEvent('blur'));

        // Paste
        this._editor.onDidPaste(range => this._fireEvent('paste', range));

        // Mouse / Key
        this._editor.onMouseDown(mouseEvent => this._fireEvent('mousedown', mouseEvent));
        this._editor.onMouseMove(mouseEvent => this._fireEvent('mousemove', mouseEvent));
        this._editor.onMouseUp(mouseEvent => this._fireEvent('mouseup', mouseEvent));
        this._editor.onKeyDown(keyboardEvent => this._fireEvent('keydown', keyboardEvent));
        this._editor.onKeyUp(keyboardEvent => this._fireEvent('keyup', keyboardEvent));
        this._editor.onDidType(key => this._fireEvent('keypress', key));

        // After create callback
        if (typeof extender.afterCreate === "function") {
            extender.afterCreate(this, wasLibLoaded);
        }

        return this._editor;
    }

    _onResize() {
        const monaco = this.getMonaco();
        if (monaco !== undefined) {
            monaco.layout();
        }
    }

    _fireEvent(eventName, ...params) {
        var onName = "on" + eventName;
        this.jq.trigger("monacoEditor:" + eventName, params);
        if (typeof this.options[onName] === "function") {
            this.options[onName].apply(this, params || []);
        }
        this.callBehavior(eventName, {
            params: params || {}
        });
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
                const workerUrl = PrimeFaces.resources.getFacesResource("monacoEditor/" + getScriptName(label), "primefaces-blutorange", this.options.version);
                const interceptWorkerUrl = PrimeFaces.resources.getFacesResource("monacoEditor/worker.js", "primefaces-blutorange", this.options.version);
                return new Worker(interceptWorkerUrl + "&worker=" + encodeURIComponent(workerUrl) + "&locale=" + encodeURIComponent(this._resolvedUiLanguageUri || ""));
            }
        };
    }
}

PrimeFaces.widget.ExtMonacoEditor = ExtMonacoEditor;
