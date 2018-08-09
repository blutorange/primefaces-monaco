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

    function createWorkerUrlGetter(version) {
        return function(moduleId, label) {
            return PrimeFaces.getFacesResource("monacoEditor/" + getScriptName(label), "primefaces-blutorange", version);
        };
    }

    function capitalize(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    PrimeFaces.widget.ExtMonacoEditor = PrimeFaces.widget.BaseWidget.extend({
        init: function (cfg) {
            this._super(cfg);

            this.$input = this.jq.children("input");
            this.$editor = this.jq.children(".ui-monaco-editor-ed");

            // Remove any existing editor.
            if (this._editor !== undefined) {
                this._editor.dispose();
                this._editor = undefined;
            }

            // Set defaults.
            this.options = $.extend({}, this._defaults, this.cfg);
            // English is the default.
            if (this.options.uiLanguage === "eng") this.options.uiLanguage = "";

            // Set monaco environment
            window.MonacoEnvironment = window.MonacoEnvironment || {};
            if (!MonacoEnvironment.getWorkerUrl) {
                MonacoEnvironment.getWorkerUrl = createWorkerUrlGetter(this.options.version);
                MonacoEnvironment.Locale = MonacoEnvironment.Locale || {language: "", data: {}};
            }

            // Load language file, if requested.
            if (this.options.uiLanguage && MonacoEnvironment.Locale.language !== this.options.uiLanguage) {
                // Load UI language
                var uiLanguageUri = PrimeFaces.getFacesResource("/monacoEditor/locale/" + this.options.uiLanguage + ".js", "primefaces-blutorange", this.options.version);
                var thiz = this;
                PrimeFaces.getScript(uiLanguageUri , function(data, textStatus) {
                    thiz._loadEditor(true);
                }, this);
            }
            else {
                this._loadEditor(MonacoEnvironment.Locale.language !== this.options.uiLanguage);
            }
        },

        /**
         * @return {monaco.editor} Instance of the monacor editor, or undefined if this widget is not yet initialized.
         */
        getMonaco: function () {
            return this._editor;
        },


        /**
         *
         * @param forceLibReload If true, loads the monaco editor again, even if it is loaded already. This is necessary in case the language changes.
         * @private
         */
        _loadEditor: function(forceLibReload) {
            if (!window.monaco || forceLibReload) {
                var thiz = this;
                var uri0 = PrimeFaces.getFacesResource("/monacoEditor/0.js", "primefaces-blutorange", this.options.version)
                var uriEditor = PrimeFaces.getFacesResource("/monacoEditor/editor.js", "primefaces-blutorange", this.options.version)
                PrimeFaces.getScript(uri0, function (data, textStatus) {
                    PrimeFaces.getScript(uriEditor, function (data2, textStatus2) {
                        thiz._loadExtender(true);
                    }, this);
                }, this);
            }
            else {
                this._loadExtender(false);
            }
        },

        _loadExtender: function(wasLibLoaded) {
            var thiz = this;
            if (!this.options.extender) {
                this._beforeCreate({}, wasLibLoaded);
                return;
            }
            if (typeof this.options.extender === "object") {
                this._beforeCreate(this.options.extender, wasLibLoaded);
                return
            }
            try {
                var evaluated = eval(this.options.extender);
                if (typeof evaluated === "object") {
                    this._beforeCreate(evaluated, wasLibLoaded);
                    return
                }
                console.warn("extender must be an object");
            }
            catch (e) {}
            PrimeFaces.getScript(this._getBaseUrl() + this.options.extender, function (data, textStatus) {
                try {
                    var evaluated = eval(data);
                    if (typeof evaluated === "object") {
                        thiz._beforeCreate(evaluated, wasLibLoaded);
                        return;
                    }
                    console.warn("extender must be an object");
                }
                catch (e) {
                    console.warn("Extender is not a valid object", e);
                }
            }, this);
        },

        _beforeCreate: function (extender, wasLibLoaded) {
            var thiz = this;

            this._getEditorContainer().empty();

            var options = {
                readOnly: this.options.readonly || this.options.disabled,
                language: this.options.codeLanguage,
                theme: this.options.theme,
                value: this._getInput().val(),
            };

            if (typeof extender.beforeCreate === "function") {
                var result = extender.beforeCreate(this, options, wasLibLoaded);
                if (typeof result === "object") {
                    if (typeof result.then === "function" && typeof result["catch"] === "function") {
                        // Promise / thenable returned
                        result.then(function(newOptions){
                            if (typeof newOptions === "object") {
                                options = newOptions;
                            }
                            thiz._render(options, extender, wasLibLoaded);
                        })["catch"](function(error) {
                            console.error("extender failed", error);
                        });
                    }
                    else {
                        options = result;
                        this._render(options, extender, wasLibLoaded);
                    }
                }
            }
            else {
                this._render(options, extender, wasLibLoaded);
            }
        },

        _render: function(options, extender, wasLibLoaded) {
            var thiz = this;
            this._editor = monaco.editor.create(this._getEditorContainer().get(0), options);

            if (typeof extender.afterCreate === "function") {
                extender.afterCreate(this, wasLibLoaded);
            }

            // Change event.
            // Set the value of the editor on the hidden textarea.
            this._editor.onDidChangeModelContent(function (changes) {
                thiz._getInput().val(thiz.getMonaco().model.getValue());
                thiz._fireEvent('change', [changes]);
            });

            // Focus / blur
            this._editor.onDidFocusEditorText(function () {
                thiz._fireEvent('focus');
            });
            this._editor.onDidBlurEditorText(function () {
                thiz._fireEvent('blur');
            });

            // Paste
            this._editor.onDidPaste(function(range) {
                thiz._fireEvent('paste', [range]);
            });

            this._fireEvent("initialized");
        },

        _getBaseUrl: function() {
            var res = PrimeFaces.getFacesResource("", "", "0");
            var idx = res.lastIndexOf(".xhtml");
            return idx >= 0 ? res.substring(0, idx) : res;
        },

        _fireEvent : function(eventName, params) {
            var onName = "on" + capitalize(eventName);
            if (this.options[onName]) {
                var eventFn = "(function(){" + this.options[onName] + "})";
                try {
                    eval(eventFn).apply(this, params || []);
                }
                catch (e) {
                    console.error("invalid callback", onName, eventFn, e);
                }
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
            codeLanguage: "",
            extender: "",
            disabled: false,
            onBlur: "",
            onChange: "",
            onFocus: "",
            onPaste: "",
            readonly: false,
            theme: "vs",
            uiLanguage: "",
            version: "1.0"
        },
    });
})();