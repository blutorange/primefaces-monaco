package com.github.blutorange.primefaces.config.monacoeditor;

public enum EWordWrap {
    OFF("off"),
    ON("on"),
    WORD_WRAP_COLUMN("wordWrapColumn"),
    BOUNDED("bounded");

    private final String toString;

    EWordWrap(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}