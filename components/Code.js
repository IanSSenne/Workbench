import React, { useState, useRef, useContext } from "react";
import { SheetContext } from "../helpers/SheetContext";
import Editor from "react-simple-code-editor";
import { highlight, languages } from 'prismjs/components/prism-core';
export const Code = (props) => {
    const [length, setLength] = useState(props.value.split("\n").length);
    const id = useRef(Math.random().toString(36));
    return <div style={{
        display: "flex"
    }}>
        <label htmlFor={id.current}>
            <ul style={{ display: "inline-block", fontSize: '12px', margin: "0px 10px 0px 0px", listStyle: "none" }}>
                {Array.from(Array(length), (_, i) => <li key={i}>{i + 1}</li>)}
            </ul>
        </label>
        <Editor
            highlight={code => {
                try {
                    return highlight(code, languages.js);
                }
                catch (e) { }
            }}
            textareaId={id.current}
            style={{
                display: "inline-block",
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                width: "100%"
            }}
            {...props}
            onChange={(e) => setLength(e.target.value.split("\n").length)} onValueChange={(e) => {
                setLength(props.value.split("\n").length);
                props.onValueChange && props.onValueChange(e);
            }} />
    </div>;
};
