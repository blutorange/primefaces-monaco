package com.github.blutorange.primefaces.config.monacoeditor;

public enum EMinimapSide {
    RIGHT("right"),
    LEFT("left");

    private final String toString;

    EMinimapSide(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}