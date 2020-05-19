import React, { useState, useEffect, useContext } from "react";
import { highlight, languages } from 'prismjs/components/prism-core';
import { FcNext } from "react-icons/fc";

import { FcPrevious } from "react-icons/fc";
import { runner, $TranspileWorker } from "../helpers/sandbox/runner";

import { Code } from "./Code";

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'

import 'prismjs/themes/prism-dark.css'
import { SheetContext } from "../helpers/SheetContext";
import { useFirebase } from "react-redux-firebase";

export const CodeBlock = ({ id, code: initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [logs, setLogs] = useState([]);
    const [results, setResults] = useState([]);
    const firebase = useFirebase();
    const page = useContext(SheetContext);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLogs([]);
            $TranspileWorker.postMessage({ code, id });
            // firebase.ref("/aaaa/").set(1234)
            firebase.ref(`/${page}/workbook/${id}`).set({ type: "code", code }, (error) => console.log(error));
        }, 500);
        return () => clearTimeout(timeout);
    }, [code]);
    useEffect(() => {
        runner.on(id, (packet) => {
            console.log(packet);
            const { type } = packet;
            switch (type) {
                case "return_values":
                    setResults(packet.results.map(([name, value], i) => {
                        return <span key={i} style={{ paddingRight: "5px" }}><span>{name}</span>=<span dangerouslySetInnerHTML={{ __html: highlight(value, languages.js) }}></span></span>;
                    }));
                    break;
                case "log":
                    setLogs([...logs, <span dangerouslySetInnerHTML={{ __html: highlight(packet.data.join(" "), languages.js) }}></span>]);
                    break;
                case "clear_logs":
                    setLogs([]);
                    break;
            }
        });
        return () => {
            runner.off(id);
        };
    }, [logs]);
    return <div style={{ marginTop: "2em" }}>
        <FcNext></FcNext>
        <Code value={code} onValueChange={code => {
            setCode(code);
        }}></Code>
        <div>
            <FcPrevious></FcPrevious>
            <ul>{logs.map((_, i) => <li key={i}>{_}</li>)}</ul>
            <p>{results}</p>
        </div>
    </div>;
};
