/// <reference path="../../npm/src/primefaces-monaco.d.ts" />

import { FramedEditorDefaults, getFacesResourceUri, resolveUiLanguageUrl } from "./util";
import { ExtMonacoEditorBase } from "./widget-base";

let InstanceId = 0;
let MessageId = 0;

class ExtMonacoEditorFramed extends ExtMonacoEditorBase {
    /**
     * @param  {...any[]} args Arguments as passed by PrimeFaces.
     */
    constructor(...args) {
        super(...args);
    }

    /**
     * @param {Partial<typeof FramedEditorDefaults>} cfg 
     */
    init(cfg) {
        super.init(cfg, FramedEditorDefaults);

        this.addRefreshListener(() => this._onRefresh());
        this.addDestroyListener(() => this._onDestroy());

        this._instanceId = ++InstanceId;
        /** @type {Map<number, {resolve: (value: any) => void, reject: (error: string) => void}>} */
        this._responseMap = new Map();
        this._resolvedUiLanguageUri = resolveUiLanguageUrl(this.options);

        // Initialize iframe
        const iframeUrl = this._getMonacoResource("monaco-iframe.html", {
            bootstrap: [
                this.options.extender ? getFacesResourceUri() + this.options.extender : "",
                this._resolvedUiLanguageUri,
                this._getMonacoResource("editor.js"),
                this._getMonacoResource("monaco-iframe.js")
            ],
            instanceId: this._instanceId,
        });
        this._getIframe().src = iframeUrl;

        // Communicate with iframe
        if (this._messageListener) {
            window.removeEventListener("message", this._messageListener);
        }
        this._messageListener = event => this._onMessage(event);
        window.addEventListener("message", this._messageListener);
    }

    // === PUBLIC API, see monaco-editor.d.ts

    layout() {
        this.invokeMonaco("layout");
    }

    /**
     * @template {keyof import("../../npm/node_modules/monaco-editor").editor.IStandaloneCodeEditor} TMethod
     * @param {TMethod} method
     * @param {Parameters<import("../../npm/node_modules/monaco-editor").editor.IStandaloneCodeEditor[TMethod]>} args
     * @return {Promise<ReturnType<import("../../npm/node_modules/monaco-editor").editor.IStandaloneCodeEditor[TMethod]>>}
     */
    invokeMonaco(method, ...args) {
        return this._postPromise({
            kind: "invokeMonaco",
            data: {
                method,
                args,
            },
        });
    }

    /**
     * @return {Promise<string>}
     */
    getValue() {
        if (this.isReady()) {
            return this.invokeMonaco("getValue");
        }
        else {
            return Promise.resolve(this._editorValue);
        }
    }

    /**
     * @param {string} value
     * @return {Promise<void>}
     */
    setValue(value) {
        if (this.isReady()) {
            return this.invokeMonaco("setValue", value);
        }
        else {
            this._editorValue = value;
            return Promise.resolve(undefined);
        }
    }

    // === INTERNAL

    _onRefresh() {
        this._onDestroy();
    }

    _onDestroy() {
        this._postMessage({
            kind: "destroy",
            data: undefined,
        });
        if (this._messageListener) {
            window.removeEventListener("message", this._messageListener);
            this._messageListener = undefined;
        }
    }

    /**
     * @return {HTMLIFrameElement}
     */
    _getIframe() {
        return this.getEditorContainer().get(0);
    }

    _render() {
        this._postMessage({
            kind: "init",
            data: {
                facesResourceUri: getFacesResourceUri(),
                id: this.id,
                options: this._createCloneableOptions(),
                resolvedUiLanguageUri: this._resolvedUiLanguageUri,
                scrollTop: this._scrollTop,
                supportedEvents: this._listSupportedEvents(),
                value: this._editorValue,
            },
        });
    }

    // === MESSAGING

    /**
     * Post a message to the monaco editor iframe via `postMessage`, and get a
     * promise that resolves with the response.
     * @param {MonacoMessage} message
     * @return {Promise<any>}
     */
    _postPromise(message) {
        const messageId = this._postMessage(message);
        return new Promise((resolve, reject) => {
            this._responseMap.set(messageId, {resolve, reject}); 
        });
    }

    /**
     * Post a message to the monaco editor iframe via `postMessage`.
     * @param {MonacoMessage} message
     */
    _postMessage(message) {
        const iframe = this._getIframe();
        if (iframe && iframe.contentWindow) {
            const messageId = ++MessageId;
            iframe.contentWindow.postMessage({
                instanceId: this._instanceId,
                messageId,
                ...message,
            }, window.location.href);
            return messageId;
        }
        else {
            return -1;
        }
    }
    
    /**
     * Callback when the iframe sends a message via `postMessage`
     * @param {MessageEvent} event 
     */
    _onMessage(event) {
        if (typeof event.data === "object" && typeof event.data.kind === "string") {
            /** @type {MonacoMessage} */
            const message = event.data;
            if (this._instanceId >= 0 && message.instanceId >= 0 && this._instanceId !== message.instanceId) {
                // this is normal when there are multiple editors all sending messages
                return;
            }
            switch (message.kind) {
                case "load":
                    this._onMessageLoad();
                    break;
                case "response":
                    this._onMessageResponse(message.messageId, message.data);
                    break;
                case "valueChange":
                    this._onMessageValueChange(message.data);
                    break;
                case "scrollChange":
                    this._onMessageScrollChange(message.data);
                    break;
                case "domEvent":
                    this._onMessageDomEvent(message.data);
                    break;
                case "afterInit":
                    this._onMessageAfterInit(message.data);
                    break;
                default:
                    console.warn("Unhandled message", event.data);
            }
        }
    }

    /**
     * Called when the iframe document is ready.
     */
    _onMessageLoad() {
        this.renderDeferred();
    }

    /**
     * Called when the iframe sends a response to a message.
     * @param {number} messageId
     * @param {ResponseMessageData} data 
     */
    _onMessageResponse(messageId, data) {
        if (this._responseMap.has(messageId)) {
            const {resolve, reject} = this._responseMap.get(messageId);
            this._responseMap.delete(messageId);
            if (data.success) {
                resolve(data.value);
            }
            else {
                reject(data.error);
            }
        }
    }

    /**
     * Called when the value of the monaco editor in the iframe has changed.
     * @param {ValueChangeMessageData} data 
     */
    _onMessageValueChange(data) {
        this.getInput().val(data.value || "");
        this._fireEvent("change", data.changes);
    }

    /**
     * Called when the scroll position of the monaco editor in the iframe has changed.
     * @param {ScrollChangeMessageData} data 
     */
    _onMessageScrollChange(data) {
        this._scrollTop = data.scrollTop;
    }

    /**
     * Called when a DOM even such as `blur` or `keyup` was triggered on the
     * monaco editor in the iframe.
     * @param {DomEventMessageData} data 
     */
    _onMessageDomEvent(data) {
        const args = data.data ? JSON.parse(data.data) : [];
        this._fireEvent(data.name, ...args);
    }

    /**
     * Called after the monaco editor in the iframe was initialized, and also
     * in case an error occurred.
     * @param {AfterInitMessageData} success 
     */
    _onMessageAfterInit(data) {
        if (data.success) {
            this._onInitSuccess();
        }
        else {
            this._onInitError(data.error);
        }
    }
}

PrimeFaces.widget.ExtMonacoEditorFramed = ExtMonacoEditorFramed;