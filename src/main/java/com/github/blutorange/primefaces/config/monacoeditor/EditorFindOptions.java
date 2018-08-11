package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorFindOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Boolean isAutoFindInSelection() {
        return (Boolean) obj.get("autoFindInSelection");
    }

    public EditorFindOptions setAutoFindInSelection(final Boolean autoFindInSelection) {
        obj.put("autoFindInSelection", autoFindInSelection);
        return this;
    }

    public Boolean isSeedSearchStringFromSelection() {
        return (Boolean) obj.get("seedSearchStringFromSelection");
    }

    public EditorFindOptions setSeedSearchStringFromSelection(final Boolean seedSearchStringFromSelection) {
        obj.put("seedSearchStringFromSelection", seedSearchStringFromSelection);
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