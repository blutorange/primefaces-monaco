package com.github.blutorange.primefaces.config.monacoeditor;

public enum ELineNumbers {
    ON("on"),
    OFF("off"),
    RELATIVE("relative"),
    INTERVAL("interval");

    private final String toString;

    ELineNumbers(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}