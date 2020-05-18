import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import React from "react";
export default React.forwardRef(function TextEditor(props, ref) {
    return <div style={{ backgroundColor: "white" }}>
        <ReactQuill {...props} ref={ref} formats={["background", "bold", "color", "font", "code", "italic", "link", "size", "strike", "script", "underline", "blockquote", "header", "indent", "list", "align", "direction", "code-block"]}></ReactQuill>
    </div>
})
// {/* <ReactQuill value={text} onChange={(newText, ...a) => {
//     setText(newText);
// }}></ReactQuill> */}