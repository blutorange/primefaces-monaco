package com.github.blutorange.primefaces.component.monacoeditor;

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
        //@ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/0.js"),
        //@ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/editor.js"),
})
// @formatter:on
public class MonacoEditor extends HtmlInputTextarea implements ClientBehaviorHolder, Widget {

    public static final String COMPONENT_TYPE = "com.github.blutorange.primefaces.component.MonacoEditor";
    public static final String COMPONENT_FAMILY = "com.github.blutorange.primefaces.component";

    public static final String RENDERER_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorRenderer";

    // TODO
    public static final String EVENT_INITIALIZED = "initialized";
    public static final String EVENT_BLUR = "blur";
    public static final String EVENT_FOCUS = "focus";
    public static final String EVENT_CHANGE = "change";
    public static final String EVENT_PASTE = "paste";

    public static final String DEFAULT_CODE_LANGUAGE = "";
    public static final String DEFAULT_UI_LANGUAGE = "";
    public static final String DEFAULT_EXTENDER = "";
    public static final boolean DEFAULT_READONLY = false;
    public static final boolean DEFAULT_DISABLED = false;
    public static final String DEFAULT_WIDTH = "200px";
    public static final String DEFAULT_HEIGHT = "600px";
    public static final String DEFAULT_THEME = "vs";
    public static final String DEFAULT_ON_FOCUS = "";
    public static final String DEFAULT_ON_BLUR = "";
    public static final String DEFAULT_ON_CHANGE = "";
    public static final String DEFAULT_ON_PASTE = "";

    // @formatter:off
    private static final Collection<String> EVENT_NAMES = Collections.unmodifiableCollection(
            Arrays.asList(
                    EVENT_INITIALIZED,
                    EVENT_BLUR,
                    EVENT_FOCUS,
                    EVENT_CHANGE,
                    EVENT_PASTE
            )
    );
    // @formatter:on

    // TODO
    enum PropertyKeys {
        CODE_LANGUAGE("codeLanguage"),
        EXTENDER("extender"),
        DISABLED("disabled"),
        ON_BLUR("onBlur"),
        ON_CHANGE("onChange"),
        ON_FOCUS("onFocus"),
        ON_PASTE("onPaste"),
        READONLY("readonly"),
        TABINDEX("tabindex"),
        THEME("theme"),
        UI_LANGUAGE("uiLanguage"),
        WIDGET_VAR("widgetVar"),
        WIDTH("width"),
        HEIGHT("height"),
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

    public String getCodeLanguage() {
        return (String) getStateHelper().eval(PropertyKeys.CODE_LANGUAGE, DEFAULT_CODE_LANGUAGE);
    }

    public void setCodeLanguage(final String codeLanguage) {
        getStateHelper().put(PropertyKeys.CODE_LANGUAGE, codeLanguage);
    }

    public String getUiLanguage() {
        return (String) getStateHelper().eval(PropertyKeys.UI_LANGUAGE, DEFAULT_UI_LANGUAGE);
    }

    public void setUiLanguage(final String uiLanguage) {
        getStateHelper().put(PropertyKeys.UI_LANGUAGE, uiLanguage);
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

    public String getTheme() {
        return (String) getStateHelper().eval(PropertyKeys.THEME, DEFAULT_THEME);
    }

    public void setTheme(final String theme) {
        getStateHelper().put(PropertyKeys.THEME, theme);
    }

    public String getOnChange() {
        return (String) getStateHelper().eval(PropertyKeys.ON_CHANGE, DEFAULT_ON_CHANGE);
    }

    public void setOnChange(final String onChange) {
        getStateHelper().put(PropertyKeys.ON_CHANGE, onChange);
    }

    public String getOnFocus() {
        return (String) getStateHelper().eval(PropertyKeys.ON_FOCUS, DEFAULT_ON_FOCUS);
    }

    public void setOnFocus(final String onFocus) {
        getStateHelper().put(PropertyKeys.ON_FOCUS, onFocus);
    }

    public String getOnBlur() {
        return (String) getStateHelper().eval(PropertyKeys.ON_BLUR, DEFAULT_ON_BLUR);
    }

    public void setOnBlur(final String onBlur) {
        getStateHelper().put(PropertyKeys.ON_BLUR, onBlur);
    }

    public String getOnPaste() {
        return (String) getStateHelper().eval(PropertyKeys.ON_PASTE, DEFAULT_ON_PASTE);
    }

    public void setOnPaste(final String onPaste) {
        getStateHelper().put(PropertyKeys.ON_PASTE, onPaste);
    }
}