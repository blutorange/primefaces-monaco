package com.github.blutorange.primefaces.component.monacoeditor;

/**
 * Additional properties for the inline editor widget not covered by the base
 * options.
 */
enum FramedPropertyKeys {
    /**
     * Extender script to add custom functionality via JavaScript. Must
     * be a URL to an extender script that is loaded into the iframe.
     */
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
