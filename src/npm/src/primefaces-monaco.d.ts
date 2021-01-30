/// <reference types="jquery" />

type Constructor<T> = new (...args: any[]) => T;

/** Main entry point to the client-side part of PrimeFaces. */
declare const PrimeFaces: PrimeFaces.PrimeFacesStatic;

/**
 * Helper function to retrieve the widget instance for a given widget variable.
 * @param widgetVar Widget variable of the widget to retrieve.
 * @return The widget instance. `undefined` in case no such widget is found.
 */
declare function PF(widgetVar: string): PrimeFaces.Widget.BaseWidget;

/**
 * Exposes the internal API of monaco editor. May be used to customize the editor even further.
 *
 * __THIS IS UNSUPPORTED AND MAY BE CHANGED WITHOUT NOTICE. MAKE SURE YOU KNOW WHAT YOU ARE DOING AND USE AT YOUR OWN RISK.__
 */
declare const monacoExtras: any;

export interface MonacoContext {
  id: string;
  readonly options: PrimeFaces.WidgetConfiguration.ExtMonacoEditorBaseCfg;
  /**
   * Finds the current instance of the monaco editor, if it was created already. Use this to interact with the
   * editor via JavaScript. See also the
   * [monaco editor API docs](https://microsoft.github.io/monaco-editor/api/index.html).
   * @return The current monaco editor instance. `undefined` in case the editor was not created yet.
   */
  getMonaco(): import("monaco-editor").editor.IStandaloneCodeEditor | undefined;
  /**
   * Calls the given handler with the current monaco editor instance if it exists.
   * @typeparam TReturn Type of the return value.
   * @param handler Handler that is invoked with the current monaco editor instance.
   * @param defaultReturnValue Default value that is returned when no editor exists currently.
   * @return The return value of the handler, or the default return value if no editor exists.
   */
  withMonaco<TReturn>(handler: (editor: import("monaco-editor").editor.IStandaloneCodeEditor) => TReturn, defaultReturnValue: TReturn): TReturn;
  /**
   * Calls the given handler with the current monaco editor instance if it exists.
   * @typeparam TReturn Type of the return value.
   * @param handler Handler that is invoked with the current monaco editor instance.
   * @return The return value of the handler, or `undefined` if no editor exists.
   */
  withMonaco<TReturn>(handler: (editor: import("monaco-editor").editor.IStandaloneCodeEditor) => TReturn): TReturn | undefined;
  /**
   * Calls the given handler with the current monaco editor instance if it exists.
   * @typeparam TReturn Type of the return value.
   * @param handler Handler that is invoked with the current monaco editor instance.
   * @param defaultReturnValue Default value that is returned when no editor exists currently, or when the
   * handler throws.
   * @return The return value of the handler, or the default return value if either no editor exists or the
   * handler throws an error.
   */
  tryWithMonaco<TReturn>(handler: (editor: import("monaco-editor").editor.IStandaloneCodeEditor) => TReturn, defaultReturnValue: TReturn): TReturn;
  /**
   * Calls the given handler with the current monaco editor instance if it exists.
   * @typeparam TReturn Type of the return value.
   * @param handler Handler that is invoked with the current monaco editor instance.
   * @return The return value of the handler, or `undefined` if either no editor exists or the handler throws
   * an error.
   */
  tryWithMonaco<TReturn>(handler: (editor: import("monaco-editor").editor.IStandaloneCodeEditor) => TReturn): TReturn | undefined;
}

export interface MonacoIframeContext extends MonacoContext {
  /**
   * The extender that was set for this monaco editor widget. It can be used to customize the editor via
   * JavaScript.
   */
  readonly extender: Partial<MonacoExtenderFramed>;
}

/**
 * Extender for the inline editor that has direct access to the editor.
 */
export interface MonacoExtenderInline extends MonacoExtenderBase<PrimeFaces.Widget.ExtMonacoEditorInline> {
}

/**
 * Extender for the framed editor that must communicate via postMessage with the editor.
 */
export interface MonacoExtenderFramed extends MonacoExtenderBase<MonacoIframeContext> {
}

/**
 * Data passed to the extender in the `createModel` method.
 */
export interface ExtenderCreateModelOptions {
  /** Resolved options for the monaco editor. */
  editorOptions: import("monaco-editor").editor.IStandaloneEditorConstructionOptions;
  /** Code language for the model. */
  language: string;
  /** Default URI for the model. */
  uri: monaco.Uri;
  /** Initial value for the model. */
  value: string;
}

