package com.github.blutorange.primefaces.component.monacoeditor;

import java.io.IOException;
import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.convert.Converter;

import com.github.blutorange.primefaces.util.Constants;

import org.apache.commons.lang3.StringEscapeUtils;
import org.primefaces.context.PrimeRequestContext;
import org.primefaces.renderkit.InputRenderer;
import org.primefaces.util.ComponentUtils;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

/**
 * Base renderer for both the framed and inline monaco editor.
 */
abstract class MonacoEditorBaseRenderer<T extends MonacoEditorBase> extends InputRenderer {
    private static final String[] PASSTHROUGH_ATTRS = new String[] {
        "cols",
        "rows",
        "accesskey",
        "alt",
        "autocomplete",
        "placeholder",
        "dir",
        "lang",
        "size",
        "title",
        "maxlength"
    };

    private final Class<T> clazz;

    protected MonacoEditorBaseRenderer(Class<T> clazz) {
        this.clazz = clazz;
    }

    @Override
    public final void decode(final FacesContext context, final UIComponent component) {
        final T monacoEditor = clazz.cast(component);

        // Do not allow modifications if component is not editable.
        if (monacoEditor.isDisabled() || monacoEditor.isReadonly()) { return; }

        // Decode value
        final String clientId = monacoEditor.getClientId() + "_input";
        final Map<String, String> params = context.getExternalContext().getRequestParameterMap();
        if (params.containsKey(clientId)) {
            monacoEditor.setSubmittedValue(params.get(clientId));
        }

        // Decode behaviors
        decodeBehaviors(context, component);
    }

    @Override
    public final Object getConvertedValue(final FacesContext context, final UIComponent component, final Object submittedValue) {
        final T monacoEditor = clazz.cast(component);
        final String value = (String)submittedValue;
        final Converter converter = ComponentUtils.getConverter(context, monacoEditor);

        if (converter != null) { return converter.getAsObject(context, monacoEditor, value); }

        return value;
    }

    @Override
    public final void encodeEnd(final FacesContext context, final UIComponent component) throws IOException {
        final T monacoEditor = clazz.cast(component);
        encodeMarkup(context, monacoEditor);
        encodeScript(context, monacoEditor);
    }

    protected final void encodeMarkup(final FacesContext context, final T monacoEditor) throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = monacoEditor.getClientId();

        String style = monacoEditor.getStyle() != null ? monacoEditor.getStyle() : "";
        style = style.concat(";");
        if (monacoEditor.getWidth() != null && !monacoEditor.getWidth().isEmpty()) {
            style = style.concat("width:" + monacoEditor.getWidth() + ";");
        }
        if (monacoEditor.getHeight() != null && !monacoEditor.getHeight().isEmpty()) {
            style = style.concat("height:" + monacoEditor.getHeight() + ";");
        }
        final StringBuilder styleClass = new StringBuilder();
        styleClass.append(getMainStyleClass() + " ui-hidden-container ");
        if (monacoEditor.isDisabled() || monacoEditor.isReadonly()) {
            styleClass.append("ui-state-disabled ");
        }
        if (monacoEditor.getStyleClass() != null) {
            styleClass.append(monacoEditor.getStyleClass());
        }

        writer.startElement("div", null);
        writer.writeAttribute("id", clientId, null);
        writer.writeAttribute("data-widget-var", monacoEditor.resolveWidgetVar(), null);
        writer.writeAttribute("class", styleClass.toString(), null);
        writer.writeAttribute("style", style, null);

        encodeHiddenInput(context, monacoEditor);
        encodeMonacoEditor(context, monacoEditor);

