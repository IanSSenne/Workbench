const data_stack = [];
const code_cache = [];
const complete = Symbol("SANDBOX_COMPLETE");
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
        code_cache[i].call(code_cache[i].Sandbox);
        code_cache[i].Sandbox[complete]();
    }
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
            console.log(...data);
            postMessage({ type: "log", data, id });
        },
        [complete]() {
            postMessage({ id, results: data_stack[id], type: "return_values" });
        }
    }
    code_cache[id] = { call: new Function("sandbox", code), Sandbox };
    execute_from_point(id);
}