package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorMinimapOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Boolean isEnabled() {
        return (Boolean) obj.get("enabled");
    }

    public EditorMinimapOptions setEnabled(final Boolean enabled) {
        obj.put("enabled", enabled);
        return this;
    }

    public Number getMaxColumn() {
        return (Number) obj.get("maxColumn");
    }

    public EditorMinimapOptions setMaxColumn(final Number maxColumn) {
        obj.put("maxColumn", maxColumn);
        return this;
    }

    public Boolean isRenderCharacters() {
        return (Boolean) obj.get("renderCharacters");
    }

    public EditorMinimapOptions setRenderCharacters(final Boolean renderCharacters) {
        obj.put("renderCharacters", renderCharacters);
        return this;
    }

    public String getShowSlider() {
        return (String) obj.get("showSlider");
    }

    public EditorMinimapOptions setShowSlider(final EMinimapShowSlider showSlider) {
        obj.put("showSlider", showSlider != null ? showSlider.toString() : null);
        return this;
    }

    public EditorMinimapOptions setShowSlider(final String showSlider) {
        obj.put("showSlider", showSlider);
        return this;
    }

    public String getSide() {
        return (String) obj.get("side");
    }

    public EditorMinimapOptions setSide(final EMinimapSide side) {
        obj.put("side", side != null ? side.toString() : null);
        return this;
    }

    public EditorMinimapOptions setSide(final String side) {
        obj.put("side", side);
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