        writer.endElement("div");
    }

    protected final void encodeHiddenInput(final FacesContext context, final T monacoEditor) throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = monacoEditor.getClientId();

        writer.startElement("div", null);
        writer.writeAttribute("class", "ui-helper-hidden-accessible", null);

        writer.startElement("textarea", monacoEditor);
        writer.writeAttribute("id", clientId + "_input", null);
        writer.writeAttribute("name", clientId + "_input", null);
        writer.writeAttribute("autocomplete", "off", null);
        if (monacoEditor.isReadonly()) {
            writer.writeAttribute("readonly", "readonly", null);
        }
        if (monacoEditor.isDisabled()) {
            writer.writeAttribute("disabled", "disabled", null);
        }

        renderPassThruAttributes(context, monacoEditor, PASSTHROUGH_ATTRS);

        final String valueToRender = ComponentUtils.getValueToRender(context, monacoEditor);
        if (valueToRender != null) {
            writer.writeText(valueToRender, null);
        }
        writer.endElement("textarea");

        writer.endElement("div");
    }

    protected final void encodeScript(final FacesContext context, final T monacoEditor) throws IOException {
        final WidgetBuilder wb = PrimeRequestContext.getCurrentInstance(context).getWidgetBuilder();

        wb.init(getWidgetName(), monacoEditor.resolveWidgetVar(), monacoEditor.getClientId());

        wb.attr("version", Constants.VERSION);

        wb.attr(BasePropertyKeys.AUTO_RESIZE.toString(), monacoEditor.isAutoResize(), MonacoEditorBase.DEFAULT_AUTO_RESIZE);
        wb.attr(BasePropertyKeys.BASENAME.toString(), monacoEditor.getBasename(), MonacoEditorBase.DEFAULT_BASENAME);
        wb.attr(BasePropertyKeys.DIRECTORY.toString(), monacoEditor.getDirectory(), MonacoEditorBase.DEFAULT_DIRECTORY);
        wb.attr(BasePropertyKeys.DISABLED.toString(), monacoEditor.isDisabled(), MonacoEditorBase.DEFAULT_DISABLED);
        wb.attr(BasePropertyKeys.EDITOR_OPTIONS.toString(), monacoEditor.getEditorOptions().toString());
        wb.attr(BasePropertyKeys.EXTENSION.toString(), monacoEditor.getExtension(), MonacoEditorBase.DEFAULT_EXTENSION);
        wb.attr(BasePropertyKeys.LANGUAGE.toString(), monacoEditor.getEditorOptions().getLanguage(), MonacoEditorBase.DEFAULT_LANGUAGE);
        wb.attr(BasePropertyKeys.READONLY.toString(), monacoEditor.isReadonly(), MonacoEditorBase.DEFAULT_READONLY);
        wb.attr(BasePropertyKeys.TABINDEX.toString(), monacoEditor.getTabindex(), MonacoEditorBase.DEFAULT_TABINDEX);
        wb.attr(BasePropertyKeys.UI_LANGUAGE.toString(), monacoEditor.getUiLanguage(), MonacoEditorBase.DEFAULT_UI_LANGUAGE);
        wb.attr(BasePropertyKeys.UI_LANGUAGE_URI.toString(), monacoEditor.getUiLanguageUri(), MonacoEditorBase.DEFAULT_UI_LANGUAGE_URI);
        wb.attr(BasePropertyKeys.HEIGHT.toString(), monacoEditor.getHeight(), MonacoEditorBase.DEFAULT_HEIGHT);
        wb.attr(BasePropertyKeys.WIDTH.toString(), monacoEditor.getWidth(), MonacoEditorBase.DEFAULT_WIDTH);

        array(wb, BasePropertyKeys.AVAILABLE_EVENTS.toString(), monacoEditor.getEventNames());

        callback(wb, BasePropertyKeys.ONBLUR.toString(), monacoEditor.getOnblur(), MonacoEditorBase.DEFAULT_ONBLUR);
        callback(wb, BasePropertyKeys.ONFOCUS.toString(), monacoEditor.getOnfocus(), MonacoEditorBase.DEFAULT_ONFOCUS);
        callback(wb, BasePropertyKeys.ONCHANGE.toString(), monacoEditor.getOnchange(), MonacoEditorBase.DEFAULT_ONCHANGE);
        callback(wb, BasePropertyKeys.ONPASTE.toString(), monacoEditor.getOnpaste(), MonacoEditorBase.DEFAULT_ONPASTE);
        callback(wb, BasePropertyKeys.ONMOUSEDOWN.toString(), monacoEditor.getOnmousedown(), MonacoEditorBase.DEFAULT_ONMOUSEDOWN);
        callback(wb, BasePropertyKeys.ONMOUSEMOVE.toString(), monacoEditor.getOnmousemove(), MonacoEditorBase.DEFAULT_ONMOUSEMOVE);
        callback(wb, BasePropertyKeys.ONMOUSEUP.toString(), monacoEditor.getOnmouseup(), MonacoEditorBase.DEFAULT_ONMOUSEUP);
        callback(wb, BasePropertyKeys.ONKEYDOWN.toString(), monacoEditor.getOnkeydown(), MonacoEditorBase.DEFAULT_ONKEYDOWN);
        callback(wb, BasePropertyKeys.ONKEYPRESS.toString(), monacoEditor.getOnkeypress(), MonacoEditorBase.DEFAULT_ONKEYPRESS);
        callback(wb, BasePropertyKeys.ONKEYUP.toString(), monacoEditor.getOnkeyup(), MonacoEditorBase.DEFAULT_ONKEYUP);

        addWidgetProperties(wb, monacoEditor);

        encodeClientBehaviors(context, monacoEditor);
        wb.finish();
    }

    protected final void callback(WidgetBuilder wb, String key, String callback, String defaultValue) throws IOException {
        final String cb = callback != null ? callback : defaultValue;
        if (cb == null || cb.length() == 0) return;
        final String fn = "function(){" + cb + "}";
        wb.callback(key, fn);
    }

    protected final void array(WidgetBuilder wb, String key, Iterable<String> values) throws IOException {
        final StringBuilder builder = new StringBuilder();
        builder.append('[');
        for (final String item : values) {
            // TODO Switch to org.owasp.Encoder
            builder.append('"');
            builder.append(StringEscapeUtils.escapeEcmaScript(item));
            builder.append('"');
            builder.append(',');
        }
        if (builder.length() > 1) {
            builder.setLength(builder.length() - 1);
        }
        builder.append(']');
        wb.nativeAttr(key, builder.toString());
    }

    protected final void expression(WidgetBuilder wb, String key, String expression, String defaultValue) throws IOException {
        final String ex = expression != null ? expression : defaultValue;
        if (ex == null || ex.length() == 0) return;
        final String fn = "function(){return " + ex + ";}";
        wb.callback(key, fn);
    }

    protected abstract void addWidgetProperties(WidgetBuilder wb, T monacoEditor) throws IOException;

    protected abstract void encodeMonacoEditor(final FacesContext context, final T monacoEditor) throws IOException;

    protected abstract String getMainStyleClass();

    protected abstract String getWidgetName();
}
