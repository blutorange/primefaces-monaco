package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorHoverOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Number getDelay() {
        return (Number) obj.get("delay");
    }

    public EditorHoverOptions setDelay(final Number delay) {
        obj.put("delay", delay);
        return this;
    }

    public Boolean isEnabled() {
        return (Boolean) obj.get("enabled");
    }

    public EditorHoverOptions setEnabled(final Boolean enabled) {
        obj.put("enabled", enabled);
        return this;
    }

    public Boolean isSticky() {
        return (Boolean) obj.get("sticky");
    }

    public EditorHoverOptions setSticky(final Boolean sticky) {
        obj.put("sticky", sticky);
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