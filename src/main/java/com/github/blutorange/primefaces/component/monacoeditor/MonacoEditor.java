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
        @ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/0.js"),
        @ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/editor.js"),
})
// @formatter:on
public class MonacoEditor extends HtmlInputTextarea implements ClientBehaviorHolder, Widget {

    public static final String COMPONENT_TYPE = "com.github.blutorange.primefaces.component.MonacoEditor";
    public static final String COMPONENT_FAMILY = "com.github.blutorange.primefaces.component";

    public static final String RENDERER_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorRenderer";

    // TODO
    public static final String EVENT_SAVE = "save";
    public static final String EVENT_INITIALIZE = "initialize";
    public static final String EVENT_BLUR = "blur";
    public static final String EVENT_FOCUS = "focus";
    public static final String EVENT_WYSIWYG_MODE = "wysiwygMode";
    public static final String EVENT_SOURCE_MODE = "sourceMode";
    public static final String EVENT_DIRTY = "dirty";
    public static final String EVENT_CHANGE = "change";

    public static final String DEFAULT_CODE_LANGUAGE = "";
    public static final String DEFAULT_UI_LANGUAGE = "";
    public static final String DEFAULT_CUSTOM_CONFIG = "";
    public static final boolean DEFAULT_READONLY = false;
    public static final boolean DEFAULT_DISABLED = false;
    public static final String DEFAULT_WIDTH = null;
    public static final String DEFAULT_HEIGHT = null;

    // @formatter:off
    private static final Collection<String> EVENT_NAMES = Collections.unmodifiableCollection(
            Arrays.asList(
                    EVENT_SAVE,
                    EVENT_INITIALIZE,
                    EVENT_BLUR,
                    EVENT_FOCUS,
                    EVENT_WYSIWYG_MODE,
                    EVENT_SOURCE_MODE,
                    EVENT_DIRTY,
                    EVENT_CHANGE
            )
    );
    // @formatter:on

    // TODO
    enum PropertyKeys {
        CODE_LANGUAGE("codeLanguage"),
        CUSTOM_CONFIG("customConfig"),
        DISABLED("disabled"),
        READONLY("readonly"),
        TABINDEX("tabindex"),
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
        return EVENT_SAVE;
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

    public String getCustomConfig() {
        return (String) getStateHelper().eval(PropertyKeys.CUSTOM_CONFIG, DEFAULT_CUSTOM_CONFIG);
    }

    public void setCustomConfig(final String customConfig) {
        getStateHelper().put(PropertyKeys.CUSTOM_CONFIG, customConfig);
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
}