import serialize from "serialize-javascript";

const data_stack = [];
const code_cache = [];
const complete = Symbol("SANDBOX_COMPLETE");
const begin = Symbol("SANDBOX_BEGIN_EXECUTION");
// String for the string primitive.
// Number for the number primitive.
// BigInt for the bigint primitive.
// Boolean for the boolean primitive.
// Symbol for the symbol primitive.
Object.defineProperty(Number.prototype, "toJSON", { value() { return `"${this}"` } });
Object.defineProperty(BigInt.prototype, "toJSON", { value() { return `"${this}"` } });
Object.defineProperty(Boolean.prototype, "toJSON", { value() { return `"${this}"` } });
Object.defineProperty(Symbol.prototype, "toJSON", { value() { return `"${this}"` } });
Object.defineProperty(Function.prototype, "toJSON", { value() { return `function ${this.name}{...}` } });
function resolve_name_on_data_stack(name) {
    for (let i = data_stack.length - 2; i >= 0; i--) {
        if (data_stack[i] && data_stack[i].has(name)) {
            return data_stack[i].get(name);
        }
    }
    return undefined;
}
function execute_from_point(start) {
    for (let i = start; i < code_cache.length; i++) {
        if (data_stack[i] === undefined) {
            data_stack[i] = new Map();
        }
        if (code_cache[i]) {
            code_cache[i].Sandbox[begin]();
            code_cache[i].call(code_cache[i].Sandbox);
            code_cache[i].Sandbox[complete]();
        }
    }
}
function post(data) {
    postMessage(data);
}
onmessage = ({ data }) => {
    const { id, code: { code } } = data;
    data_stack.splice(id);
    const Sandbox = {
        get(items) {
            return items.map(resolve_name_on_data_stack);
        },
        put(items) {
            items.forEach(item => {
                data_stack[data_stack.length - 1].set(...item);
            });
        },
        log(...data) {
            post({ type: "log", data: data.map((_) => JSON.stringify(_)), id });
        },
        [complete]() {
            post({ id, results: Array.from(data_stack[id].entries()).map(_ => [_[0], JSON.stringify(_[1])]), type: "return_values" });
        },
        [begin]() {
            post({ type: "clear_logs", id });
        }
    }
    code_cache[id] = { call: new Function("sandbox", code), Sandbox };
    execute_from_point(id);
}