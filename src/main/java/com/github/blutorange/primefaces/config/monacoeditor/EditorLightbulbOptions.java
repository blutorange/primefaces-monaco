package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorLightbulbOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Boolean isEnabled() {
        return (Boolean) obj.get("enabled");
    }

    public EditorLightbulbOptions setEnabled(final Boolean enabled) {
        obj.put("enabled", enabled);
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