package com.github.blutorange.primefaces.component.monacoeditor;

import com.github.blutorange.primefaces.util.Constants;
import org.primefaces.context.RequestContext;
import org.primefaces.renderkit.InputRenderer;
import org.primefaces.util.ComponentUtils;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.convert.Converter;
import javax.faces.render.FacesRenderer;
import java.io.IOException;
import java.util.Map;

@FacesRenderer(componentFamily = MonacoEditor.COMPONENT_FAMILY, rendererType = MonacoEditor.RENDERER_TYPE)
public class MonacoEditorRenderer extends InputRenderer {
    @Override
    public void decode(final FacesContext context, final UIComponent component) {
        final MonacoEditor monacoEditor = (MonacoEditor) component;

        // Do not allow modifications if component is not editable.
        if (monacoEditor.isDisabled() || monacoEditor.isReadonly()) {
            return;
        }

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
    public Object getConvertedValue(final FacesContext context, final UIComponent component, final Object submittedValue) {
        final MonacoEditor monacoEditor = (MonacoEditor) component;
        final String value = (String) submittedValue;
        final Converter converter = ComponentUtils.getConverter(context, monacoEditor);

        if (converter != null) {
            return converter.getAsObject(context, monacoEditor, value);
        }

        return value;
    }

    @Override
    public void encodeEnd(final FacesContext context, final UIComponent component) throws IOException {
        final MonacoEditor monacoEditor = (MonacoEditor) component;
        encodeMarkup(context, monacoEditor);
        encodeScript(context, monacoEditor);
    }

    protected void encodeMarkup(final FacesContext context, final MonacoEditor monacoEditor) throws IOException {
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
        final String styleClass = monacoEditor.getStyleClass() != null ? monacoEditor.getStyleClass() : "";

        writer.startElement("div", null);
        writer.writeAttribute("id", clientId, null);
        writer.writeAttribute("class", "ui-monaco-editor " + styleClass, null);
        writer.writeAttribute("style", style, null);

        writer.startElement("input", monacoEditor);
        writer.writeAttribute("id", clientId + "_input", null);
        writer.writeAttribute("name", clientId + "_input", null);
        writer.writeAttribute("type", "hidden", null);
        if (monacoEditor.isReadonly()) {
            writer.writeAttribute("readonly", "readonly", null);
        }
        if (monacoEditor.isDisabled()) {
            writer.writeAttribute("disabled", "disabled", null);
        }
        if (monacoEditor.getTabindex() != null) {
            writer.writeAttribute("tabindex", monacoEditor.getTabindex(), null);
        }
        renderPassThruAttributes(context, monacoEditor, HTML.INPUT_TEXT_ATTRS);
        renderDomEvents(context, monacoEditor, HTML.INPUT_TEXT_EVENTS);
        final String valueToRender = ComponentUtils.getValueToRender(context, monacoEditor);
        if (valueToRender != null) {
            writer.writeAttribute("value", valueToRender, null);
        }
        writer.endElement("input");

        writer.startElement("div", null);
        writer.writeAttribute("class", "ui-monaco-editor-ed", null);
        writer.writeAttribute("style", "width:100%;height:100%;", null);
        writer.endElement("div");

        writer.endElement("div");
    }

    protected void encodeScript(final FacesContext context, final MonacoEditor monacoEditor) throws IOException {
        final WidgetBuilder wb = RequestContext.getCurrentInstance().getWidgetBuilder();
        wb.initWithDomReady("ExtMonacoEditor", monacoEditor.resolveWidgetVar(), monacoEditor.getClientId());

        wb.attr("version", Constants.VERSION);
        wb.attr(MonacoEditor.PropertyKeys.CODE_LANGUAGE.toString(), monacoEditor.getCodeLanguage(), MonacoEditor.DEFAULT_CODE_LANGUAGE);
        wb.attr(MonacoEditor.PropertyKeys.UI_LANGUAGE.toString(), monacoEditor.getUiLanguage(), MonacoEditor.DEFAULT_UI_LANGUAGE);
        wb.attr(MonacoEditor.PropertyKeys.EXTENDER.toString(), monacoEditor.getExtender(), MonacoEditor.DEFAULT_EXTENDER);
        wb.attr(MonacoEditor.PropertyKeys.READONLY.toString(), monacoEditor.isReadonly(), MonacoEditor.DEFAULT_READONLY);
        wb.attr(MonacoEditor.PropertyKeys.DISABLED.toString(), monacoEditor.isDisabled(), MonacoEditor.DEFAULT_DISABLED);
        // TODO more attributes

        encodeClientBehaviors(context, monacoEditor);
        wb.finish();
    }
}