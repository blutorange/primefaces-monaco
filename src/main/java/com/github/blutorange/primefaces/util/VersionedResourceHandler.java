package com.github.blutorange.primefaces.util;

import javax.faces.application.Resource;
import javax.faces.application.ResourceHandler;
import javax.faces.application.ResourceHandlerWrapper;

public class VersionedResourceHandler extends ResourceHandlerWrapper {
    private final ResourceHandler wrapped;

    public VersionedResourceHandler(final ResourceHandler wrapped) {
        super();
        this.wrapped = wrapped;
    }

    @Override
    public javax.faces.application.ResourceHandler getWrapped() {
        return wrapped;
    }

    @Override
    public Resource createResource(final String resourceName, final String libraryName) {
        if (Constants.LIBRARY.equalsIgnoreCase(libraryName)) {
            final Resource resource = super.createResource(resourceName, libraryName);
            return resource != null ? new VersionedResource(resource) : null;
        }

        return super.createResource(resourceName, libraryName);
    }

    @Override
    public Resource createResource(final String resourceName, final String libraryName, final String contentType) {
        if (Constants.LIBRARY.equalsIgnoreCase(libraryName)) {
            final Resource resource = super.createResource(resourceName, libraryName, contentType);
            return resource != null ? new VersionedResource(resource) : null;
        }

        return super.createResource(resourceName, libraryName, contentType);
    }

}