/**
 * An extender object to further customize the monaco editor via JavaScript. Specified via the `extender` attribute
 * on the `<blut:monacoEditor />` tag. See the the [vdldocs](https://blutorange.github.io/primefaces-monaco/vdldoc/index.html)
 * for more information.
 *
 * All callback methods in the extender are optional, if not specified, corresponding defaults are used.
 *
 * @typeparam TContext Type of the context object that is passed to all callback methods.
 */
export interface MonacoExtenderBase<TContext extends MonacoContext> {
  /**
   * Called before monaco editor is created. This method is passed the current options object that would be used to
   * initialize the monaco editor.
   *
   * If this callback does not return a value, the options that were passed are used. You may modify the
   * options in-place.
   *
   * If it returns a new options object, that options object is used.
   *
   * If it returns a Thenable or Promise, the monaco editor is created only once the Promise resolves (successfully).
   * If the Promise returns a new options object, these options are used to create the editor.
   *
   * See
   * [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html)
   * for all editor options.
   *
   * @param context The current context object. Note that you should not use it to retrieve the monaco editor
   * instance, as the editor was not created yet.
   * @param options The current options that would be used to create the editor.
   * @param wasLibLoaded `true` if the monaco editor library was reloaded, `false` otherwise. In case it was reloaded, you
   * may want to setup some language defaults again.
   * @return Either `undefined` to use the options as passed; a new options object to be used for creating the editor;
   * or a Promise that may return the new options.
   */
  beforeCreate(context: TContext, options: import("monaco-editor").editor.IStandaloneEditorConstructionOptions, wasLibLoaded: boolean): import("monaco-editor").languages.ProviderResult<import("monaco-editor").editor.IStandaloneEditorConstructionOptions>;

  /**
   * This method is called after the editor was created.
   * @param context The current context object.
   * @param wasLibLoaded `true` if the monaco editor library was reloaded, `false` otherwise. In case it was reloaded,
   * you may want to setup some language defaults again.
   */
  afterCreate(context: TContext, wasLibLoaded: boolean): void;

  /**
   * Called before the editor is destroyed, eg. when updating a component via AJAX.
   * @param context The current context object.
   */
  beforeDestroy(context: TContext): void;

  /**
   * Called after the editor was destroyed; and also when updating a component via AJAX.
   * @param context The current context object. Note that you should not use it to retrieve the monaco editor
   * instance, as the editor has already been destroyed.
   */
  afterDestroy(context: TContext): void;

  /**
  * Called when a worker for additional language support needs to be created. By default, monaco editor ships with
  * the workers for JSON, CSS, HTML, and TYPESCRIPT. The label is the name of the language, eg. `css` or
  * `javascript`. This method must return the worker to be used for the given language.
  *
  * @param context The current context object. Note that you should not use it to retrieve the monaco editor
  * instance, as the editor was not created yet.
  * @param moduleId Module ID for the worker. Useful only with the AMD version, can be ignored.
  * @param label Label of the language for which to create the worker.
  * @return The worker to be used for the given code language.
  */
  createWorker(context: TContext, moduleId: string, label: string): Worker;

  /**
   * Called when monaco editor is created. May return an object with services that should be overriden. See
   * [here on github](https://github.com/Microsoft/monaco-editor/issues/935#issuecomment-402174095) for details
   * on the available services.
   * @param context The current context object. Note that you should not use it to retrieve the monaco editor
   * instance, as the editor was not created yet.
   * @param options The options that will be used to create the editor. Readonly and must not be changed.
   * @return The override options to be used. If `undefined` is returned, no editor override services are used.
   */
  createEditorOverrideServices(context: TContext, options: Readonly<import("monaco-editor").editor.IStandaloneEditorConstructionOptions>): import("monaco-editor").editor.IEditorOverrideServices | undefined;

  /**
   * Called when the model needs to be fetched. The default implementation attempts to find an existing model for the
   * given URI in the monaco store (`monaco.editor.getModel`). If it cannot be found, it creates a new model
   * (`monaco.editor.createModel`). Finally it sets the default value on the model. This method can be used to create a
   * custom when neccessary, with possibly a different URI.
   *
   * If you implement this callback, you SHOULD set the initial value (`data.value`) on the model, it will NOT be set
   * automatically.
   * @param context The current context object. Note that you should not use it to retrieve the monaco editor
   * instance, as the editor was not created yet.
   * @param options Options with the default URI, the current value, and the editor configuration.
   * @return The retrieved or created model. When `undefined`, the default mechanism to create the model ist used.
   */
  createModel(context: TContext, options: ExtenderCreateModelOptions): import("monaco-editor").editor.ITextModel | undefined
}

declare namespace PrimeFaces {
  interface PrimeFacesStatic {
    /**
     * The constructors of all registered widgets.
     */
    widget: WidgetRegistry;
    /**
     * Contains a reference to all instantiated widgets, indexed by the widget variable of the component
     * (which defaults to the client ID when not given explicitly).
     */
    widgets: { [widgetVar: string]: Widget.BaseWidget };
  }

