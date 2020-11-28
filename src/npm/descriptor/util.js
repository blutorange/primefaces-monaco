const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require('mkdirp');

const outDir = path.join(__dirname, "..", "..", "..", "target", "generated-sources", "java", "com", "github", "blutorange", "primefaces", "config", "monacoeditor");
let docId = 0;

function Doc() {
  return `@Doc${++docId}`;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createGetterDoc(docString) {
  if (docString) {
    return [
      `    /**`,
      `     * ${escapeHtml(docString)}`,
      `     */`,
    ].join("\n");
  }
  else {
    return "";
  }
}

function createSetterDoc(name, docString) {
  if (docString) {
    return [
      `    /**`,
      `     * @param ${fieldName(name)} ${escapeHtml(docString)}`,
      `     * @return This same instance, useful for chaining multiple setter methods in one call.`,
      `     */`,
    ].join("\n");
  }
  else {
    return "";
  }
}

function clean(callback) {
  rimraf(outDir, err => {
    if (err) {
      callback(err);
      return;
    }
    mkdirp(outDir).then(() => {
      callback();
    }).catch(err => callback(err));
  });
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.substring(1);
}

function lower(str) {
  if (!str) return "";
  return str.charAt(0).toLowerCase() + str.substring(1);
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

/**
 * @param {string} name
 * @return {string}
 */
function escapeString(name) {
  return name.replace(/(["'\\])/g, "\\$1");
}

/**
 * @param {string} name
 * @return {string}
 */
function toJavaName(name) {
  return name.split(/[^a-zA-Z0-9_]/).map((x,i) => i > 0 ? capitalize(x) : x).join("");
}

function createSimpleGetter(asField, name, type) {
  if (asField) {
    const lines = [];
    lines.push(`    private ${type.value} ${fieldName(name)};`);
    lines.push("");
    lines.push(`    public ${type.value} ${getterName(name, type)}() {
        return ${name};
    }`);
    return lines.join("\n");
  }
  else {
    return `    public ${type.value} ${getterName(name, type)}() {
        return (${type.value}) (has("${escapeString(name)}") ? get("${escapeString(name)}") : null);
    }`;
  }
}

function createSimpleSetter(asField, clazz, name, type, converter) {
  if (asField) {
    return `    public ${clazz} ${setterName(name)}(final ${type.value} ${varName(name)}) {
        this.${fieldName(name)} = ${converter ? converter(name) : varName(name)};
        return this;
    }`;
  }
  else {
    return `    public ${clazz} ${setterName(name)}(final ${type.value} ${varName(name)}) {
        put("${escapeString(name)}", ${converter ? converter(name) : varName(name)});
        return this;
    }`;
  }
}

function createEnumGetter(asField, name, type) {
  return createSimpleGetter(asField, name, T_String(asField));
}

function createEnumSetter(asField, clazz, name, type) {
  const lines = [];
  lines.push(createSimpleSetter(asField, clazz, name, type, val => `${varName(val)} != null ? ${varName(val)}.toString() : null`));
  lines.push("");
  lines.push(createSimpleSetter(asField, clazz, name, T_String(asField)));
  return lines.join("\n");
}

function createHead(clazz, classDoc) {
  return [
    `package com.github.blutorange.primefaces.config.monacoeditor;`,
    ``,
    `import org.primefaces.shaded.json.*;`,
    `import java.io.Serializable;`,
    ``,
    `@SuppressWarnings("serial")`,
    classDoc ? `/**\n * ${classDoc}\n */` : undefined,
    `public class ${clazz} extends JSONObject implements Serializable {`,
  ].filter(x => x !== undefined).join("\n");
}

function createFooter() {
  return [
    `    JSONObject getJSONObject() {`,
    `        return this;`,
    `    }`,
    `}`,
  ].join("\n");
}

function createClass(clazz, fields, classDoc) {
  const lines = [];
  lines.push(createHead(clazz, classDoc));
  let currentDoc = undefined;
  for (const name of Object.keys(fields)) {
    const type = fields[name];
    const isDoc = name.startsWith("@Doc") && typeof type === "string" ? true : false;
    if (isDoc) {
      currentDoc = String(type);
    }
    else {
      lines.push("");
      if (currentDoc) {
        lines.push(createGetterDoc(currentDoc));
      }
      lines.push(type.getter(name, type));
      lines.push("");
      if (currentDoc) {
        lines.push(createSetterDoc(name, currentDoc));
      }
      lines.push(type.setter(clazz, name, type));
      if (type.methods) {
        for (const [_, method] of Object.entries(type.methods)) {
          lines.push("");
          lines.push(method(clazz, name, type));
        }
      }
      currentDoc = undefined;
    }
  }
  lines.push("");
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

function getterName(name, type) {
  return `${type.value.toLowerCase() === "boolean" ? "is" : "get"}${capitalize(toJavaName(name))}`;
}

function setterName(name) {
  return `set${capitalize(toJavaName(name))}`;
}

function fieldName(name) {
  return lower(toJavaName(name));
}

function varName(name) {
  return lower(toJavaName(name));
}

function stripPlural(name) {
  if (name.endsWith("s")) {
    return name.substring(0, name.length - 1);
  }
  return name;
}

function Array(itemType, asField = false) {
  return {
    type: "JSONArray",
    value: `java.util.List<${itemType.value}>`,
    value: `JSONArray`,
    getter: createSimpleGetter.bind(null, asField),
    setter: createSimpleSetter.bind(null, asField),
    generics: [itemType],
    methods: {
      add(clazz, name, type) {
        return [
          `    public ${clazz} add${stripPlural(capitalize(name))}(final ${type.generics[0].value} ...items) {`,
          `        ${type.value} x = ${getterName(name, type)}();`,
          `        if (x == null) ${setterName(name)}(x = new JSONArray());`,
          `        for (${type.generics[0].value} item : items) x.put(item);`,
          `        return this;`,
          `    }`,
        ].join("\n");
      },
      set(clazz, name, type) {
        return [
          `    public ${clazz} set${capitalize(name)}(java.util.List<${type.generics[0].value}> ${name}) {`,
          `        return set${capitalize(name)}(new JSONArray(${name}));`,
          `    }`,
        ].join("\n");
      },
    },
  };
}

function Map(keyType, valueType, asField = false) {
  return {
    type: "JSONObject",
    value: `JSONObject`,
    getter: createSimpleGetter.bind(null, asField),
    setter: createSimpleSetter.bind(null, asField),
    generics: [keyType, valueType],
    methods: {
      add(clazz, name, type) {
        return [
          `    public ${clazz} add${stripPlural(capitalize(name))}(final ${type.generics[0].value} key, final ${type.generics[1].value} value) {`,
          `        ${type.value} x = ${getterName(name, type)}();`,
          `        if (x == null) ${setterName(name)}(x = new JSONObject());`,
          `        x.put(key, value);`,
          `        return this;`,
          `    }`,
        ].join("\n");
      },
      set(clazz, name, type) {
        return [
          `    public ${clazz} set${capitalize(name)}(java.util.Map<${type.generics[0].value},${type.generics[1].value}> ${name}) {`,
          `        return set${capitalize(name)}(new JSONObject(${name}));`,
          `    }`,
        ].join("\n");
      }
    },
  };
}

function Enum(clazz, asField, ...constants) {
  if (typeof asField === "string") {
    constants.unshift(asField);
    asField = false;
  }
  const code = createEnum(clazz, ...constants);
  const file = path.join(outDir, clazz + ".java");
  fs.writeFile(file, code, { encoding: "UTF-8" }, function (err) {
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

function Class(clazz, fields, classDoc, asField = false) {
  const code = createClass(clazz, fields, classDoc);
  const file = path.join(outDir, clazz + ".java");
  fs.writeFile(file, code, { encoding: "UTF-8" }, function (err) {
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
      const setterNumber = createSimpleSetter(asField, clazz, name, T_Number(asField), value => `${varName(value)} != null ? ${varName(value)}.toString() + "px" : null`);
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

exports.Doc = Doc;
exports.clean = clean;
