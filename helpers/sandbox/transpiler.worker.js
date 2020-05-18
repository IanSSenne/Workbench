//  new SandboxWorker();
import escodegen from "escodegen";
import estemplate from "estemplate";
import estraverse from "estraverse";
import { parseModule } from "esprima";
import babel from "@babel/core";

export function transform(code) {
    try {
        const ast = parseModule(code, {
            "tolerant": true
        });
        if (ast.errors.length) {
            return { errors: ast.errors };
        }
        return {
            code: escodegen.generate(estraverse.replace(ast, {
                enter(node) {
                    if (node.type === "ImportDeclaration") {
                        if (node.source.value === "sandbox") {
                            const mappings = [], bindings = [];
                            node.specifiers.forEach(specifier => {
                                switch (specifier.type) {
                                    case "ImportSpecifier":
                                        mappings.push(specifier.local.name)
                                        bindings.push(specifier.imported.name);
                                        break;
                                    case "ImportDefaultSpecifier":
                                        break;
                                    case "ImportNamespaceSpecifier":
                                        break;
                                }
                            });
                            if (mappings.length > 0) return estemplate(`const [${mappings.join()}] = $Sandbox.get([${bindings.join()}]);\n`, {});
                        }
                    } else if (node.type === "ExportNamedDeclaration") {
                        return estemplate(`$Sandbox.put([${node.specifiers.map(_ => `["${_.exported.name}",${_.local.name}]`).join(",")}]);\n`, {});
                    }
                }
            }))
        };
    } catch (e) {
        return { errors: ["Compiler error: " + e.message], C_ERRROR: e }
    }
}

onmessage = ({ data }) => {
    postMessage({ code: transform(data.code), id: data.id });
}