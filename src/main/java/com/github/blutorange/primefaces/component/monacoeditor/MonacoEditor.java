package com.github.blutorange.primefaces.component.monacoeditor;

import com.github.blutorange.primefaces.config.monacoeditor.EditorOptions;
import org.primefaces.component.api.Widget;
import org.primefaces.util.ComponentUtils;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.FacesComponent;
import javax.faces.component.behavior.ClientBehaviorHolder;
import javax.faces.component.html.HtmlInputTextarea;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;


// @formatter:off
@FacesComponent(value = MonacoEditor.COMPONENT_TYPE, createTag = true, tagName = "monacoEditor", namespace = "http://github.com/blutorange")
@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/widget.js"),
})
// @formatter:on
public class MonacoEditor extends HtmlInputTextarea implements ClientBehaviorHolder, Widget {

    public static final String COMPONENT_TYPE = "com.github.blutorange.primefaces.component.MonacoEditor";
    public static final String COMPONENT_FAMILY = "com.github.blutorange.primefaces.component";

    public static final String RENDERER_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorRenderer";

    public static final String EVENT_INITIALIZED = "initialized";
    public static final String EVENT_BLUR = "blur";
    public static final String EVENT_FOCUS = "focus";
    public static final String EVENT_CHANGE = "change";
    public static final String EVENT_PASTE = "paste";
    public static final String EVENT_MOUSEDOWN = "mousedown";
    public static final String EVENT_MOUSEUP = "mouseup";
    public static final String EVENT_MOUSEMOVE = "mousemove";
    public static final String EVENT_KEYUP = "keyup";
    public static final String EVENT_KEYDOWN = "keydown";
    public static final String EVENT_KEYPRESS = "keypress";

    public static final String DEFAULT_EXTENDER = "";
    public static final String DEFAULT_HEIGHT = "600px";
    public static final String DEFAULT_UI_LANGUAGE = "en";
    public static final String DEFAULT_UI_LANGUAGE_URI = "";
    public static final String DEFAULT_WIDTH = "200px";

    public static final boolean DEFAULT_AUTO_RESIZE = false;
    public static final boolean DEFAULT_READONLY = false;
    public static final boolean DEFAULT_DISABLED = false;

    public static final String DEFAULT_ONFOCUS = "";
    public static final String DEFAULT_ONBLUR = "";
    public static final String DEFAULT_ONCHANGE = "";
    public static final String DEFAULT_ONPASTE = "";

    public static final String DEFAULT_ONMOUSEMOVE = "";
    public static final String DEFAULT_ONMOUSEDOWN = "";
    public static final String DEFAULT_ONMOUSEUP = "";
    public static final String DEFAULT_ONKEYUP = "";
    public static final String DEFAULT_ONKEYDOWN = "";
    public static final String DEFAULT_ONKEYPRESS = "";

    // @formatter:off
    private static final Collection<String> EVENT_NAMES = Collections.unmodifiableCollection(
            Arrays.asList(
                    EVENT_INITIALIZED,
                    EVENT_BLUR,
                    EVENT_FOCUS,
                    EVENT_CHANGE,
                    EVENT_PASTE,
                    EVENT_KEYDOWN,
                    EVENT_KEYUP,
                    EVENT_KEYPRESS,
                    EVENT_MOUSEDOWN,
                    EVENT_MOUSEUP,
                    EVENT_MOUSEMOVE
            )
    );
    // @formatter:on

    enum PropertyKeys {
        AUTO_RESIZE("autoResize"),
        EDITOR_OPTIONS("editorOptions"),
        EXTENDER("extender"),
        DISABLED("disabled"),
        HEIGHT("height"),
        READONLY("readonly"),
        TABINDEX("tabindex"),
        UI_LANGUAGE("uiLanguage"),
        UI_LANGUAGE_URI("uiLanguageUri"),
        WIDGET_VAR("widgetVar"),
        WIDTH("width"),

