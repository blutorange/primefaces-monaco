package com.github.blutorange.primefaces.component.monacoeditor;

import java.io.IOException;

import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.FacesRenderer;

import org.primefaces.util.WidgetBuilder;

@FacesRenderer(componentFamily = MonacoEditorBase.COMPONENT_FAMILY, rendererType = MonacoEditorFramed.RENDERER_TYPE)
public class MonacoEditorFramedRenderer extends MonacoEditorBaseRenderer<MonacoEditorFramed> {
    public MonacoEditorFramedRenderer() {
        super(MonacoEditorFramed.class);
    }

    @Override
    protected String getMainStyleClass() {
        return "ui-monaco-editor ui-monaco-editor-framed";
    }

    @Override
    protected void addWidgetProperties(WidgetBuilder wb, MonacoEditorFramed monacoEditor) throws IOException {
        wb.attr(InlinePropertyKeys.EXTENDER.toString(), monacoEditor.getExtender(), MonacoEditorInline.DEFAULT_EXTENDER);
    }

    @Override
    protected String getWidgetName() {
        return "ExtMonacoEditorFramed";
    }

    @Override
    protected final void encodeMonacoEditor(final FacesContext context, final MonacoEditorFramed monacoEditor) throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = monacoEditor.getClientId();

        writer.startElement("iframe", null);
        writer.writeAttribute("id", clientId + "_editor", null);
        writer.writeAttribute("class", "ui-monaco-editor-ed", null);
        writer.writeAttribute("style", "width:100%;height:100%;border:0;margin:0;padding:0;overflow:hidden;", null);
        writer.endElement("iframe");
    }
}