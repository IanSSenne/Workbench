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
import { runner, InjectWorker, $TranspileWorker } from "../../helpers/sandbox/runner";
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
const CodeBlock = ({ id, initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [logs, setLogs] = useState([]);
    const [results, setResults] = useState([]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLogs([]);
            $TranspileWorker.postMessage({ code, id });
        }, 500);
        return () => clearTimeout(timeout);
    }, [code])
    useEffect(() => {
        runner.on(id, (packet) => {
            console.log(packet);
            const { type } = packet;
            switch (type) {
                case "return_values":
                    setResults(Array.from(packet.results.entries()).map(([name, value], i) => {
                        return <span key={i} style={{ paddingRight: "5px" }}><span>{name}</span>=<span>{JSON.stringify(value)}</span></span>
                    }));
                    break;
                case "log":
                    setLogs([...logs, <span dangerouslySetInnerHTML={{ __html: highlight(packet.data.map(_ => JSON.stringify(_)).join(","), languages.js) }}></span>]);
                    break;
            }
        });
        return () => {
            runner.off(id);
        }
    }, [logs])
    return <div>
        <FcNext></FcNext>
        <Code value={code} onValueChange={code => {
            setCode(code);
        }}></Code>
        <ul>{logs.map((_, i) => <li key={i}>{_}</li>)}</ul>
        <p>{results}</p>
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
        <CodeBlock id={0} initialCode={`const x = 1337;\nexport {x};`}></CodeBlock>
        <CodeBlock id={1} initialCode={`import {x} from "sandbox";\nsandbox.log(x);\nconst y = x*2;\nexport {y};`}></CodeBlock>
    </>
}
const Exported = (props) => <Wrap><InjectWorker></InjectWorker><Page {...props}></Page></Wrap>
Exported.getInitialProps = async (req) => {
    return { ...req.query };
}

export default Exported;