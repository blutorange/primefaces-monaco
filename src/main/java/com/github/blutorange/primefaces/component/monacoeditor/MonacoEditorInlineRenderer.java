package com.github.blutorange.primefaces.component.monacoeditor;

import java.io.IOException;

import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.FacesRenderer;

import org.primefaces.util.WidgetBuilder;

/**
 * Default renderer for the inline monaco editor that creates a new instance
 * without iframes.
 */
@FacesRenderer(componentFamily = MonacoEditorBase.COMPONENT_FAMILY, rendererType = MonacoEditorInline.RENDERER_TYPE)
public class MonacoEditorInlineRenderer extends MonacoEditorBaseRenderer<MonacoEditorInline> {
    public MonacoEditorInlineRenderer() {
        super(MonacoEditorInline.class);
    }

    @Override
    protected String getMainStyleClass() {
        return "ui-monaco-editor ui-monaco-editor-inline";
    }

    @Override
    protected void addWidgetProperties(WidgetBuilder wb, MonacoEditorInline monacoEditor) throws IOException {
        expression(wb, InlinePropertyKeys.EXTENDER.toString(), monacoEditor.getExtender(), MonacoEditorInline.DEFAULT_EXTENDER);
    }

    @Override
    protected String getWidgetName() {
        return "ExtMonacoEditorInline";
    }

    @Override
    protected final void encodeMonacoEditor(final FacesContext context, final MonacoEditorInline monacoEditor) throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = monacoEditor.getClientId();

        writer.startElement("div", null);
        writer.writeAttribute("id", clientId + "_editor", null);
        writer.writeAttribute("class", "ui-monaco-editor-ed", null);
        writer.writeAttribute("style", "width:100%;height:100%;", null);
        writer.endElement("div");
    }
}