        ONBLUR("onblur"),
        ONCHANGE("onchange"),
        ONFOCUS("onfocus"),
        ONKEYDOWN("onkeydown"),
        ONKEYPRESS("onkeypress"),
        ONKEYUP("onkeyup"),
        ONMOUSEDOWN("onmousedown"),
        ONMOUSEMOVE("onmousemove"),
        ONMOUSEUP("onmouseup"),
        ONPASTE("onpaste"),
        ;

        private final String toString;

        PropertyKeys(final String toString) {
            this.toString = toString;
        }

        @Override
        public String toString() {
            return toString;
        }
    }

    public MonacoEditor() {
        setRendererType(RENDERER_TYPE);
    }

    @Override
    public String getFamily() {
        return COMPONENT_FAMILY;
    }

    @Override
    public Collection<String> getEventNames() {
        return EVENT_NAMES;
    }

    @Override
    public String getDefaultEventName() {
        return EVENT_CHANGE;
    }

    @Override
    public String resolveWidgetVar() {
        return ComponentUtils.resolveWidgetVar(getFacesContext(), this);
    }

    public String getWidgetVar() {
        return (String) getStateHelper().eval(PropertyKeys.WIDGET_VAR, null);
    }

    public void setWidgetVar(final String widgetVar) {
        getStateHelper().put(PropertyKeys.WIDGET_VAR, widgetVar);
    }

    @Override
    public boolean isReadonly() {
        return (Boolean) getStateHelper().eval(PropertyKeys.READONLY, DEFAULT_READONLY);
    }

    @Override
    public void setReadonly(final boolean readonly) {
        getStateHelper().put(PropertyKeys.READONLY, readonly);
    }

    @Override
    public boolean isDisabled() {
        return (Boolean) getStateHelper().eval(PropertyKeys.DISABLED, DEFAULT_DISABLED);
    }

    @Override
    public void setDisabled(final boolean disabled) {
        getStateHelper().put(PropertyKeys.DISABLED, disabled);
    }

    @Override
    public String getTabindex() {
        return (String) getStateHelper().eval(PropertyKeys.TABINDEX, null);
    }

    @Override
    public void setTabindex(final String tabindex) {
        getStateHelper().put(PropertyKeys.TABINDEX, tabindex);
    }

    public boolean isAutoResize() {
        return (Boolean) getStateHelper().eval(PropertyKeys.AUTO_RESIZE, DEFAULT_AUTO_RESIZE);
    }

    public void setAutoResize(final boolean autoResize) {
        getStateHelper().put(PropertyKeys.AUTO_RESIZE, autoResize);
    }

    public String getUiLanguage() {
        return (String) getStateHelper().eval(PropertyKeys.UI_LANGUAGE, DEFAULT_UI_LANGUAGE);
    }

    public void setUiLanguage(final String uiLanguage) {
        getStateHelper().put(PropertyKeys.UI_LANGUAGE, uiLanguage);
    }

    public String getUiLanguageUri() {
        return (String) getStateHelper().eval(PropertyKeys.UI_LANGUAGE_URI, DEFAULT_UI_LANGUAGE_URI);
    }

    public void setUiLanguageUri(final String uiLanguageUri) {
        getStateHelper().put(PropertyKeys.UI_LANGUAGE_URI, uiLanguageUri);
    }

    public String getExtender() {
        return (String) getStateHelper().eval(PropertyKeys.EXTENDER, DEFAULT_EXTENDER);
    }

    public void setExtender(final String extender) {
        getStateHelper().put(PropertyKeys.EXTENDER, extender);
    }

    public String getWidth() {
        return (String) getStateHelper().eval(PropertyKeys.WIDTH, DEFAULT_WIDTH);
    }

    public void setWidth(final String width) {
        getStateHelper().put(PropertyKeys.WIDTH, width);
    }

