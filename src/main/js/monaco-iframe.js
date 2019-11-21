import { createEditorConstructionOptions, FramedEditorDefaults, getScriptName } from "./util";

const ScrollTriggerInterval = 500;

class MonacoIframeContext {
    constructor() {
        this.options = Object.assign({}, FramedEditorDefaults);
        /** @type {Partial<import("../../npm/src/primefaces-monaco").MonacoExtenderInline>} */
        this.extender = MonacoEnvironment.Extender || {};
        this._facesResourceUri = "";
        this._resolvedUiLanguageUri = "";
        this._editorContainer = document.createElement("div");
        this._instanceId = window.MonacoEnvironment.InstanceId;
        this._isScrollChangeQueued = false;
        /** @type {Set<string>} */
        this._supportedEvents = new Set();
        /** @type {import("../../npm/node_modules/monaco-editor").editor.IStandaloneCodeEditor | undefined} */
        this._editor = undefined;
        /** @type {ResizeObserver | undefined} */
        this._resizeObserver = undefined;
        window.addEventListener("message", event => this._onMessage(event));
        window.addEventListener("load", event => this._onLoad(event));
    }

    // === PUBLIC API, see primefaces-onaco.d.ts

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
     * @param {(editor: import("../../npm/node_modules/monaco-editor").editor.IStandaloneCodeEditor) => TReturn} handler
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

    // === PRIVATE

    async _render(value, scrollTop) {
        MonacoEnvironment.getWorker = this._createWorkerFactory();

        // Create editor options
        const editorOptions = await createEditorConstructionOptions(this, this.extender, value, true);
        const overrideServices = typeof this.extender.createEditorOverrideServices === "function" ? this.extender.createEditorOverrideServices(this, editorOptions) : undefined;

        // Create a new editor instance.
        this._editor = monaco.editor.create(this._editorContainer, editorOptions, overrideServices);

        // Restore scroll position
        if (typeof scrollTop === "number" && scrollTop > 0) {
            this.tryWithMonaco(monaco => monaco.setScrollTop(scrollTop));
        }

        // Auto resize
        if (this.options.autoResize) {
            if (typeof ResizeObserver === "function") {
                this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
                this._resizeObserver.observe(this._editorContainer);
            }
            else {
                console.warn("Browser environment does not support autoresize: window.ResizeObserver is not available.");
            }
        }

        // Event handling

        // Change event.
        this._editor.onDidChangeModelContent(changes => this._onValueChanged(changes));

        // Focus
        this._addDomEventListener("focus", fn => this._editor.onDidFocusEditorWidget(fn));
        this._addDomEventListener("blur", fn => this._editor.onDidBlurEditorWidget(fn));

        // Paste
        this._addDomEventListener("paste", fn => this._editor.onDidPaste(fn));

        // Mouse
        this._addDomEventListener("mousedown", fn => this._editor.onMouseDown(fn));
        this._addDomEventListener("mousemove", fn => this._editor.onMouseMove(fn));
        this._addDomEventListener("mouseup", fn => this._editor.onMouseUp(fn));

        // Key
        this._addDomEventListener("keydown", fn => this._editor.onKeyDown(fn));
        this._addDomEventListener("keyup", fn => this._editor.onKeyUp(fn));
        this._addDomEventListener("keypress", fn => this._editor.onDidType(fn));

        // Scroll
        this._editor.onDidScrollChange(event => this._onScrollChanged(event));

        // After create callback
        if (typeof this.extender.afterCreate === "function") {
            this.extender.afterCreate(this, true);
        }
    }

    /**
     * @param {Event} event 
     */
    _onLoad(event) {
        this._editorContainer = document.getElementById("editor");
        this._postMessage({
            kind: "load",
            data: undefined,
        });
    }

    _onResize() {
        this.tryWithMonaco(monaco => monaco.layout());
    }

    /**
     * @param {import("../../npm/node_modules/monaco-editor").IScrollEvent} event
     */
    _onScrollChanged(event) {
        if (!this._isScrollChangeQueued) {
            this._isScrollChangeQueued = true;
            setTimeout(() => this._handleScrollChange(), ScrollTriggerInterval);            
        }
    }

    _handleScrollChange() {
        this._isScrollChangeQueued = false;
        this.tryWithMonaco(monaco => {
            this._postMessage({
                kind: "scrollChange",
                data: {
                    scrollTop: monaco.getScrollTop(),
                    scrollLeft: monaco.getScrollLeft(),
                },
            });
        });
    }

