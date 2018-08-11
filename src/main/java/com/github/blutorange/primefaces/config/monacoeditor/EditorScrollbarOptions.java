package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorScrollbarOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public Number getArrowSize() {
        return (Number) obj.get("arrowSize");
    }

    public EditorScrollbarOptions setArrowSize(final Number arrowSize) {
        obj.put("arrowSize", arrowSize);
        return this;
    }

    public Boolean isHandleMouseWheel() {
        return (Boolean) obj.get("handleMouseWheel");
    }

    public EditorScrollbarOptions setHandleMouseWheel(final Boolean handleMouseWheel) {
        obj.put("handleMouseWheel", handleMouseWheel);
        return this;
    }

    public String getHorizontal() {
        return (String) obj.get("horizontal");
    }

    public EditorScrollbarOptions setHorizontal(final String horizontal) {
        obj.put("horizontal", horizontal);
        return this;
    }

    public Boolean isHorizontalHasArrows() {
        return (Boolean) obj.get("horizontalHasArrows");
    }

    public EditorScrollbarOptions setHorizontalHasArrows(final Boolean horizontalHasArrows) {
        obj.put("horizontalHasArrows", horizontalHasArrows);
        return this;
    }

    public Number getHorizontalScrollbarSize() {
        return (Number) obj.get("horizontalScrollbarSize");
    }

    public EditorScrollbarOptions setHorizontalScrollbarSize(final Number horizontalScrollbarSize) {
        obj.put("horizontalScrollbarSize", horizontalScrollbarSize);
        return this;
    }

    public Number getHorizontalSliderSize() {
        return (Number) obj.get("horizontalSliderSize");
    }

    public EditorScrollbarOptions setHorizontalSliderSize(final Number horizontalSliderSize) {
        obj.put("horizontalSliderSize", horizontalSliderSize);
        return this;
    }

    public Boolean isUseShadows() {
        return (Boolean) obj.get("useShadows");
    }

    public EditorScrollbarOptions setUseShadows(final Boolean useShadows) {
        obj.put("useShadows", useShadows);
        return this;
    }

    public String getVertical() {
        return (String) obj.get("vertical");
    }

    public EditorScrollbarOptions setVertical(final String vertical) {
        obj.put("vertical", vertical);
        return this;
    }

    public Number getVerticalScrollbarSize() {
        return (Number) obj.get("verticalScrollbarSize");
    }

    public EditorScrollbarOptions setVerticalScrollbarSize(final Number verticalScrollbarSize) {
        obj.put("verticalScrollbarSize", verticalScrollbarSize);
        return this;
    }

    public Number getVerticalSliderSize() {
        return (Number) obj.get("verticalSliderSize");
    }

    public EditorScrollbarOptions setVerticalSliderSize(final Number verticalSliderSize) {
        obj.put("verticalSliderSize", verticalSliderSize);
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