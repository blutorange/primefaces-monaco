package com.github.blutorange.primefaces.config.monacoeditor;

public enum ESnippetSuggestions {
    TOP("top"),
    BOTTOM("bottom"),
    INLINE("inline"),
    NONE("none");

    private final String toString;

    ESnippetSuggestions(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}