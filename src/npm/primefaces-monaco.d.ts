/// <reference types="jquery" />
/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

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
 * Exposes the internal API of monaco editor. May be used to customize the editor even
 * further.
 * 
 * __THIS IS UNSUPPORTED AND MAY BE CHANGED WITHOUT NOTICE. MAKE SURE YOU KNOW WHAT YOU ARE DOING AND USE AT YOUR OWN RISK.__
 */
declare const monacoExtras: any;

/**
 * An extender object to further customize the monaco editor via JavaScript. Specified via the `extender` attribute
 * on the `<blut:monacoEditor />` tag. See the the [vdldocs](https://blutorange.github.io/primefaces-monaco/vdldoc/index.html)
 * for more information.
 */
export interface MonacoExtender {
    /**
     * Called before the monaco editor is created. It is passed the current options object that would be used to
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
     * See [IEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html) for all editor options.
     * @param editorWidget The current monaco editor widget. Note that calling `getMonaco()` on the editor widget right now returns `undefined`.
     * @param options The current options that would be used to create the editor.
     * @param wasLibLoaded `true` if the monaco editor library was reloaded, `false` otherwise. In case it was reloaded, you
     * may want to setup some language defaults again. 
     * @return Nothing to use the options as passed; a new options object to be used for creating the editor; or a Promise
     * that may return the new options.  
     */
    beforeCreate(editorWidget: PrimeFaces.Widget.ExtMonacoEditor, options: monaco.editor.IEditorConstructionOptions, wasLibLoaded: boolean): monaco.languages.ProviderResult<monaco.editor.IEditorConstructionOptions>;
    /**
     * Called after the editor was created.
     * @param editorWidget The current monaco editor widget.
     * @param wasLibLoaded `true` if the monaco editor library was reloaded, `false` otherwise. In case it was reloaded, you
     * may want to setup some language defaults again. 
     */
    afterCreate(editorWidget: PrimeFaces.Widget.ExtMonacoEditor, wasLibLoaded: boolean): void;
    /**
     * Called before the editor is destroyed, eg. when updating a component via AJAX.
     * @param editorWidget The current monaco editor widget.
     */
    beforeDestroy(editorWidget: PrimeFaces.Widget.ExtMonacoEditor): void;
    /**
     * Called after the editor was destroyed; and also when updating a component via AJAX.
     * @param editorWidget The current monaco editor widget. Note that calling `getMonaco()` on the editor widget now returns `undefined`.
     */
    afterDestroy(editorWidget: PrimeFaces.Widget.ExtMonacoEditor): void;
    /**
     * Called when a worker for additional language support needs to be created. By default, monaco editor ships with the workers
     * for JSON, CSS, HTML, and TYPESCRIPT. The label is the name of the language, eg. <code>css</code> or <code>javascript</code>.
     * Must return the worker to be used for the given language.
     * @param editorWidget The current monaco editor widget. The monaco editor was not created yet, so `getMonaco()` returns `undefined`.
     * @param moduleId Module ID for the worker. Useful only with the AMD version, can be ignored.
     * @param label Label of the language for which to create the worker.
     */
    createWorker(editorWidget: PrimeFaces.Widget.ExtMonacoEditor, moduleId: string, label: string): Worker;
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
        widgets: {[widgetVar: string]: Widget.BaseWidget};
    }

    /**
     * The widget registry from PrimeFaces contains a reference to all widget constructors for 
     * all loaded widgets.
     */
    interface WidgetRegistry {
        /**
         * The constructor for the monaco editor widget. Called automatically when you use the `<blut:monacoEditor/>`
         * component.
         */
        ExtMonacoEditor: Constructor<Widget.ExtMonacoEditor>;
    }

    namespace WidgetConfiguration {
        interface BaseWidgetCfg {
            /** The (client) ID of this widget.  */
            id: string;
        }

        /**
         * The current configuration of the monaco editor widget. These properties are readonly, use 
         * the corresponding attributes on the `<blut:monacoEditor/>` tag.
         */
        interface ExtMonacoEditorCfg extends BaseWidgetCfg {
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
            readonly editorOptions: Readonly<monaco.editor.IEditorConstructionOptions>;
            /**
             * Factory function creating the extender for this monaco editor widget.
             * Either `undefined` or JavaScript code that evaluates to the extender.
             */
            readonly extender: () => MonacoExtender;
            /**
             * Extension for the URI used for the model.
             */
            readonly extension: string;
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
            init(configuration: {[key: string]: any}): void;
            /**
             * Refreshes this widget with the given configuration.
             * @param configuration New configuration for this widget.
             */
            refresh(configuration: {[key: string]: any}): void;
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
        /**
         * The monaco editor widget. This is a thin wrapper around the actual monaco editor and
         * mainly takes care of initializing the editor, ie. it servers as a bridge between
         * JSF/PrimeFaces and monaco editor.
         */
        interface ExtMonacoEditor extends BaseWidget<WidgetConfiguration.ExtMonacoEditorCfg> {
            /**
             * The extender that was set for this monaco editor widget. It is used
             * to customize the editor via JavaScript.
             */
            readonly extender: Partial<MonacoExtender>;
            /**
             * @return The current monaco editor instance. Use this to interact with the editor via
             * JavaScript. See also the [monaco editor API docs](https://microsoft.github.io/monaco-editor/api/index.html).
             */
            getMonaco(): monaco.editor.IStandaloneCodeEditor;
            /**
             * @returns {jQuery} The HTML container element holding the editor. It exists even
             * if the editor was not created yet.
             */
            getEditorContainer();
            /**
             * @returns {jQuery} The hidden textarea holding the value (eg. what the value sent when
             * the form is submitted).
             */
            getInput();
        }
    }
}