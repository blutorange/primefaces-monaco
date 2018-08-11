package com.github.blutorange.primefaces.config.monacoeditor;

public enum ECursorStyle {
    BLOCK("block"),
    LINE("line");

    private final String toString;

    ECursorStyle(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}