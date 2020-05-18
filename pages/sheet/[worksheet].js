import React, { useState, useEffect } from "react";
import { Wrap } from "../../components/wrap";
import Editor from "react-simple-code-editor";
import { highlight, languages } from 'prismjs/components/prism-core';
import { FcPrevious, FcNext } from "react-icons/fc";
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'
import 'react-simple-code-editor'
import { useFirebase } from "react-redux-firebase";
import { InjectWorker, $TranspileWorker } from "../../helpers/sandbox/runner";
const Code = (props) => {
    return <Editor
        highlight={code => { try { return highlight(code, languages.js) } catch (e) { } }}
        padding={10}
        style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
        }}
        onValueChange={() => { }}
        {...props}
    />
}
const Comment = ({ id }) => {
    return <p>comment {id}</p>
}
const CodeBlock = ({ id }) => {
    const [code, setCode] = useState("import {a} from \"sandbox\";\nexport {a};");
    return <div>
        <FcNext></FcNext>
        <Code value={code} onValueChange={code => {
            setCode(code);
            $TranspileWorker.postMessage({ code, id });
        }}></Code>
    </div>
}
const Item = ({ id }) => {
    const [type, setType] = useState(null);
    const firebase = useFirebase();
    if (type === "comment") {
        return <Comment id={id}></Comment>
    } else {
        return <CodeBlock id={id}></CodeBlock>
    }
}

const Page = () => {
    return <>
        <h1>something</h1>
        <CodeBlock id={123}></CodeBlock>
    </>
}
const Exported = (props) => <Wrap><InjectWorker></InjectWorker><Page {...props}></Page></Wrap>
Exported.getInitialProps = async (req) => {
    return { ...req.query };
}

export default Exported;