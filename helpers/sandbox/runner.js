
import { useEffect } from "react";
export let $SandboxWorker
export let $TranspileWorker
import SandboxWorker from "./sandbox.worker";
import CompilerWorker from "./transpiler.worker";
import { useFirebase } from "react-redux-firebase";
const events = new Map();
export function InjectWorker({ sheet }) {
    const firebase = useFirebase();
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
    useEffect(() => {
        if (firebase) {
            firebase.ref(`${sheet}/conf/plugins`).once("value", (snapshot) => {
                if (snapshot.exists()) {

                } else {
                    firebase.ref(`${sheet}/conf/plugins`).set({});
                }
            });
        }
    }, [firebase]);
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