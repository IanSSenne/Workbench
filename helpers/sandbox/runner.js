
import { useEffect } from "react";
export let $SandboxWorker
export let $TranspileWorker
import SandboxWorker from "./sandbox.worker";
import CompilerWorker from "./transpiler.worker";
export function InjectWorker() {
    useEffect(() => {
        // $SandboxWorker = new SandboxWorker();
        $SandboxWorker = $TranspileWorker = { postMessage: console.log };
        // $SandboxWorker.onmessage = ({ data }) => console.log("AAA", data);
        // $TranspileWorker = new CompilerWorker();
        // $TranspileWorker.onmessage = ({ data }) => $SandboxWorker.postMessage(data);
    }, []);
    return null;
}