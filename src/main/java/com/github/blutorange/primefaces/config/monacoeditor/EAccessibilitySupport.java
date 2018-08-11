package com.github.blutorange.primefaces.config.monacoeditor;

public enum EAccessibilitySupport {
    AUTO("auto"),
    OFF("off"),
    ON("on");

    private final String toString;

    EAccessibilitySupport(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}