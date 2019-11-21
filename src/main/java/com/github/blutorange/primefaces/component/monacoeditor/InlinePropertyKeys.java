package com.github.blutorange.primefaces.component.monacoeditor;

enum InlinePropertyKeys {
    EXTENDER("extender"),

    ;

    private final String toString;

    InlinePropertyKeys(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}