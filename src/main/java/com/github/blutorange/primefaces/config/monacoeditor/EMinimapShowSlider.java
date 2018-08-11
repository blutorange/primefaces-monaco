package com.github.blutorange.primefaces.config.monacoeditor;

public enum EMinimapShowSlider {
    ALWAYS("always"),
    MOUSEOVER("mouseover");

    private final String toString;

    EMinimapShowSlider(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}