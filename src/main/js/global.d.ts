/// <reference path="../../npm/src/primefaces-monaco.d.ts" />

namespace monaco {
  export interface Environment {
    Locale: { language: string, data: Record<string, unknown> };
  }
}

declare const PrimeFaces: import("../../npm/src/primefaces-monaco").PrimeFaces.PrimeFacesStatic;
