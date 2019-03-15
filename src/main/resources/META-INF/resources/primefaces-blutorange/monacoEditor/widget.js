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

    function capitalize(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    PrimeFaces.widget.ExtMonacoEditor = PrimeFaces.widget.BaseWidget.extend({
        init: function (cfg) {
            this._super(cfg);

            this.$input = this.jq.find(".ui-helper-hidden-accessible textarea");
            this.$editor = this.jq.children(".ui-monaco-editor-ed");
            this.uiLanguageUri = "";

            // Remove any existing editor.
            this.destroy();

            // Set defaults.
            this.options = $.extend({}, this._defaults, this.cfg);

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
        getMonaco: function () {
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
        _loadExtender: function() {
            var thiz = this;
            this._evaluatedExtender = {};
            if (!this.options.extender) {
                this._loadLanguage();
                return;
            }
            if (typeof this.options.extender === "object") {
                this._evaluatedExtender = this.options.extender;
                this._loadLanguage();
                return;
            }
			
			// Try evaluating the extender as a JS expression
			var extenderFound = false;
            try {
                var evaluated = eval(this.options.extender);
                if (typeof evaluated === "object") {
                    this._evaluatedExtender = evaluated;
					extenderFound = true;
                }
				else {
	                console.warn("extender must be an object");
				}
            }
            catch (e) {}
			if (extenderFound) {
				this._loadLanguage();
				return;
			}
			
			// Try loading the extender from an URL
            $.get(this._getBaseUrl() + this.options.extender, undefined, function (data, textStatus) {
                try {
                    var evaluated = eval(data);
                    if (typeof evaluated === "object") {
                        thiz._evaluatedExtender = evaluated;
                        thiz._loadLanguage();
                        return;
                    }
                    console.warn("Extender must be an object");
                }
                catch (e) {
                    console.warn("Extender is not a valid object", e);
                }
            }, "text");
        },

        _loadLanguage: function() {
            // Load language file, if requested.
            if (this.options.uiLanguage && MonacoEnvironment.Locale.language !== this.options.uiLanguage) {
                // Load UI language
                var thiz = this;
                if (this.options.uiLanguageUri) {
                    this.uiLanguageUri = this._getBaseUrl() + this.options.uiLanguageUri;
                }
                else {
                    this.uiLanguageUri = PrimeFaces.getFacesResource("/monacoEditor/locale/" + this.options.uiLanguage + ".js", "primefaces-blutorange", this.options.version);
                }
                PrimeFaces.getScript(this.uiLanguageUri, function(data, textStatus) {
                    thiz._loadEditor(true);
                }, this);
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
        _loadEditor: function(forceLibReload) {
            if (window.monaco === undefined || forceLibReload) {
                if (this.options.uiLanguage == "") {
                    MonacoEnvironment.Locale = {language: "", data: {}};
                }
                var thiz = this;
                var uriEditor = PrimeFaces.getFacesResource("/monacoEditor/editor.js", "primefaces-blutorange", this.options.version);
                PrimeFaces.getScript(uriEditor, function (data2, textStatus2) {
                    thiz._beforeCreate(true);
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
        _beforeCreate: function (wasLibLoaded) {
            var thiz = this;
            var extender = this._evaluatedExtender;

            this._getEditorContainer().empty();

            var editorOptions = typeof this.options.editorOptions === "object" ?
                this.options.editorOptions :
                typeof this.options.editorOptions === "string" ?
                    JSON.parse(this.options.editorOptions) :
                    {};

            var model = this._createModel(editorOptions);

            var options = $.extend({
                readOnly: this.options.readonly || this.options.disabled,
                model: model,

                // TODO Remove this in version 0.17
                language: this.options.language || "plaintext",
                value: this._getInput().val() || ""
            }, editorOptions);

            if (typeof extender.beforeCreate === "function") {
                var result = extender.beforeCreate(this, options, wasLibLoaded);
                if (typeof result === "object") {
                    if (typeof result.then === "function") {
                        // Promise / thenable returned
                        var thened = result.then(function(newOptions){
                            if (typeof newOptions === "object") {
                                options = newOptions;
                            }
                            thiz._render(options, extender, wasLibLoaded);
                        });
                        if (typeof thened["catch"] === "function") {
                            thened["catch"](function(error) {
                                console.error("Extender promise failed to resolve", error);
                            });
                        }
                    }
                    else {
                        options = result;
                        this._render(options, extender, wasLibLoaded);
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

        _render: function(options, extender, wasLibLoaded) {
            var thiz = this;

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
            this._editor.onDidChangeModelContent(function (changes) {
                thiz._getInput().val(thiz.getMonaco().getModel().getValue());
                thiz._fireEvent('change', [changes]);
            });

            // Focus / blur
            this._editor.onDidFocusEditorWidget(function () {
                thiz._fireEvent('focus');
            });
            this._editor.onDidBlurEditorWidget(function () {
                thiz._fireEvent('blur');
            });

            // Paste
            this._editor.onDidPaste(function(range) {
                thiz._fireEvent('paste', [range]);
            });

            // Mouse / Key
            this._editor.onMouseDown(function(mouseEvent) {
                thiz._fireEvent('mousedown', [mouseEvent]);
            });
            this._editor.onMouseMove(function(mouseEvent) {
                thiz._fireEvent('mousemove', [mouseEvent]);
            });
            this._editor.onMouseUp(function(mouseEvent) {
                thiz._fireEvent('mouseup', [mouseEvent]);
            });
            this._editor.onKeyDown(function(keyboardEvent) {
                thiz._fireEvent('keydown', [keyboardEvent]);
            });
            this._editor.onKeyUp(function(keyboardEvent) {
                thiz._fireEvent('keyup', [keyboardEvent]);
            });
            this._editor.onDidType(function(key) {
                thiz._fireEvent('keypress', [key]);
            });
            this._fireEvent("initialized");
            this.jq.data("initialized", true);
        },

        destroy: function() {
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

        _onResize: function() {
            var monaco =  this.getMonaco();
            if (monaco !== undefined) {
                monaco.layout();
            }
        },

        _getBaseUrl: function() {
            var res = PrimeFaces.getFacesResource("", "", "0");
            var idx = res.lastIndexOf(".xhtml");
            return idx >= 0 ? res.substring(0, idx) : res;
        },

        _fireEvent : function(eventName, params) {
            var onName = "on" + eventName;
            this.jq.trigger("monacoEditor:" + eventName, params);
            if (this.options[onName]) {
                var eventFn = "(function(){" + this.options[onName] + "})";
                eval(eventFn).apply(this, params || []);
            }
            if (this.cfg.behaviors) {
                var callback = this.cfg.behaviors[eventName];
                if (callback) {
                    var options = {
                        params: params || []
                    };
                    callback.call(this, options);
                }
            }
        },

		/**
		 * @return {(moduleId: string, label: string) => Worker} The factory that creates the workers for JSON, CSS and other languages.
		 */
        _createWorkerFactory: function() {
            var thiz = this;
            return function(moduleId, label) {
				var extender = thiz._evaluatedExtender;
				if (typeof extender === "object" && typeof extender.createWorker === "function") {
					return extender.createWorker(thiz, moduleId, label);
				}
				else {
	                var workerUrl = PrimeFaces.getFacesResource("monacoEditor/" + getScriptName(label), "primefaces-blutorange", thiz.options.version);
    	            var interceptWorkerUrl = PrimeFaces.getFacesResource("monacoEditor/worker.js", "primefaces-blutorange", thiz.options.version);
        	        return new Worker(interceptWorkerUrl + "&worker=" + encodeURIComponent(workerUrl) + "&locale=" + encodeURIComponent(thiz.uiLanguageUri || ""));
				}
            };
        },

        _createModel: function(editorOptions) {
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
                var langInfo = monaco.languages.getLanguages().filter(function(lang) {
                    return lang.id === language;
                })[0];
                extension = langInfo && langInfo.extensions.length > 0 ? langInfo.extensions[0] : "";
            }
            
            // Build path and uri
            if (dir.length > 0 && dir[dir.length - 1] !== "/") {
                dir = dir + "/";
            }
            if (extension.length > 0 && extension[0] !== ".") {
                extension = "." + extension;
            }
            var uri = monaco.Uri.from({
                scheme: "inmemory",
                path: dir + basename + extension
            });

            // Return model
            return monaco.editor.createModel(value, language, uri);
        },

        /**
         * @returns {jQuery} The hidden textarea holding the value.
         * @private
         */
        _getInput: function() {
            return this.$input;
        },

        /**
         * @returns {jQuery} The element holding the editor.
         * @private
         */
        _getEditorContainer: function() {
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
