package com.github.blutorange.primefaces.config.monacoeditor;

public enum ECursorBlinking {
    BLINK("blink"),
    SMOOTH("smooth"),
    PHASE("phase"),
    EXPAND("expand"),
    SOLID("solid");

    private final String toString;

    ECursorBlinking(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}