    /**
     * @param {import("../../npm/node_modules/monaco-editor").editor.IModelContentChange} changes 
     */
    _onValueChanged(changes) {
        if (this._editor && this._editor.getModel()) {
            this._postMessage({
                kind: "valueChange",
                data: {
                    changes,
                    value: this._editor.getModel().getValue(),
                }
            });
        }
    }

    /**
     * @return {(moduleId: string, label: string) => Worker}
     */
    _createWorkerFactory() {
        return (moduleId, label) => {
            if (typeof this.extender.createWorker === "function") {
                return this.extender.createWorker(this, moduleId, label);
            }
            else {
                const workerUrl = this._getMonacoResource(getScriptName(label));
                const interceptWorkerUrl = this._getMonacoResource("worker.js");
                return new Worker(interceptWorkerUrl + "&worker=" + encodeURIComponent(workerUrl) + "&locale=" + encodeURIComponent(this._resolvedUiLanguageUri || ""));
            }
        };
    }

    /**
     * @param {string} name 
     * @param {(...args: any[]) => void} register 
     */
    _addDomEventListener(name, register) {
        if (this._supportedEvents.has(name)) {
            register((...data) => this._postMessage({
                kind: "domEvent",
                data: {
                    name,
                    // Remove non-cloneable data
                    data: data.length > 0 ? JSON.stringify(data) : "",
                },
            }));
        }
    }

    /**
     * @param {string} resource 
     */
    _getMonacoResource(resource) {
        return `${this._facesResourceUri}monacoEditor/${resource}.xhtml?ln=primefaces-blutorange&v=${encodeURIComponent(this.options.version)}`;
    }

    // === MESSAGING

    /**
     * @param {MonacoMessage} message 
     */
    _postMessage(message) {
        window.parent.postMessage({
            instanceId: this._instanceId,
            ...message
        }, window.location.href);
    }

    /**
     * @param {MessageEvent} event 
     */
    _onMessage(event) {
        if (typeof event.data === "object" && typeof event.data.kind === "string") {
            /** @type {MonacoMessage} */
            const message = event.data;
            if (this._instanceId >= 0 && message.instanceId >= 0 && this._instanceId !== message.instanceId) {
                console.warn("Received message", message.kind, "with wrong instance ID (expected:", this._instanceId, "actual:", message.instanceId, "). This message will be ignored.");
                return;
            }
            switch (message.kind) {
                case "init":
                    this._onMessageInit(message.data);
                    break;
                case "destroy":
                    this._onMessageDestroy();
                    break;
                case "invokeMonaco":
                    this._onMessageInvokeMonaco(message.messageId, message.data);
                    break;
                default:
                    console.warn("Unhandled message", event.data);
            }
        }
    }

    _sendResponse(messageId, fn, errorMessageSupplier) {
        try {
            const returnValue = fn();
            this._postMessage({
                kind: "response",
                messageId,
                data: {
                    success: true,
                    value: returnValue,
                },
            });
        }
        catch (e) {
            console.error(errorMessageSupplier() + ":", e);
            this._postMessage({
                kind: "response",
                messageId,
                data: {
                    success: false,
                    error: e.message,
                },
            });
        }
    }

    /**
     * @param {InitMessageData} data 
     */
    _onMessageInit(data) {
        this.options = data.options;
        this.id = data.id;
        this._facesResourceUri = data.facesResourceUri;
        this._resolvedUiLanguageUri = data.resolvedUiLanguageUri;
        this._supportedEvents = new Set(data.supportedEvents);
        this._render(data.value, data.scrollTop).then(() => {
            this._postMessage({
                kind: "afterInit",
                data: {
                    success: true,
                },
            });
        }).catch(e => {
            console.error("Failed to render monaco editor:", e);
            this._postMessage({
                kind: "afterInit",
                data: {
                    success: false,
                    error: e.message,
                },
            });
        });
    }

    _onMessageDestroy() {
        if (typeof this.extender.beforeDestroy === "function") {
            this.extender.beforeDestroy(this);
        }
        if (this._resizeObserver !== undefined && this._editorContainer !== undefined) {
            this._resizeObserver.disconnect(this._editorContainer);
        }
        this.tryWithMonaco(monaco => monaco.dispose());
        if (typeof this.extender.afterDestroy === "function") {
            this.extender.afterDestroy(this);
        }
    }

    /**
     * @param {number} messageId
     * @param {InvokeMonacoMessageData} data
     */
    _onMessageInvokeMonaco(messageId, data) {
        this._sendResponse(
            messageId,
            () => this._editor[data.method](...data.args),
            () => "Could not invoke " + data.method + " on monaco editor"
        );
    }
}

window.MonacoEnvironment.IframeContext = new MonacoIframeContext();