package com.github.blutorange.primefaces.component.monacoeditor;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

import javax.faces.component.behavior.ClientBehaviorHolder;
import javax.faces.component.html.HtmlInputTextarea;

import com.github.blutorange.primefaces.config.monacoeditor.EditorOptions;

import org.primefaces.component.api.Widget;
import org.primefaces.util.ComponentUtils;

/**
 * Base component for both the framed and inline monaco editor widget.
 */
public abstract class MonacoEditorBase extends HtmlInputTextarea implements ClientBehaviorHolder, Widget {
    public static final String COMPONENT_FAMILY = "com.github.blutorange.primefaces.component";

    static final String EVENT_INITIALIZED = "initialized";
    static final String EVENT_BLUR = "blur";
    static final String EVENT_FOCUS = "focus";
    static final String EVENT_CHANGE = "change";
    static final String EVENT_PASTE = "paste";
    static final String EVENT_MOUSEDOWN = "mousedown";
    static final String EVENT_MOUSEUP = "mouseup";
    static final String EVENT_MOUSEMOVE = "mousemove";
    static final String EVENT_KEYUP = "keyup";
    static final String EVENT_KEYDOWN = "keydown";
    static final String EVENT_KEYPRESS = "keypress";

    static final String DEFAULT_BASENAME = "";
    static final String DEFAULT_DIRECTORY = "";
    static final String DEFAULT_EXTENSION = "";
    static final String DEFAULT_HEIGHT = "600px";
    static final String DEFAULT_LANGUAGE = "plaintext";
    static final String DEFAULT_SCHEME = "";
    static final String DEFAULT_TABINDEX = null;
    static final String DEFAULT_UI_LANGUAGE = "en";
    static final String DEFAULT_UI_LANGUAGE_URI = "";
    static final String DEFAULT_WIDTH = "200px";

    static final boolean DEFAULT_AUTO_RESIZE = false;
    static final boolean DEFAULT_READONLY = false;
    static final boolean DEFAULT_DISABLED = false;

    static final String DEFAULT_ONFOCUS = "";
    static final String DEFAULT_ONBLUR = "";
    static final String DEFAULT_ONCHANGE = "";
    static final String DEFAULT_ONPASTE = "";

    static final String DEFAULT_ONMOUSEMOVE = "";
    static final String DEFAULT_ONMOUSEDOWN = "";
    static final String DEFAULT_ONMOUSEUP = "";
    static final String DEFAULT_ONKEYUP = "";
    static final String DEFAULT_ONKEYDOWN = "";
    static final String DEFAULT_ONKEYPRESS = "";

    protected static final Collection<String> BASE_EVENT_NAMES = Collections.unmodifiableCollection(
            Arrays.asList( //
                    EVENT_INITIALIZED, //
                    EVENT_BLUR, //
                    EVENT_FOCUS, //
                    EVENT_CHANGE, //
                    EVENT_PASTE, //
                    EVENT_KEYDOWN, //
                    EVENT_KEYUP, //
                    EVENT_KEYPRESS, //
                    EVENT_MOUSEDOWN, //
                    EVENT_MOUSEUP, //
                    EVENT_MOUSEMOVE //
            ) //
    );

    public MonacoEditorBase(String rendererType) {
        setRendererType(rendererType);
    }

    @Override
    public final String getFamily() {
        return COMPONENT_FAMILY;
    }

    @Override
    public abstract Collection<String> getEventNames();

    @Override
    public final String getDefaultEventName() {
        return EVENT_CHANGE;
    }

    @Override
    public final String resolveWidgetVar() {
        return ComponentUtils.resolveWidgetVar(getFacesContext(), this);
    }

    public final String getWidgetVar() {
        return (String)getStateHelper().eval(BasePropertyKeys.WIDGET_VAR, null);
    }

    public final void setWidgetVar(final String widgetVar) {
        getStateHelper().put(BasePropertyKeys.WIDGET_VAR, widgetVar);
    }

    @Override
    public final boolean isReadonly() {
        return (Boolean)getStateHelper().eval(BasePropertyKeys.READONLY, DEFAULT_READONLY);
    }

    @Override
    public final void setReadonly(final boolean readonly) {
        getStateHelper().put(BasePropertyKeys.READONLY, readonly);
    }

    @Override
    public final boolean isDisabled() {
        return (Boolean)getStateHelper().eval(BasePropertyKeys.DISABLED, DEFAULT_DISABLED);
    }

    @Override
    public final void setDisabled(final boolean disabled) {
        getStateHelper().put(BasePropertyKeys.DISABLED, disabled);
    }

    @Override
    public final String getTabindex() {
        return (String)getStateHelper().eval(BasePropertyKeys.TABINDEX, null);
    }

    @Override
    public final void setTabindex(final String tabindex) {
        getStateHelper().put(BasePropertyKeys.TABINDEX, tabindex);
    }

    public final boolean isAutoResize() {
        return (Boolean)getStateHelper().eval(BasePropertyKeys.AUTO_RESIZE, DEFAULT_AUTO_RESIZE);
    }

    public final void setAutoResize(final boolean autoResize) {
        getStateHelper().put(BasePropertyKeys.AUTO_RESIZE, autoResize);
    }

    public String getUiLanguage() {
        return (String)getStateHelper().eval(BasePropertyKeys.UI_LANGUAGE, DEFAULT_UI_LANGUAGE);
    }

