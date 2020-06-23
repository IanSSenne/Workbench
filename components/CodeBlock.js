import React, { useState, useEffect, useContext, useRef } from "react";
import { highlight, languages } from 'prismjs/components/prism-core';
import { FcNext } from "react-icons/fc";
import '../scss/codeBlock.scss';

import { FcPrevious } from "react-icons/fc";
import { runner, $TranspileWorker } from "../helpers/sandbox/runner";

import { Code } from "./Code";

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'

import 'prismjs/themes/prism-dark.css'
import { SheetContext } from "../helpers/SheetContext";
import { useFirebase, isEmpty, isLoaded } from "react-redux-firebase";
import { auth } from "firebase";
import { useSelector } from "react-redux";

export const CodeBlock = ({ id, code: initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [logs, setLogs] = useState([]);
    const logsRef = useRef([]);
    const [results, setResults] = useState([]);
    const firebase = useFirebase();
    const page = useContext(SheetContext);
    const auth = useSelector(state => state.firebase.auth);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLogs([]);
            $TranspileWorker.postMessage({ code, id });
            if (isLoaded(auth) && !isEmpty(auth)) {
                firebase.ref(`/${page}/workbook/${id}`).set({ type: "code", code }, (error) => console.log(error));
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [code]);
    useEffect(() => {
        runner.on(id, (packet) => {
            const { type } = packet;
            console.log("packet", logs, packet);
            switch (type) {
                case "return_values":
                    setResults(packet.results.map(([name, value], i) => {
                        return <span key={i} style={{ paddingRight: "5px" }}><span>{name}</span>=<span dangerouslySetInnerHTML={{ __html: highlight(value.indexOf("\"function") ? value : JSON.parse(value), languages.js) }}></span></span>;
                    }));
                    break;
                case "log":
                    logsRef.current.push(<span dangerouslySetInnerHTML={{ __html: highlight(packet.data.join(" "), languages.js) }}></span>);
                    // setLogs([...logs, ]);
                    break;
                case "clear_logs":
                    logsRef.current = [];
                    break;
                default:
                    console.log("unknown type", type);
            }
            setLogs(logsRef.current);
        });
        return () => {
            runner.off(id);
        };
    }, []);
    return <div className="codeBlock">
        <div className="container">
            <div className="code-wrapper">
                <Code value={code} onValueChange={code => {
                    setCode(code);
                }}></Code>
            </div>
            <div className="logs">
                <div className="title"><h2>Logs</h2></div>
                <div className="allLogs">
                    <ul>{logs.map((_, i) => <li key={i}>{_}</li>)}</ul>
                </div>
            </div>
        </div>


        <div className="result">
            <div className="title"><h2>{["No Exports", "Exports"][+Boolean(results.length)]}</h2></div>
            {Boolean(results.length) && <div className="allResults">
                <p>{results}</p>
            </div>}
        </div>
    </div>;
};
