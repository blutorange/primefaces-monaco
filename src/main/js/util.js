/// <reference path="../../npm/src/primefaces-monaco.d.ts" />

export function getScriptName(label) {
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

export function endsWith(string, suffix) {
  var this_len = string.length;
  return string.substring(this_len - suffix.length, this_len) === suffix;
}

/**
 * @return {string} Base URL for resources
 */
export function getFacesResourceUri() {
  var res = PrimeFaces.resources.getFacesResource("", "", "0");
  var idx = res.lastIndexOf(".xhtml");
  return idx >= 0 ? res.substring(0, idx) : res;
}

/**
 * @param {string} url URL from which to load the script.
 * @return {Promise<string>} The loaded JavaScript.
 */
export async function getScript(url) {
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
 * @param {Partial<typeof BaseEditorDefaults>} options The extender string as specified on the component.
 * @return {Partial<MonacoExtender>}
 */
export function loadExtender(options) {
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
 * @param {Partial<typeof BaseEditorDefaults>} options
 * @return {string}
 */
export function resolveUiLanguageUrl(options) {
  // Load language file, if requested.
  if (options.uiLanguage) {
    // Determine URI for loading the locale.
    return options.uiLanguageUri ?
      getFacesResourceUri() + "uiLanguageUri" :
      getMonacoResource(`locale/${options.uiLanguage}.js`, options.version);
  }
  else {
    return "";
  }
}

/**
 * @param {Partial<typeof BaseEditorDefaults>} options
 * @return {Promise<{forceLibReload: boolean, uiLanguageUri: string}>}
 */
export async function loadLanguage(options) {
  // Load language file, if requested.
  const localeUri = resolveUiLanguageUrl(options);
  if (localeUri && MonacoEnvironment.Locale.language !== options.uiLanguage) {
    await getScript(localeUri);
    return {
      forceLibReload: true,
      uiLanguageUri: localeUri,
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
 * @param {string} resource
 * @param {string} version
 * @param {Record<string, string | string[]>} queryParams
 * @return {string}
 */
export function getMonacoResource(resource, version, queryParams = {}) {
  const url = PrimeFaces.resources.getFacesResource("/monacoEditor/" + resource, "primefaces-blutorange", version);
  const params = [];
  for (const key of Object.keys(queryParams)) {
    const values = Array.isArray(queryParams[key]) ? queryParams[key] : [queryParams[key]];
    for (const value of values) {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return params.length > 0 ? `${url}&${params.join("&")}` : url;
}

/**
 * @param {Partial<typeof BaseEditorDefaults>} options
 * @param {boolean} forceLibReload If true, loads the monaco editor again, even if it is loaded already. This is necessary in case the language changes.
 * @return {Promise<boolean>} Whether the monaco library was (re)loaded.
 */
export async function loadEditorLib(options, forceLibReload) {
  if (!("monaco" in window) || forceLibReload) {
    if (!options.uiLanguage) {
      MonacoEnvironment.Locale = {
        language: "",
        data: {},
      };
    }
    const uriEditor = getMonacoResource("editor.js", options.version);
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
 * @param {import("../../npm/src/primefaces-monaco").MonacoContext} context
 * @param {import("../../npm/src/primefaces-monaco").MonacoExtenderBase} extender
 * @param {string} editorValue
 * @param {boolean} wasLibLoaded
 * @return {Promise<import("../../npm/node_modules/monaco-editor/esm/vs/editor/editor.api").editor.IEditorConstructionOptions>}
 */
export async function createEditorConstructionOptions(context, extender, editorValue, wasLibLoaded) {
  const editorOptions = typeof context.options.editorOptions === "object" ?
    context.options.editorOptions :
    typeof context.options.editorOptions === "string" ?
      JSON.parse(context.options.editorOptions) :
      {};

  const model = createModel(context.options, context.id, editorValue);
  const options = Object.assign({
    model: model,
    readOnly: context.options.readonly || context.options.disabled,
  }, editorOptions);
  if (context.options.tabIndex) {
    options.tabIndex = parseInt(context.options.tabIndex);
  }

  if (typeof extender.beforeCreate === "function") {
    const result = extender.beforeCreate(context, options, wasLibLoaded);
    if (typeof result === "object") {
      return typeof result.then === "function" ? (await result) || result : result;
    }
  }

  return options;
}

/**
 * @param {Partial<typeof BaseEditorDefaults>} options
 * @param {string} id
 * @param {string} value
 * @returns {import("../../npm/node_modules/monaco-editor/esm/vs/editor/editor.api").editor.ITextModel}
 */
export function createModel(options, id, value = "") {
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

export function isNullOrUndefined(x) {
  return x === null || x === undefined;
}

export function isNotNullOrUndefined(x) {
  return x !== null && x !== undefined;
}

/**
 * Default options for the monaco editor widget configuration.
 */
export const BaseEditorDefaults = {
  autoResize: false,
  basename: "",
  directory: "",
  disabled: false,
  editorOptions: {},
  extension: "",
  language: "plaintext",
  readonly: false,
  uiLanguage: "",
  uiLanguageUri: "",
  version: "1.0",
};

export const FramedEditorDefaults = Object.assign(BaseEditorDefaults, {
  extender: "",
});

export const InlineEditorDefaults = Object.assign(BaseEditorDefaults, {
  extender: "",
});
