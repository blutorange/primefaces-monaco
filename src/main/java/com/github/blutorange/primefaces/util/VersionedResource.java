package com.github.blutorange.primefaces.util;

import javax.faces.application.Resource;
import javax.faces.application.ResourceWrapper;

public class VersionedResource extends ResourceWrapper {
    private final Resource wrapped;
    private final String version;

    public VersionedResource(final Resource resource) {
        super();
        wrapped = resource;
        version = "&v=" + Constants.VERSION;
    }

    @Override
    public Resource getWrapped() {
        return wrapped;
    }

    @Override
    public String getRequestPath() {
        return super.getRequestPath() + version;
    }

    @Override
    public String toString() {
        return getWrapped().toString();
    }
}
