package com.github.blutorange.primefaces.config.monacoeditor;

public enum ESuggestSelection {
    FIRST("first"),
    RECENTLY_USED("recentlyUsed"),
    RECENTLY_USED_BY_PREFIX("recentlyUsedByPrefix");

    private final String toString;

    ESuggestSelection(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}