//  new SandboxWorker();
import { transform as Babeltransform } from "@babel/standalone";
// importScripts("https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.24.0/babel.js");
export function transform(code) {
    try {
        const babel_code = Babeltransform(code, {
            // const ast = parseModule(Babel.transform(code, {
            presets: [['env', {
                "targets": {
                    "esmodules": true
                },
                modules: false
            }]],
            plugins: [
                function (babel) {
                    // console.log(babel);
                    return {
                        visitor: {
                            ExportNamedDeclaration: (path) => {
                                path.replaceWith(babel.template(`sandbox.put([${path.node.specifiers.map(specifier => {
                                    return `["${specifier.exported.name}",${specifier.local.name}]`
                                })}])`)());
                            },
                            ImportDeclaration: (path) => {
                                // console.log(path.node);
                                if (path.node.source.value === "sandbox") {
                                    path.replaceWith(babel.template(`const [${path.node.specifiers.map(specifier => specifier.local.name)}] = sandbox.get([${path.node.specifiers.map(specifier => {
                                        return `"${specifier.imported.name}"`
                                    })}])`)());
                                } else {
                                    path.replaceWith(babel.template("throw new Error('unsupported import');")());
                                }
                            }
                        }
                    };
                }
            ]
        });
        return babel_code.code;
    } catch (e) {
        console.error(e);
        return { code: "//" + e.message, errors: ["Compiler error: " + e.message] }
    }
}

onmessage = ({ data }) => {
    postMessage({ code: transform(data.code), id: data.id });
}