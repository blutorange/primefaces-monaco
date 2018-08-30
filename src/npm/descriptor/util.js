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

function createSimpleGetter(name, type) {
    return `    public ${type.value} ${type.value.toLowerCase() === "boolean" ? "is" : "get"}${capitalize(name)}() {
        return (${type.value}) obj.get("${name}");
    }`;
}

function createSimpleSetter(clazz, name, type, converter) {
    return `    public ${clazz} set${capitalize(name)}(final ${type.value} ${name}) {
        obj.put("${name}", ${converter ? converter(name) : name});
        return this;
    }`;
}

function createEnumGetter(name, type) {
    return createSimpleGetter(name, T_String);
}

function createEnumSetter(clazz, name, type) {
    return createSimpleSetter(clazz, name, type, val => `${val} != null ? ${val}.toString() : null`) + "\n\n" + createSimpleSetter(clazz, name, T_String);
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

function Array(type) {
    return {ŧype: "array", value: `java.util.List<${type.value}>`, getter: createSimpleGetter, setter: createSimpleSetter}
}

function Enum(clazz, ...constants) {
    const code = createEnum(clazz, ...constants);
    const file = path.join(outDir, clazz + ".java");
    fs.writeFile(file, code, {encoding: "UTF-8"}, function(err) {
        if (err) throw err;
        console.log("Wrote", file);
    });
    return {
        type: "String",
        value: clazz,
        getter: createEnumGetter,
        setter: createEnumSetter,
    };
}

function Class(clazz, fields) {
    const code = createClass(clazz, fields);
    const file = path.join(outDir, clazz + ".java");
    fs.writeFile(file, code, {encoding: "UTF-8"}, function(err) {
        if (err) throw err;
        console.log("Wrote", file);
    });
    return {type: "class", value: clazz, getter: createSimpleGetter, setter: createSimpleSetter};
}

const T_Boolean = {type: "class", value: "Boolean", getter: createSimpleGetter, setter: createSimpleSetter}
const T_String = {type: "class", value: "String", getter: createSimpleGetter, setter: createSimpleSetter};
const T_Number = {type: "class", value: "Number", getter: createSimpleGetter, setter: createSimpleSetter};
const CssSize = {
    type: "Union<Number, String>",
    value: "Union<Number, String>",
    getter(name, type) {
        return createSimpleGetter(name, T_String);
    },
    setter(clazz, name, type) {
        const setterString = createSimpleSetter(clazz, name, T_String);
        const setterNumber = createSimpleSetter(clazz, name, T_Number, value => `${value} != null ? ${value}.toString() + "px" : null`);
        return setterNumber + "\n\n" + setterString;
    },
};

exports.Enum = Enum;
exports.Class = Class;
exports.Array = Array;
exports.Boolean = T_Boolean;
exports.String = T_String;
exports.Number = T_Number;
exports.CssSize = CssSize;

exports.clean = clean;
exports.createClass = createClass;
exports.createEnum= createEnum;