/// <reference path="../../npm/primefaces-monaco.d.ts" />

function getScriptName(label) {
    if (label === 'json') {
        return 'json.worker.js';
    }
    if (label === 'css') {
        return 'css.worker.js';
    }
    if (label === 'html') {
        return 'html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
        return 'ts.worker.js';
    }
    return 'editor.worker.js';
}

function endsWith(string, suffix) {
    var this_len = string.length;
    return string.substring(this_len - suffix.length, this_len) === suffix;
}

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
    if (typeof extenderString === "undefined") {
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

    const model = createModel(widget.options, widget.id, widget.getInput().val());
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
        extension = options.ext;
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

// Make sure the monaco environment is set.
const MonacoEnvironment = window.MonacoEnvironment = window.MonacoEnvironment || {};

class ExtMonacoEditor extends PrimeFaces.widget.BaseWidget {
    /**
     * @param  {...any[]} args Arguments as passed by PrimeFaces.
     */
    constructor(...args) {
        super(...args);
        /* super calls #init
        this._editor = undefined;
        this._editorContainer = $();
        this._extenderInstance = undefined;
        this._input = jQuery();
        this._resizeObserver = undefined;
        this._resolvedUiLanguageUri = "";
        this.options = jQuery.extend({}, EditorDefaults);
        */
    }

    init(cfg) {
        super.init(cfg);

        // Set defaults.
        this.options = jQuery.extend({}, EditorDefaults, this.cfg);

        // Get elements
        this._input = this.jq.find(".ui-helper-hidden-accessible textarea");
        this._editorContainer = this.jq.children(".ui-monaco-editor-ed");

        // Remove any existing editor.
        this.destroy();

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

        // Begin loading the editor
        this._setup().then(() => {
            this._fireEvent("initialized");
            this.jq.data("initialized", true);    
        }).catch(error => {
            console.error("Failed to initialize monaco editor", error);
        });
    }

    /**
     * @return {monaco.editor.IStandaloneCodeEditor} Instance of the monacor editor, or undefined if this widget is not yet initialized.
     */
    getMonaco() {
        return this._editor;
    }

    destroy() {
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

    async _setup() {
        const extender = loadExtender(this.options);
        this._extenderInstance = extender;
        const {forceLibReload, uiLanguageUri} = await loadLanguage(this.options);
        this._resolvedUiLanguageUri = uiLanguageUri;
        const wasLibLoaded = await loadEditorLib(this.options, forceLibReload);
        this.getEditorContainer().empty();
        const editorConstructionOptions = await createEditorConstructionOptions(this, extender, wasLibLoaded);
        this._render(editorConstructionOptions, extender, wasLibLoaded);
        return;
    }

    /**
     * 
     * @param {monaco.editor.IEditorConstructionOptions} options 
     * @param {MonacoExtender} extender 
     * @param {boolean} wasLibLoaded 
     */
    _render(options, extender, wasLibLoaded) {
        // Create a new editor instance.
        this._editor = monaco.editor.create(this.getEditorContainer().get(0), options);

        // Evaluate the `afterCreate` callback of the extender.
        if (typeof extender.afterCreate === "function") {
            extender.afterCreate(this, wasLibLoaded);
        }

        // Resize
        if (this.options.autoResize) {
            if (typeof ResizeObserver === "function") {
                this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
                this._resizeObserver.observe(this.jq.get(0));
            }
            else {
                console.warn("Browser environment does not support autoresize. window.ResizeObserver is not defined.");
            }
        }

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