    public String getHeight() {
        return (String) getStateHelper().eval(PropertyKeys.HEIGHT, DEFAULT_HEIGHT);
    }

    public void setHeight(final String height) {
        getStateHelper().put(PropertyKeys.HEIGHT, height);
    }


    public EditorOptions getEditorOptions() {
        final EditorOptions editorOptions = (EditorOptions) getStateHelper().eval(PropertyKeys.EDITOR_OPTIONS, null);
        return editorOptions != null ? editorOptions : new EditorOptions();
    }

    public void setEditorOptions(final EditorOptions editorOptions) {
        getStateHelper().put(PropertyKeys.EDITOR_OPTIONS, editorOptions);
    }

    public String getOnpaste() {
        return (String) getStateHelper().eval(PropertyKeys.ONPASTE, DEFAULT_ONPASTE);
    }

    public void setOnpaste(final String onpaste) {
        getStateHelper().put(PropertyKeys.ONPASTE, onpaste);
    }

    @Override
    public String getOnchange() {
        return (String) getStateHelper().eval(PropertyKeys.ONCHANGE, DEFAULT_ONCHANGE);
    }

    @Override
    public void setOnchange(final String onchange) {
        getStateHelper().put(PropertyKeys.ONCHANGE, onchange);
    }

    @Override
    public String getOnfocus() {
        return (String) getStateHelper().eval(PropertyKeys.ONFOCUS, DEFAULT_ONFOCUS);
    }

    @Override
    public void setOnfocus(final String onfocus) {
        getStateHelper().put(PropertyKeys.ONFOCUS, onfocus);
    }

    @Override
    public String getOnblur() {
        return (String) getStateHelper().eval(PropertyKeys.ONBLUR, DEFAULT_ONBLUR);
    }

    @Override
    public void setOnblur(final String onblur) {
        getStateHelper().put(PropertyKeys.ONBLUR, onblur);
    }

    @Override
    public String getOnmousemove() {
        return (String) getStateHelper().eval(PropertyKeys.ONMOUSEMOVE, DEFAULT_ONMOUSEMOVE);
    }

    @Override
    public void setOnmousemove(final String onmousemove) {
        getStateHelper().put(PropertyKeys.ONMOUSEMOVE, onmousemove);
    }

    @Override
    public String getOnmouseup() {
        return (String) getStateHelper().eval(PropertyKeys.ONMOUSEUP, DEFAULT_ONMOUSEUP);
    }

    @Override
    public void setOnmouseup(final String onmouseup) {
        getStateHelper().put(PropertyKeys.ONMOUSEUP, onmouseup);
    }

    @Override
    public String getOnmousedown() {
        return (String) getStateHelper().eval(PropertyKeys.ONMOUSEDOWN, DEFAULT_ONMOUSEDOWN);
    }

    @Override
    public void setOnmousedown(final String onmousedown) {
        getStateHelper().put(PropertyKeys.ONMOUSEDOWN, onmousedown);
    }

    @Override
    public String getOnkeyup() {
        return (String) getStateHelper().eval(PropertyKeys.ONKEYUP, DEFAULT_ONKEYUP);
    }

    @Override
    public void setOnkeyup(final String onkeyup) {
        getStateHelper().put(PropertyKeys.ONKEYUP, onkeyup);
    }

    @Override
    public String getOnkeydown() {
        return (String) getStateHelper().eval(PropertyKeys.ONKEYDOWN, DEFAULT_ONKEYDOWN);
    }

    @Override
    public void setOnkeydown(final String onkeydown) {
        getStateHelper().put(PropertyKeys.ONKEYDOWN, onkeydown);
    }

    @Override
    public String getOnkeypress() {
        return (String) getStateHelper().eval(PropertyKeys.ONKEYPRESS, DEFAULT_ONKEYPRESS);
    }

    @Override
    public void setOnkeypress(final String onkeypress) {
        getStateHelper().put(PropertyKeys.ONKEYPRESS, onkeypress);
    }
}