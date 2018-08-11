package com.github.blutorange.primefaces.config.monacoeditor;

public enum EFontWeight {
    BOLD("bold"),
    BOLDER("bolder"),
    LIGHT("light"),
    LIGHTER("lighter"),
    INHERIT("inherit"),
    INITIAL("initial"),
    _100("100"),
    _200("200"),
    _300("300"),
    _400("400"),
    _500("500"),
    _600("600"),
    _700("700"),
    _800("800"),
    _900("900");

    private final String toString;

    EFontWeight(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}