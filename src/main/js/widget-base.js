import { getMonacoResource } from "./util";

/**
 * @template {ExtMonacoEditorBase} T
 */
export class ExtMonacoEditorBase extends PrimeFaces.widget.DeferredWidget {
  /**
   * @param  {...any[]} args Arguments as passed by PrimeFaces.
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * @template {typeof import("./util").BaseEditorDefaults} TDefaults
   * @param {Partial<TDefaults>} cfg
   * @param {TDefaults} editorDefaults
   */
  init(cfg, editorDefaults) {
    super.init(cfg);

    // Set defaults.
    /** @type {typeof InlineEditorDefault} */
    this.options = jQuery.extend({}, editorDefaults, this.cfg);

    /** @type {{resolve: (widget: T) => void, reject: (reason: any) => void}[]} */
    this._onDone = [];
    this.jq.data("initialized", false);
    this._scrollTop = this._scrollTop || 0;

    // Get elements
    /** @type {JQuery} */
    this._input = this.jq.find(".ui-helper-hidden-accessible textarea");
    /** @type {JQuery} */
    this._editorContainer = this.jq.children(".ui-monaco-editor-ed");

    // Default to the given value
    /** @type {string} */
    this._editorValue = this.getInput().val() || "";

    // English is the default.
    if (this.options.uiLanguage === "en") {
      this.options.uiLanguage = "";
    }
  }

  // === PUBLIC API, see monaco-editor.d.ts

  /**
   * @returns {JQuery}
   */
  getInput() {
    return this._input;
  }

  /**
   * @returns {JQuery}
   */
  getEditorContainer() {
    return this._editorContainer;
  }

  /**
   * @return {boolean}
   */
  isReady() {
    return this.jq.data("initialized");
  }

  /**
   * @return {Promise<T>}
   */
  whenReady() {
    if (this.isReady()) {
      return Promise.resolve(this);
    }
    return new Promise((resolve, reject) => {
      this._onDone.push({ resolve, reject });
    });
  }

  // === INTERNAL

  /**
   * @param {string} resource
   * @param {Record<string, string | string[]>} queryParams
   * @return {string}
   */
  _getMonacoResource(resource, queryParams = {}) {
    return getMonacoResource(resource, this.options.version, queryParams);
  }

  /**
   * @param {string} eventName
   * @param  {...any} params
   */
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
   * @return {string[]}
   */
  _listSupportedEvents() {
    return this.cfg.availableEvents.filter(event => {
      return this.hasBehavior(event) || this.cfg[`on${event}`];
    });
  }

  /**
   * A subset of the widget configuration that can be sent to the iframe.
   */
  _createCloneableOptions() {
    const options = {};
    for (const key of Object.keys(this.options)) {
      const value = this.options[key];
      if (key !== "behaviors" && typeof value !== "function") {
        options[key] = value;
      }
    }
    return options;
  }

  /**
   * Should be called once the editor was created.
   */
  _onInitSuccess() {
    this._fireEvent("initialized");
    this.jq.data("initialized", true);
    this.setValue(this._editorValue);
    for (const { resolve } of this._onDone) {
      resolve(this);
    }
    this._onDone = [];
  }

  /**
   * Should be called in case initialization fails.
   * @param {any} error
   */
  _onInitError(error) {
    console.error("Failed to initialize monaco editor", error);
    for (const { reject } of this._onDone) {
      reject(error);
    }
    this._onDone = [];
  }
}
