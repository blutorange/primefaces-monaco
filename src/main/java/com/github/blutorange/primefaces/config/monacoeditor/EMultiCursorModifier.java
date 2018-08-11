package com.github.blutorange.primefaces.config.monacoeditor;

public enum EMultiCursorModifier {
    CTRL_CMD("ctrlCmd"),
    ALT("alt");

    private final String toString;

    EMultiCursorModifier(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}