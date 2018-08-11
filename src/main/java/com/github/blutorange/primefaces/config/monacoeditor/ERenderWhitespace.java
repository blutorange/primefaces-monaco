package com.github.blutorange.primefaces.config.monacoeditor;

public enum ERenderWhitespace {
    NONE("none"),
    BOUNDARY("boundary"),
    ALL("all");

    private final String toString;

    ERenderWhitespace(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}