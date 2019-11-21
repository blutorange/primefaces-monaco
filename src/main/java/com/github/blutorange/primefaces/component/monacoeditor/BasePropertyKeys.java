package com.github.blutorange.primefaces.component.monacoeditor;

enum BasePropertyKeys {
    AUTO_RESIZE("autoResize"),
    AVAILABLE_EVENTS("availableEvents"),
    BASENAME("basename"),
    DIRECTORY("directory"),
    DISABLED("disabled"),
    EDITOR_OPTIONS("editorOptions"),
    EXTENSION("extension"),
    HEIGHT("height"),
    LANGUAGE("language"),
    READONLY("readonly"),
    TABINDEX("tabindex"),
    UI_LANGUAGE("uiLanguage"),
    UI_LANGUAGE_URI("uiLanguageUri"),
    WIDGET_VAR("widgetVar"),
    WIDTH("width"),

    ONBLUR("onblur"),
    ONCHANGE("onchange"),
    ONFOCUS("onfocus"),
    ONKEYDOWN("onkeydown"),
    ONKEYPRESS("onkeypress"),
    ONKEYUP("onkeyup"),
    ONMOUSEDOWN("onmousedown"),
    ONMOUSEMOVE("onmousemove"),
    ONMOUSEUP("onmouseup"),
    ONPASTE("onpaste"),
    ;

    private final String toString;

    BasePropertyKeys(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}