  /**
   * The widget registry from PrimeFaces contains a reference to all widget constructors for
   * all loaded widgets.
   */
  interface WidgetRegistry {
    /**
     * The constructor for the monaco editor widget, inline variant. Called automatically when you use the
     * `<blut:monacoEditorFramed/>` component.
     */
    ExtMonacoEditorInline: Constructor<Widget.ExtMonacoEditorInline>;
    /**
     * The constructor for the monaco editor widget, iframe variant. Called automatically when you use the
     * `<blut:monacoEditor/>` component.
     */
    ExtMonacoEditorFramed: Constructor<Widget.ExtMonacoEditorFramed>;
  }

  namespace WidgetConfiguration {
    interface BaseWidgetCfg {
      /** The (client) ID of this widget.  */
      id: string;
    }

    interface ExtMonacoEditorBaseCfgBase {
      /**
       * Whether the monaco editor is resized automatically. Please not that this requires the browser to
       * support for [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
       */
      readonly autoResize: boolean;
      /**
       * Basename for the URI used for the model.
       */
      readonly basename: string;
      /**
       * Directory (path) for the URI used for the model.
       */
      readonly directory: string;
      /**
       * The options that were used to construct the monaco editor instance.
       */
      readonly editorOptions: Readonly<import("monaco-editor").editor.IStandaloneEditorConstructionOptions>;
      /**
       * Extension for the URI used for the model.
       */
      readonly extension: string;
      /**
       * The extender for enhancing the editor with client-side functionality. Exact type
       * depends on whether the inlined or framed editor is used.
       */
      readonly extender: any;
      /**
       * Whether the editor is currently disabled.
       */
      readonly disabled: boolean;
      /**
       * The code language tag, eg. `css` or `javascript`. See  also `monaco.language.getLangauges`.
       */
      readonly language: string;
      /**
       * Whether the editor is currently read-only.
       */
      readonly readonly: boolean;
      /**
       * Scheme (protocol) for the URI used for the model.
       */
      readonly scheme: string;
      /**
       * Tab index for the editor.
       */
      readonly tabIndex: number;
      /**
       * The code of the current UI language of the monaco editor, eg. `en` or `de`.
       */
      readonly uiLanguage: string;
      /**
       * The Uri to the locale file with the translations for the current language.
       */
      readonly uiLanguageUri: string;
      /**
       * The version of this [primefaces-monaco](https://github.com/blutorange/primefaces-monaco) library.
       * Used for caching resources etc.
       */
      readonly version: string;
    }

    interface ExtMonacoEditorBaseCfg extends ExtMonacoEditorBaseCfgBase, BaseWidgetCfg {
    }

    interface ExtMonacoEditorFramedCfg extends ExtMonacoEditorBaseCfg {
      /**
       * URL to the extender for this monaco editor widget.
       * Either `undefined` or an URL that points to a script file that sets `window.MonacoEnvironment` to the
       * extender to be used.
       */
      readonly extender: string;
    }

    /**
     * The current configuration of the monaco editor widget. These properties are readonly. To set them, you should
     * use the corresponding attributes on the `<blut:monacoEditor/>` tag.
     */
    interface ExtMonacoEditorInlineCfg extends ExtMonacoEditorBaseCfg {
      /**
       * Factory function that creates the extender for this monaco editor widget.
       * Either `undefined` or JavaScript code that evaluates to the extender.
       */
      readonly extender: () => Partial<MonacoExtenderInline>;
    }
  }

  namespace Widget {
    /** The base class of all PrimeFaces widgets from which they are derive. */
    interface BaseWidget<TConf = WidgetConfiguration.BaseWidgetCfg> {
      id: string;
      /** The widget-specific configuration of this widget instance. */
      cfg: TConf;
      /** A reference to the base (container) element of this widget. */
      jq: JQuery;
      /** A reference to the base (container) element of this widget. */
      jqEl: HTMLElement;
      jqId: string;
      /** The widget variable of this widget instance. */
      widgetVar: string;
      /**
       * @return A reference to the base (container) element of this widget.
       */
      getJQ(): JQuery;
      /**
       * @param name Name of the behavior to check.
       * @return Whether any handlers are registered for the given behavior.
       */
      hasBehavior(name: string): boolean;
      /**
       * Initializes this widget. Called by the PrimeFaces framework.
       * @param configuration Configuration as set on the server-side.
       */
      init(configuration: { [key: string]: any }): void;
      /**
       * Refreshes this widget with the given configuration.
       * @param configuration New configuration for this widget.
       */
      refresh(configuration: { [key: string]: any }): void;
      /**
       * @param clientId Client ID of the script element to remove.
       */
      removeScriptElement(clientId: string): void;
      /**
       * Whether this widget is attached to the DOM currently.
       */
      isDetached(): boolean;
      /**
       * Destroys this widget. Called by the PrimeFaces framework.
       */
      destroy(): void;
      /**
       * If it exists, calls the behavior with the given name.
       * @param name Name of the behavior.
       * @param args Additional arguments for the behavior.
       */
      callBehavior(name: string, ...args: unknown[]): void;
    }

