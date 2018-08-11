package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorSuggestOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Boolean isFilterGraceful() {
        return (Boolean) obj.get("filterGraceful");
    }

    public EditorSuggestOptions setFilterGraceful(final Boolean filterGraceful) {
        obj.put("filterGraceful", filterGraceful);
        return this;
    }

    public Boolean isSnippetsPreventQuickSuggestions() {
        return (Boolean) obj.get("snippetsPreventQuickSuggestions");
    }

    public EditorSuggestOptions setSnippetsPreventQuickSuggestions(final Boolean snippetsPreventQuickSuggestions) {
        obj.put("snippetsPreventQuickSuggestions", snippetsPreventQuickSuggestions);
        return this;
    }

    JSONObject getJSONObject() {
        return obj;
    }
    
    @Override
    public String toString() {
        return getJSONObject().toString();
    }
}