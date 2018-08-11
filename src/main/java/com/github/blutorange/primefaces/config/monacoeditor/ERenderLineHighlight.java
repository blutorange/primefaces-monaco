package com.github.blutorange.primefaces.config.monacoeditor;

public enum ERenderLineHighlight {
    NONE("none"),
    GUTTER("gutter"),
    LINE("line"),
    ALL("all");

    private final String toString;

    ERenderLineHighlight(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}