package com.github.blutorange.primefaces.component.monacoeditor;

/**
 * Additional properties for the inline editor widget not covered by the base
 * options.
 */
enum InlinePropertyKeys {
    /**
     * Extender script to add custom functionality via JavaScript. Must
     * be a JavaScript expression that evaluates to an extender instance.
     */
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
