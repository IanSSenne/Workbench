import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Loading from './Loading';

import loaderHelper from "../helpers/loaderHelper";
// import "../css/index.css";
const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false, loading: Loading });

export const Code = (props) => {
    loaderHelper.load("code");
    const [postBody, setPostBody] = useState(props.value);
    const isInitialRender = useRef(true);
    useEffect(() => {
        if (!isInitialRender.current) {
            props.onValueChange(postBody);
        }
        isInitialRender.current = false;
    }, [postBody]);
    return <MonacoEditor

        editorDidMount={() => {
            window.MonacoEnvironment.getWorkerUrl = (
                _moduleId,
                label
            ) => {
                if (label === "json")
                    return "/_next/static/json.worker.js";
                if (label === "css")
                    return "/_next/static/css.worker.js";
                if (label === "html")
                    return "/_next/static/html.worker.js";
                if (
                    label === "typescript" ||
                    label === "javascript"
                )
                    return "/_next/static/ts.worker.js";
                return "/_next/static/editor.worker.js";
            };
        }}
        width="1000"
        height="600"
        language="javascript"
        theme="vs-dark"
        options={{
            acceptSuggestionOnCommitCharacter: true,
            autoClosingBrackets: "always",
            autoClosingOvertype: "always",
            autoClosingQuotes: "always",
            codeLens: true
        }}
        value={postBody}
        options={{
            minimap: {
                enabled: true
            }
        }}
        onChange={setPostBody}
    />;
    // </div>;
};
