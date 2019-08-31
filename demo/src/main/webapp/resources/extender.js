/// <reference path="../../../../../src/npm/primefaces-monaco.d.ts" />

const StorageScopeGlobal = 0;
const StorageScopeWorkspace = 1;

class LocalStorageService {

	constructor() {
		this._onDidChangeStorage = new monaco.Emitter();
		this.onDidChangeStorage = this._onDidChangeStorage.event;
        this.onWillSaveState = () => ({dispose(){}});
        log("[LocalStorageService] creating");
	}
	
	dispose() {
		this._onDidChangeStorage.dispose();
	}

	get(key, scope, fallbackValue = undefined) {
        log("[LocalStorageService] get", key);
        const value = localStorage.getItem(this.getKey(key));
		return value != undefined ? value : fallbackValue;
	}
	
	getBoolean(key, scope, fallbackValue = undefined) {
        const value = localStorage.getItem(this.getKey(key));
        return value != undefined ? value === "true" : fallbackValue;
	}

	getNumber(key, scope, fallbackValue = undefined) {
        const value = localStorage.getItem(this.getKey(key));
        return value != undefined ? parseInt(value) : fallbackValue;
	}
		
	remove(key, scope) {
        localStorage.removeItem(key);
	}

    store(key, value, scope) {
        log("[LocalStorageService] store", key);
        if (value == undefined) {
            this.remove(key, scope);
        }
        else {
            localStorage.setItem(this.getKey(key), String(value));
        }
    }

	logStorage() {
        // cannot list items in localStorage
	}

    getKey(key) {
        return "monaco." + key;
    }
}

/** @type {Map<string, string>} */
const TypeDeclarations = new Map();

/**
 * An extener that loads the given typescript definition files into the editor
 * @param {boolean} useLocalStorage
 * @param {string[]} typescriptDefinitionFiles
 * @return {import("../../../../../src/npm/primefaces-monaco").MonacoExtender}
 */
function createExtender(useLocalStorage, ...typescriptDefinitionFiles) {
    return {
        beforeCreate(widget, options, wasLibLoaded) {
            // Since the configuration is global, we must add the typescript definitions files only
            // if the library was loaded or reloaded.
            if (!wasLibLoaded) return;

            // Load all typescript definitions files and add register them with the editor.
            const fetched = typescriptDefinitionFiles.map(file =>
                TypeDeclarations.has(file) ?
                    {file, text: TypeDeclarations.get(file)} :
                    fetch(file)
                        .then(response => response.text())
                        .then(text => {
                            TypeDeclarations.set(file, text);
                            return text;
                        })
                        .then(text => ({text, file}))
            );
            return Promise.all(fetched)
                .then(defs => defs.forEach(def => {
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(def.text, def.file)
                }))
                .then(() => options);
        },
        createEditorOverrideServices(editorWidget, options) {
            const overrides = {};
            if (useLocalStorage) {
                overrides.storageService = new LocalStorageService();
            }
            return overrides;
        }
    };
}

// An extender that loads jquery/jqueryui definition files
function createExtenderBasic(useLocalStorage = false) {
    return createExtender(useLocalStorage,
    	"https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/sizzle/index.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/JQuery.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/JQueryStatic.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/misc.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jquery/legacy.d.ts",
        "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/jqueryui/index.d.ts"
    );
}