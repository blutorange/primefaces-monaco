(function() {
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

    function getScript(url) {
        return jQuery.ajax({
            type: "GET",
            url: url,
            dataType: "script",
            cache: true,
            async: true
        });
    }

    PrimeFaces.widget.ExtMonacoEditor = PrimeFaces.widget.BaseWidget.extend({
        init(cfg) {
            this._super(cfg);

            this.$input = this.jq.find(".ui-helper-hidden-accessible textarea");
            this.$editor = this.jq.children(".ui-monaco-editor-ed");
            this.uiLanguageUri = "";

            // Remove any existing editor.
            this.destroy();

            // Set defaults.
            this.options = jQuery.extend({}, this._defaults, this.cfg);

            // English is the default.
            if (this.options.uiLanguage === "en") {
                this.options.uiLanguage = "";
            }

            // Set monaco environment
            window.MonacoEnvironment = window.MonacoEnvironment || {};
            if (!("getWorker" in MonacoEnvironment)) {
                MonacoEnvironment.getWorker = this._createWorkerFactory();
            }
            if (!("Locale" in MonacoEnvironment)) {
                MonacoEnvironment.Locale = {language: "", data: {}};
            }

            this._loadExtender(true);
        },

        /**
         * @return {monaco.editor} Instance of the monacor editor, or undefined if this widget is not yet initialized.
         */
        getMonaco() {
            return this._editor;
        },

        /**
         * Loads the extender for this monaco editor. It may be either
         *
         * - an empty string or undefined, in which case no extender is loaded
         * - a JavaScript expression that evaluates to an extender object
         * - a path to a resource (eg. `extender.js.xhtml?ln=mylib`) that evaluates to an extender object
         * @param wasLibLoaded
         * @private
         */
        _loadExtender() {
            this._evaluatedExtender = {};

            // No extender given
            if (typeof this.options.extender === "undefined") {
                this._loadLanguage();
                return;
            }

            // Extender was evaluated already
            if (typeof this.options.extender === "object") {
                this._evaluatedExtender = this.options.extender;
                this._loadLanguage();
                return;
            }
			
			// Try creating an extender from the factory
			var extenderFound = false;
            if (typeof this.options.extender === "function") {
                try {
                    this._evaluatedExtender = this.options.extender();
					extenderFound = true;
                }
                catch (e) {
                    console.warn("Extender must be an expression that evaluates to MonacoExtender");
                }
            }

			if (extenderFound) {
				this._loadLanguage();
				return;
            }

            console.warn("Extender was specified, but could not be loaded");
            this._loadLanguage();
        },

        _loadLanguage() {
            // Load language file, if requested.
            if (this.options.uiLanguage && MonacoEnvironment.Locale.language !== this.options.uiLanguage) {
                // Determine URI for loading the locale.
                if (this.options.uiLanguageUri) {
                    this.uiLanguageUri = this._getBaseUrl() + this.options.uiLanguageUri;
                }
                else {
                    this.uiLanguageUri = PrimeFaces.resources.getFacesResource("/monacoEditor/locale/" + this.options.uiLanguage + ".js", "primefaces-blutorange", this.options.version);
                }
                // Load UI language
                getScript(this.uiLanguageUri).then(() => this._loadEditor(true)).catch(error => {
                    console.warn("Failed to load locale for " + this.options.uiLanguage, error);
                    this._loadEditor(MonacoEnvironment.Locale.language !== this.options.uiLanguage);
                });
            }
            else {
                this._loadEditor(MonacoEnvironment.Locale.language !== this.options.uiLanguage);
            }
        },

        /**
         *
         * @param forceLibReload If true, loads the monaco editor again, even if it is loaded already. This is necessary in case the language changes.
         * @private
         */
        _loadEditor(forceLibReload) {
            if (window.monaco === undefined || forceLibReload) {
                if (this.options.uiLanguage == "") {
                    MonacoEnvironment.Locale = {language: "", data: {}};
                }
                var uriEditor = PrimeFaces.resources.getFacesResource("/monacoEditor/editor.js", "primefaces-blutorange", this.options.version);
                getScript(uriEditor).then(() => this._beforeCreate(true)).catch(error => {
                    console.warn("Failed to load monaco editor resources, cannot initialize editor", error);
                });
            }
            else {
                this._beforeCreate(false);
            }
        },

        /**
         * Evaluate the `beforeCreate` callback of the extender. It is passed the current options and may
         *
         * - not return anything, in which case the passed options are used (which may have been modified inplace)
         * - return an options object, in which case these options are used
         * - return a promise, in which case the editor is initialized only once that promise resolves. The promise
         *   may resolve to an new options object to be used.
         * @param wasLibLoaded
         * @private
         */
        _beforeCreate (wasLibLoaded) {
            this._getEditorContainer().empty();

            const extender = this._evaluatedExtender;
            
            const editorOptions = typeof this.options.editorOptions === "object" ?
                this.options.editorOptions :
                typeof this.options.editorOptions === "string" ?
                    JSON.parse(this.options.editorOptions) :
                    {};
            
            const model = this._createModel(editorOptions);

            const options = jQuery.extend({
                readOnly: this.options.readonly || this.options.disabled,
                model: model,

                // TODO Remove this in version 0.17
                language: this.options.language || "plaintext",
                value: this._getInput().val() || ""
            }, editorOptions);

            if (typeof extender.beforeCreate === "function") {
                const result = extender.beforeCreate(this, options, wasLibLoaded);
                if (typeof result === "object") {
                    if (typeof result.then === "function") {
                        // Promise / thenable returned
                        const thened = result.then(newOptions => {
                            this._render(typeof newOptions === "object" ? newOptions : options, extender, wasLibLoaded);
                        });
                        if (typeof thened.catch === "function") {
                            thened.catch(error => console.error("Extender promise failed to resolve", error));
                        }
                    }
                    else {
                        this._render(result, extender, wasLibLoaded);
                    }
                }
                else {
                    this._render(options, extender, wasLibLoaded);
                }
            }
            else {
                this._render(options, extender, wasLibLoaded);
            }
        },

        _render(options, extender, wasLibLoaded) {
            // TODO Remove this in version 0.17
            if (typeof options.value !== undefined) {
                delete options.value;
            }
            if (typeof options.language !== undefined) {
                delete options.language;
            }

            // Create a new editor instance.
            this._editor = monaco.editor.create(this._getEditorContainer().get(0), options);

            // Evaluate the `afterCreate` callback of the extender.
            if (typeof extender.afterCreate === "function") {
                extender.afterCreate(this, wasLibLoaded);
            }

            if (this.options.autoResize) {
                if (typeof window.ResizeObserver === "function") {
                    this.resizeObserver = new ResizeObserver(this._onResize.bind(this));
                    this.resizeObserver.observe(this.jq.get(0));
                }
                else {
                    console.warn("Browser environment does not support autoresize. window.ResizeObserver is not defined.");
                }
            }

            // Change event.
            // Set the value of the editor on the hidden textarea.
            this._editor.onDidChangeModelContent(changes => {
                this._getInput().val(this.getMonaco().getModel().getValue());
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

            this._fireEvent("initialized");
            this.jq.data("initialized", true);
        },

        destroy() {
        	var extender = this._evaluatedExtender;
        	if (extender && typeof extender.beforeDestroy === "function") {
        		extender.beforeDestroy(this);
        	}
            var monaco =  this.getMonaco();
            if (this.resizeObserver !== undefined) {
                this.resizeObserver.disconnect(this.jq.get(0));
            }
            if (monaco !== undefined) {
                monaco.dispose();
            }
        	if (extender && typeof extender.afterDestroy === "function") {
        		extender.afterDestroy(this);
        	}            
        },

        _onResize() {
            var monaco =  this.getMonaco();
            if (monaco !== undefined) {
                monaco.layout();
            }
        },

        _getBaseUrl() {
            var res = PrimeFaces.resources.getFacesResource("", "", "0");
            var idx = res.lastIndexOf(".xhtml");
            return idx >= 0 ? res.substring(0, idx) : res;
        },

        _fireEvent (eventName, ...params) {
            var onName = "on" + eventName;
            this.jq.trigger("monacoEditor:" + eventName, params);
            if (typeof this.options[onName] === "function") {
                this.options[onName].apply(this, params || []);
            }
            this.callBehavior(eventName, {
                params: params || {}
            });
        },

		/**
		 * @return {(moduleId: string, label: string) => Worker} The factory that creates the workers for JSON, CSS and other languages.
		 */
        _createWorkerFactory() {
            return (moduleId, label) => {
				const extender = this._evaluatedExtender;
				if (typeof extender === "object" && typeof extender.createWorker === "function") {
					return extender.createWorker(this, moduleId, label);
				}
				else {
	                const workerUrl = PrimeFaces.resources.getFacesResource("monacoEditor/" + getScriptName(label), "primefaces-blutorange", this.options.version);
    	            const interceptWorkerUrl = PrimeFaces.resources.getFacesResource("monacoEditor/worker.js", "primefaces-blutorange", this.options.version);
        	        return new Worker(interceptWorkerUrl + "&worker=" + encodeURIComponent(workerUrl) + "&locale=" + encodeURIComponent(this.uiLanguageUri || ""));
				}
            };
        },

        _createModel(editorOptions) {
            // Value and language
            var value = this._getInput().val() || "";
            var language = this.options.language || "plaintext";

            // Path, basename and extension
            /** @type {string} */
            var dir;
            /** @type {string} */
            var basename;
            /** @type {string} */
            var extension;
            if (this.options.directory) {
                dir = this.options.directory;
            }
            else {
                dir = String(this.id).replace(/[^a-zA-Z0-9_-]/g, "/");
            }
            if (this.options.basename) {
                basename = this.options.basename;
            }
            else {
                basename = "file";
            }
            if (this.options.extension) {
                extension = this.options.extension;
            }
            else {
                var langInfo = monaco.languages.getLanguages().filter(lang => lang.id === language)[0];
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
            var uri = monaco.Uri.from({
                scheme: "inmemory",
                path: dir + basename + extension
            });

            // Return model
            var model = monaco.editor.getModel(uri);
            if (model) {
                model.setValue(value);
                return model;
            }
            else {
                return monaco.editor.createModel(value, language, uri);
            }
        },

        /**
         * @returns {jQuery} The hidden textarea holding the value.
         * @private
         */
        _getInput() {
            return this.$input;
        },

        /**
         * @returns {jQuery} The element holding the editor.
         * @private
         */
        _getEditorContainer() {
            return this.$editor;
        },

        _defaults: {
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
            version: "1.0"
        },
    });
})();
