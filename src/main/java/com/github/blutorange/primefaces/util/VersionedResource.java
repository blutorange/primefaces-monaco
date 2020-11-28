package com.github.blutorange.primefaces.util;

import javax.faces.application.Resource;
import javax.faces.application.ResourceWrapper;

/**
 * A resource with a version string to ensure browsers don't use
 * old scropts when a new version is released.
 */
public class VersionedResource extends ResourceWrapper {
    private final Resource wrapped;
    private final String version;

    /**
     * @param resource The resource to version.
     */
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
