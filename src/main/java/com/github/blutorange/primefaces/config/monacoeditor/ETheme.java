package com.github.blutorange.primefaces.config.monacoeditor;

public enum ETheme {
    VS("vs"),
    VS_DARK("vs-dark"),
    HC_BLACK("hc-black");

    private final String toString;

    ETheme(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}