    public final void setUiLanguage(final String uiLanguage) {
        getStateHelper().put(BasePropertyKeys.UI_LANGUAGE, uiLanguage);
    }

    public final String getUiLanguageUri() {
        return (String)getStateHelper().eval(BasePropertyKeys.UI_LANGUAGE_URI, DEFAULT_UI_LANGUAGE_URI);
    }

    public final void setUiLanguageUri(final String uiLanguageUri) {
        getStateHelper().put(BasePropertyKeys.UI_LANGUAGE_URI, uiLanguageUri);
    }

    public final String getWidth() {
        return (String)getStateHelper().eval(BasePropertyKeys.WIDTH, DEFAULT_WIDTH);
    }

    public final void setWidth(final String width) {
        getStateHelper().put(BasePropertyKeys.WIDTH, width);
    }

    public final String getHeight() {
        return (String)getStateHelper().eval(BasePropertyKeys.HEIGHT, DEFAULT_HEIGHT);
    }

    public final void setHeight(final String height) {
        getStateHelper().put(BasePropertyKeys.HEIGHT, height);
    }

    public final String getExtension() {
        return (String)getStateHelper().eval(BasePropertyKeys.EXTENSION, DEFAULT_EXTENSION);
    }

    public final void setExtension(final String extension) {
        getStateHelper().put(BasePropertyKeys.EXTENSION, extension);
    }

    public final String getBasename() {
        return (String)getStateHelper().eval(BasePropertyKeys.BASENAME, DEFAULT_BASENAME);
    }

    public final void setBasename(final String basename) {
        getStateHelper().put(BasePropertyKeys.BASENAME, basename);
    }

    public final String getDirectory() {
        return (String)getStateHelper().eval(BasePropertyKeys.DIRECTORY, DEFAULT_DIRECTORY);
    }

    public final void setDirectory(final String directory) {
        getStateHelper().put(BasePropertyKeys.DIRECTORY, directory);
    }

    public final String getScheme() {
        return (String)getStateHelper().eval(BasePropertyKeys.SCHEME, DEFAULT_SCHEME);
    }

    public final void setScheme(final String scheme) {
        getStateHelper().put(BasePropertyKeys.SCHEME, scheme);
    }


    public final EditorOptions getEditorOptions() {
        final EditorOptions editorOptions = (EditorOptions)getStateHelper().eval(BasePropertyKeys.EDITOR_OPTIONS, null);
        return editorOptions != null ? editorOptions : new EditorOptions();
    }

    public final void setEditorOptions(final EditorOptions editorOptions) {
        getStateHelper().put(BasePropertyKeys.EDITOR_OPTIONS, editorOptions);
    }

    public final String getOnpaste() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONPASTE, DEFAULT_ONPASTE);
    }

    public final void setOnpaste(final String onpaste) {
        getStateHelper().put(BasePropertyKeys.ONPASTE, onpaste);
    }

    @Override
    public final String getOnchange() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONCHANGE, DEFAULT_ONCHANGE);
    }

    @Override
    public final void setOnchange(final String onchange) {
        getStateHelper().put(BasePropertyKeys.ONCHANGE, onchange);
    }

    @Override
    public final String getOnfocus() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONFOCUS, DEFAULT_ONFOCUS);
    }

    @Override
    public final void setOnfocus(final String onfocus) {
        getStateHelper().put(BasePropertyKeys.ONFOCUS, onfocus);
    }

    @Override
    public final String getOnblur() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONBLUR, DEFAULT_ONBLUR);
    }

    @Override
    public final void setOnblur(final String onblur) {
        getStateHelper().put(BasePropertyKeys.ONBLUR, onblur);
    }

    @Override
    public final String getOnmousemove() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONMOUSEMOVE, DEFAULT_ONMOUSEMOVE);
    }

    @Override
    public final void setOnmousemove(final String onmousemove) {
        getStateHelper().put(BasePropertyKeys.ONMOUSEMOVE, onmousemove);
    }

    @Override
    public final String getOnmouseup() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONMOUSEUP, DEFAULT_ONMOUSEUP);
    }

    @Override
    public final void setOnmouseup(final String onmouseup) {
        getStateHelper().put(BasePropertyKeys.ONMOUSEUP, onmouseup);
    }

    @Override
    public final String getOnmousedown() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONMOUSEDOWN, DEFAULT_ONMOUSEDOWN);
    }

    @Override
    public final void setOnmousedown(final String onmousedown) {
        getStateHelper().put(BasePropertyKeys.ONMOUSEDOWN, onmousedown);
    }

    @Override
    public final String getOnkeyup() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONKEYUP, DEFAULT_ONKEYUP);
    }

    @Override
    public final void setOnkeyup(final String onkeyup) {
        getStateHelper().put(BasePropertyKeys.ONKEYUP, onkeyup);
    }

    @Override
    public final String getOnkeydown() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONKEYDOWN, DEFAULT_ONKEYDOWN);
    }

    @Override
    public final void setOnkeydown(final String onkeydown) {
        getStateHelper().put(BasePropertyKeys.ONKEYDOWN, onkeydown);
    }

    @Override
    public final String getOnkeypress() {
        return (String)getStateHelper().eval(BasePropertyKeys.ONKEYPRESS, DEFAULT_ONKEYPRESS);
    }

    @Override
    public final void setOnkeypress(final String onkeypress) {
        getStateHelper().put(BasePropertyKeys.ONKEYPRESS, onkeypress);
    }
}
