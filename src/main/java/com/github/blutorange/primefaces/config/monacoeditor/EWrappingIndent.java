package com.github.blutorange.primefaces.config.monacoeditor;

public enum EWrappingIndent {
    NONE("none"),
    SAME("same"),
    INDENT("indent"),
    DEEP_INDENT("deepIndent");

    private final String toString;

    EWrappingIndent(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}