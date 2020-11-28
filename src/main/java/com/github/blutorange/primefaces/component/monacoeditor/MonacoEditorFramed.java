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
 * The inline monaco editor that creates a new instance in a separate iframe
 * to allow for better scoping, i.e. loading types etc. without affecting
 * other editors. There is also an inline widget when this scoping is not
 * required as it also creates more overhead.
 */
// @formatter:off
@FacesComponent(value = MonacoEditorFramed.COMPONENT_TYPE, createTag = true, tagName = "monacoEditorFramed", namespace = "http://github.com/blutorange")
@ResourceDependencies({
        @ResourceDependency(library = "primefaces", name = "jquery/jquery.js"),
        @ResourceDependency(library = "primefaces", name = "core.js"),
        @ResourceDependency(library = "primefaces-blutorange", name = "monacoEditor/widget-framed.js"),
})
// @formatter:on
public class MonacoEditorFramed extends MonacoEditorBase {

    public static final String COMPONENT_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorFramed";

    public static final String RENDERER_TYPE = "com.github.blutorange.primefaces.component.MonacoEditorFramedRenderer";

    static final String DEFAULT_EXTENDER = "";

    protected static final Collection<String> EVENT_NAMES = Collections.unmodifiableCollection( //
        Stream.concat(BASE_EVENT_NAMES.stream(), Arrays.<String>asList( //
         // additional events
        ).stream()).collect(Collectors.toList()) //
    );

    public MonacoEditorFramed() {
        super(RENDERER_TYPE);
    }

    @Override
    public final Collection<String> getEventNames() {
        return EVENT_NAMES;
    }

    public final String getExtender() {
        return (String)getStateHelper().eval(FramedPropertyKeys.EXTENDER, DEFAULT_EXTENDER);
    }

    public final void setExtender(final String extender) {
        getStateHelper().put(FramedPropertyKeys.EXTENDER, extender);
    }
}
