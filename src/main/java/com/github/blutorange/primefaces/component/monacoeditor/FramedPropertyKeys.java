package com.github.blutorange.primefaces.component.monacoeditor;

enum FramedPropertyKeys {
    EXTENDER("extender"),

    ;

    private final String toString;

    FramedPropertyKeys(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}