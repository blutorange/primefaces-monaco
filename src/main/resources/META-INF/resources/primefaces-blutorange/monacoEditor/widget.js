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

    PrimeFaces.widget.ExtMonacoEditor = PrimeFaces.widget.BaseWidget.extend({
        init: function (cfg) {
            this._super(cfg);

            console.log("init");

            this.$input = this.jq.children("input");
            this.$editor = this.jq.children(".ui-monaco-editor-ed");

            // Remove any existing editor.
            if (this._editor !== undefined) {
                this._editor.dispose();
                this._editor = undefined;
            }

            // Set defaults.
            this.options = $.extend({}, this._defaults, this.cfg);

            // Set monaco environment
            window.MonacoEnvironment = window.MonacoEnviroment || {};
            if (!MonacoEnvironment.getWorkerUrl) {
                MonacoEnvironment.getWorkerUrl = createWorkerUrlGetter(this.options.version);
            }

            this._render();

            /*
            // Check if monaco is available.
            if (!(monaco in window)) {
                // Load monaco
                var monacoScriptURI = PrimeFaces.getFacesResource('/monaco/monaco.js', PrimeFacesExt.RESOURCE_LIBRARY, PrimeFacesExt.VERSION);
                var thiz = this;
                PrimeFaces.getScript(monacoScriptURI , function(data, textStatus) {
                    thiz.renderDeferred();
                }, this);
            }
            else {
                this.renderDeferred();
            }
            */
        },

        _render: function () {
            var thiz = this;

            thiz._getEditorContainer().empty();
            thiz._editor = monaco.editor.create(thiz._getEditorContainer().get(0), {
                // TODO options
                value: thiz._getInput().val(),
                language: this.options.codeLanguage
            });

            // TODO setup events

            // Set the value of the editor on the hidden textarea.
            thiz._editor.onDidChangeModelContent(function (changes) {
                thiz._getInput().val(thiz.getEditorInstance().model.getValue());
                thiz._fireEvent('change');
            });
            thiz._getInput().val(thiz.getEditorInstance().model.getValue());
        },

        /**
         * @return {monaco.editor} Instance of the monacor editor, or undefined if this widget is not yet initialized.
         */
        getEditorInstance: function () {
            return this._editor;
        },

        _fireEvent : function(eventName) {
            if (this.cfg.behaviors) {
                var callback = this.cfg.behaviors[eventName];
                if (callback) {
                    var options = {
                        params: []
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
            customConfig: "",
            disabled: false,
            readonly: false,
            uiLanguage: "",
            version: "1.0"
        },
    });
})();