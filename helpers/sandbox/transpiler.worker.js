//  new SandboxWorker();
import escodegen from "escodegen";
import estemplate from "estemplate";
import estraverse from "estraverse";
import { parseModule } from "esprima";
import { transform as babelTransform } from "@babel/standalone";
// this is here because importing it breaks next.js on my machine...
// importScripts("https://unpkg.com/@babel/standalone/babel.min.js");
export function transform(code) {
    try {
        const ast = parseModule(babelTransform(code, {
            presets: [['env', {
                "targets": {
                    "esmodules": true
                },
                modules: false
            }]]
        }).code, {
            "tolerant": true
        });
        if (ast.errors.length) {
            return { errors: ast.errors };
        }
        const res = {
            code: escodegen.generate(estraverse.replace(ast, {
                enter(node) {
                    if (node.type === "ImportDeclaration") {
                        if (node.source.value === "sandbox") {
                            const mappings = [], bindings = [];
                            node.specifiers.forEach(specifier => {
                                switch (specifier.type) {
                                    case "ImportSpecifier":
                                        mappings.push(specifier.local.name)
                                        bindings.push(JSON.stringify(specifier.imported.name));
                                        break;
                                    case "ImportDefaultSpecifier":
                                        break;
                                    case "ImportNamespaceSpecifier":
                                        break;
                                }
                            });
                            if (mappings.length > 0) return estemplate(`const [${mappings.join()}] = sandbox.get([${bindings.join()}]);\n`, {});
                        }
                    } else if (node.type === "ExportNamedDeclaration") {
                        return estemplate(`sandbox.put([${node.specifiers.map(_ => `["${_.exported.name}",${_.local.name}]`).join(",")}]);\n`, {});
                    }
                    else if (node.type === "FunctionDeclaration") {
                        if (node.generator) {
                            return (estemplate(`function ${node.id.name}(){
                                return sandbox.generator(${escodegen.generate(node)},arguments);
                            }`, {}));
                        }
                    }
                }
            }))
        };
        console.log(res);
        return res;
    } catch (e) {
        console.error(e);
        return { code: "//" + e.message, errors: ["Compiler error: " + e.message] }
    }
}

onmessage = ({ data }) => {
    postMessage({ code: transform(data.code), id: data.id });
}