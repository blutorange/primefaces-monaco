package com.github.blutorange.primefaces.config.monacoeditor;

public enum ELanguage {
    CSS("css"),
    HTML("html"),
    JSON("json"),
    TYPESCRIPT("typescript"),
    JAVASCRIPT("javascript"),
    CSHARP("csharp"),
    FSHARP("fsharp"),
    HANDLEBARS("handlebars"),
    INI("ini"),
    LESS("less"),
    MARKDOWN("markdown"),
    MSDAX("msdax"),
    OBJECTIVE_C("objective-c"),
    PHP("php"),
    POWERSHELL("powershell"),
    PYTHON("python"),
    RAZOR("razor"),
    REDSHIFT("redshift"),
    RUST("rust"),
    SCSS("scss"),
    SQL("sql"),
    SWIFT("swift"),
    XML("xml"),
    COFFEE("coffee"),
    CPP("cpp"),
    CSP("csp"),
    DOCKERFILE("dockerfile"),
    GO("go"),
    JAVA("java"),
    LUA("lua"),
    MYSQL("mysql"),
    PGSQL("pgsql"),
    POSTIATS("postiats"),
    PUG("pug"),
    R("r"),
    REDIS("redis"),
    RUBY("ruby"),
    SB("sb"),
    SOLIDITY("solidity"),
    ST("st"),
    VB("vb"),
    YAML("yaml");

    private final String toString;

    ELanguage(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}