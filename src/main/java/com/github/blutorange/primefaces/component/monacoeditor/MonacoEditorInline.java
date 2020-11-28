package com.github.blutorange.primefaces.component.monacoeditor;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.FacesComponent;

/**
 * The inline monaco editor that creates a new instance in a textarea element
 * on the same page. There is alsoa framed version available that creates
 * an editor in an iframe for better scoping.
 */
// @formatter:off
@FacesComponent(value = MonacoEditorInline.COMPONENT_TYPE, createTag = true, tagName = "monacoEditor", namespace = "http://github.com/blutorange")
@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/widget-inline.js"),
})
// @formatter:on
public class MonacoEditorInline extends MonacoEditorBase {

    public static final String COMPONENT_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorInline";

    public static final String RENDERER_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorInlineRenderer";

    static final String DEFAULT_EXTENDER = "";

    protected static final Collection<String> EVENT_NAMES = Collections.unmodifiableCollection( //
        Stream.concat(BASE_EVENT_NAMES.stream(), Arrays.<String>asList( //
         // additional events
        ).stream()).collect(Collectors.toList()) //
    );

    public MonacoEditorInline() {
        super(RENDERER_TYPE);
    }

    @Override
    public final Collection<String> getEventNames() {
        return EVENT_NAMES;
    }

    public final String getExtender() {
        return (String)getStateHelper().eval(InlinePropertyKeys.EXTENDER, DEFAULT_EXTENDER);
    }

    public final void setExtender(final String extender) {
        getStateHelper().put(InlinePropertyKeys.EXTENDER, extender);
    }

}
