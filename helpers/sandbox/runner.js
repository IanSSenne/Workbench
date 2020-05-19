
import { useEffect } from "react";
export let $SandboxWorker
export let $TranspileWorker
import SandboxWorker from "./sandbox.worker";
import CompilerWorker from "./transpiler.worker";
const events = new Map();
export function InjectWorker() {
    useEffect(() => {
        $SandboxWorker = new SandboxWorker();
        // $SandboxWorker = $TranspileWorker = { postMessage: console.log };
        $SandboxWorker.onmessage = ({ data }) => {
            events.get(data.id)?.(data);
        }
        $TranspileWorker = new CompilerWorker();
        $TranspileWorker.onmessage = ({ data }) => {
            $SandboxWorker.postMessage(data);
        }
    }, []);
    return null;
}

export const runner = {
    on(id, cb) {
        events.set(id, cb);
    },
    off(id) {
        events.delete(id);
    }
}