    interface ExtMonacoEditorBase<TCfg extends WidgetConfiguration.ExtMonacoEditorBaseCfg> extends BaseWidget<TCfg> {
      /**
       * @return The HTML container element holding the editor. It exists even if the editor was not created yet.
       */
      getEditorContainer(): JQuery;
      /**
       * @return The hidden textarea holding the value of the editor (eg. the code being edited, this is also the
       * value that is sent when the form is submitted).
       */
      getInput(): JQuery;
      /**
       * @return `true` when the editor was already loaded and initialized and can be interacted with via
       * `getMonaco()`, `false` otherwise.
       */
      isReady(): boolean;

      /**
       * @return A promise that is resolved once the editor has finished loading and was created successfully.
       */
      whenReady(): Promise<this>;
    }

    interface ExtMonacoEditorFramed extends ExtMonacoEditorBase<WidgetConfiguration.ExtMonacoEditorFramedCfg> {
      /**
       * Gets the value of this editor. May be called as soon as this widget is accessible, even when the monaco
       * editor was not loaded or initialized yet.
       * @return A promise with the current value of this editor.
       */
      getValue(): Promise<string>;

      /**
       * Sets the value of this editor. May be called as soon as this widget is accessible, even when monaco
       * editor was not loaded or initialized yet. The value will be set on the editor once it becomes ready.
       * @param newValue The new value to set.
       * @return A promise that resolves once the value was set.
       */
      setValue(newValue: string): Promise<void>;

      /**
       * Invokes the given method on the monaco editor instance in the iframe, and returns the result. As the
       * communication with the iframes is done via `postMessage`, the result is returned asynchronously.
       * @param method A method of the monaco editor instance to invoke.
       * @param args Arguments that are passed to the method.
       * @return A promise that resolves with the value returned by the given method.
       */
      invokeMonaco<K extends keyof import("monaco-editor").editor.IStandaloneCodeEditor>(method: K, ...args: Parameters<import("monaco-editor").editor.IStandaloneCodeEditor[K]>): ReturnType<import("monaco-editor").editor.IStandaloneCodeEditor[K]>;

      /**
       * Invokes the given script on the monaco editor instance in the iframe, and returns the result. As the
       * communication with the iframes is done via `postMessage`, the result is returned asynchronously. Note that the
       * script if converted to a string, send to the framed editor and executed. Closing over variables in the lambda
       * is NOT supported. Explicitly specify those variables as the arguments, they will be passed to the iframe.
       * @param method A method of the monaco editor instance to invoke.
       * @param args Arguments that are passed to the method.
       * @return A promise that resolves with the value returned by the given method.
       */
      invokeMonacoScript<TRetVal, TArgs extends any[]>(script: string | ((editor: import("monaco-editor").editor.IStandaloneCodeEditor, ...args: TArgs) => TRetVal), ...args: TArgs): Promise<TRetVal>;
    }

    /**
     * The monaco editor widget. This is a thin wrapper around the actual monaco editor and mainly takes care of
     * initializing the editor, ie. it serves as a bridge between JSF/PrimeFaces and monaco editor.
     *
     * Please note that monaco editor is initialized asynchronously - `getMonaco()` may return `undefined` until
     * monaco editor was created successfully. You can use `whenReady` to be notified once the editor was created.
     */
    interface ExtMonacoEditorInline extends ExtMonacoEditorBase<WidgetConfiguration.ExtMonacoEditorInlineCfg>, MonacoContext {
      /**
       * The extender that was set for this monaco editor widget. It can be used to customize the editor via
       * JavaScript.
       */
      readonly extender: Partial<MonacoExtenderInline>;

      /**
       * Gets the value of this editor. May be called as soon as this widget is accessible, even when the monaco
       * editor was not loaded or initialized yet.
       * @return The current value of this editor.
       */
      getValue(): string;

      /**
       * Sets the value of this editor. May be called as soon as this widget is accessible, even when monaco
       * editor was not loaded or initialized yet. The value will be set on the editor once it becomes ready.
       * @param newValue The new value to set.
       */
      setValue(newValue: string): void;
    }
  }
}

