// An extener that loads the given typescript definition files into the editor
function createExtender(...typescriptDefinitionFiles) {
    return {
        beforeCreate(widget, options, wasLibLoaded) {
            // Since the configuration is global, we must add the typescript definitions files only
            // if the library was loaded or reloaded.
            if (!wasLibLoaded) return;

            // Load all typescript definitions files and add register them with the editor.
            const fetched = typescriptDefinitionFiles.map(file =>
                fetch(file)
                    .then(response => response.text())
                    .then(text => ({text, file}))
            );
            return Promise.all(fetched)
                .then(defs => defs.forEach(def => {
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(def.text, def.file)
                }))
                .then(() => options);
        },
    };
}

// An extender that loads jquery/jqueryui definition files
function createExtenderBasic() {
    return createExtender(
    	"https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/sizzle/index.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/JQuery.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/JQueryStatic.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/misc.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/legacy.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jqueryui/index.d.ts"
    );
}