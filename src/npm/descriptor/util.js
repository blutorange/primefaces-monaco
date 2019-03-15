const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require('mkdirp');

const outDir = path.join(__dirname, "..", "..", "..", "target", "generated-sources", "java", "com", "github", "blutorange", "primefaces", "config", "monacoeditor");

function clean(callback) {
    rimraf(outDir, err => {
        if (err) {
            callback(err);
            return;
        }
        mkdirp(outDir, err => {
            if (err) {
                callback(err);
                return;
            }
            callback();
        });
    });
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.substring(1);
}

function isUpperCase(char) {
    return char !== char.toLowerCase();
}

function isIdentifier(char) {
    return char.match(/[a-zA-Z0-9]/);
}

function isStartIdentifier(char) {
    return char.match(/[a-zA-Z]/);
}

function enumCase(str) {
    const words = [];
    let word = [];
    for (let i = 0; i < str.length; ++i) {
        const char = str.charAt(i);
        const identifier = isIdentifier(char);
        if (isUpperCase(char) || !identifier) {
            if (word.length > 0) {
                words.push(word.join(""));
                word = [];
            }
        }
        if (identifier) word.push(char.toUpperCase());
    }
    if (word.length > 0) {
        words.push(word.join(""));
    }
    const converted = words.join("_");
    if (!isStartIdentifier(converted.charAt(0))) {
        return "_" + converted;
    }
    return converted;
}

function createSimpleGetter(asField, name, type) {
    if (asField) {
        const lines = [];
        lines.push(`    private ${type.value} ${name};`);
        lines.push("");
        lines.push(`    public ${type.value} ${type.value.toLowerCase() === "boolean" ? "is" : "get"}${capitalize(name)}() {
        return ${name};
    }`);
        return lines.join("\n");
    }
    else {
        return `    public ${type.value} ${type.value.toLowerCase() === "boolean" ? "is" : "get"}${capitalize(name)}() {
        return (${type.value}) obj.get("${name}");
    }`;
    }
}

function createSimpleSetter(asField, clazz, name, type, converter) {
    if (asField) {
        return `    public ${clazz} set${capitalize(name)}(final ${type.value} ${name}) {
        this.${name} = ${converter ? converter(name) : name};
        return this;
    }`;    
    }
    else {
        return `    public ${clazz} set${capitalize(name)}(final ${type.value} ${name}) {
        obj.put("${name}", ${converter ? converter(name) : name});
        return this;
    }`;
    }
}

function createEnumGetter(asField, name, type) {
    return createSimpleGetter(asField, name, T_String(asField));
}

function createEnumSetter(asField, clazz, name, type) {
    const lines = [];
    lines.push(createSimpleSetter(asField, clazz, name, type, val => `${val} != null ? ${val}.toString() : null`));
    lines.push("");
    lines.push(createSimpleSetter(asField, clazz, name, T_String(asField)));
    return lines.join("\n");
}

function createHead(clazz) {
    return `package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

@SuppressWarnings("serial")
public class ${clazz} implements Serializable {
    private JSONObject obj = new JSONObject();`;
}

function createFooter() {
    return `
    JSONObject getJSONObject() {
        return obj;
    }
    
    @Override
    public String toString() {
        return getJSONObject().toString();
    }
}`;
}

function createClass(clazz, fields) {
    const lines = [];
    lines.push(createHead(clazz));
    for (const name of Object.keys(fields)) {
        const type = fields[name];
        lines.push("");
        lines.push(type.getter(name, type));
        lines.push("");
        lines.push(type.setter(clazz, name, type));
    }
    lines.push(createFooter());
    return lines.join("\n");
}

function createEnum(clazz, ...constants) {
    return `
package com.github.blutorange.primefaces.config.monacoeditor;

public enum ${clazz} {
${constants.map(constant => `    ${enumCase(constant)}("${constant}")`).join(",\n")};

    private final String toString;

    ${clazz}(final String toString) {
        this.toString = toString;
    }

    @Override
    public String toString() {
        return toString;
    }
}
`.trim();
}

function Array(type, asField = false) {
    return {
        type: "array",
        value: `java.util.List<${type.value}>`,
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function Map(keyType, valueType, asField = false) {
    return {
        type: "map",
        value: `java.util.Map<${keyType.value},${valueType.value}>`,
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function Set(type, asField = false) {
    return {
        type: "set",
        value: `java.util.Set<${type.value}>`,
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function Enum(clazz, asField, ...constants) {
    if (typeof asField === "string") {
        constants.unshift(asField);
        asField = false;
    }
    const code = createEnum(clazz, ...constants);
    const file = path.join(outDir, clazz + ".java");
    fs.writeFile(file, code, {encoding: "UTF-8"}, function(err) {
        if (err) throw err;
        console.log("Wrote", file);
    });
    return {
        type: "String",
        value: clazz,
        getter: createEnumGetter.bind(null, asField),
        setter: createEnumSetter.bind(null, asField),
    };
}

function Class(clazz, fields, asField = false) {
    const code = createClass(clazz, fields);
    const file = path.join(outDir, clazz + ".java");
    fs.writeFile(file, code, {encoding: "UTF-8"}, function(err) {
        if (err) throw err;
        console.log("Wrote", file);
    });
    return {
        type: "class",
        value: clazz,
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function T_Boolean(asField = false) {
    return {
        type: "class",
        value: "Boolean",
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
};

function T_String(asField = false) {
    return {
        type: "class",
        value: "String",
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function T_Number(asField = false) {
    return {
        type: "class",
        value: "Number",
        getter: createSimpleGetter.bind(null, asField),
        setter: createSimpleSetter.bind(null, asField),
    };
}

function CssSize(asField = false) {
    return {
        type: "Union<Number, String>",
        value: "Union<Number, String>",
        getter(name, type) {
            return createSimpleGetter(asField, name, T_String(asField));
        },
        setter(clazz, name, type) {
            const setterString = createSimpleSetter(asField, clazz, name, T_String(asField));
            const setterNumber = createSimpleSetter(asField, clazz, name, T_Number(asField), value => `${value} != null ? ${value}.toString() + "px" : null`);
            return setterNumber + "\n\n" + setterString;
        },
    };
};

exports.Array = Array;
exports.Boolean = T_Boolean;
exports.Class = Class;
exports.CssSize = CssSize;
exports.Enum = Enum;
exports.Map = Map;
exports.Number = T_Number;
exports.Set = Set;
exports.String = T_String;

exports.clean = clean;