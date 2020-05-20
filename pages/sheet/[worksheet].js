import { Wrap } from "../../components/wrap";



// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-markup';


import 'react-simple-code-editor'
import { InjectWorker } from "../../helpers/sandbox/runner";
import { CodeBlock } from "../../components/CodeBlock";
import { SheetContext } from "../../helpers/SheetContext";
import { useFirebase } from "react-redux-firebase";
import { useEffect, useContext, useState } from "react";
import { Comment } from "../../components/Comment";
const Page = () => {
    const [items, setItems] = useState([]);
    const firebase = useFirebase();

    const page = useContext(SheetContext);
    useEffect(() => {
        firebase.ref(`/${page}/workbook`).once("value", (snapshot) => {
            const res = [];
            (snapshot.val() ?? []).forEach((panel, i) => {
                if (panel.type === "code") {
                    res.push(<CodeBlock key={i} id={i} {...panel}></CodeBlock>)
                } else if (panel.type === "comment") {
                    res.push(<Comment key={i} id={i} {...panel}></Comment>)
                }
            });
            setItems(res);
        });
    }, []);
    return <>
        {items}
        <button onClick={() => {
            setItems([...items, <CodeBlock code="//make something awesome!" id={items.length} key={items.length}></CodeBlock>])
        }}>add code block</button>
        <button onClick={() => {
            setItems([...items, <Comment comment="<p>write something awesome!<p>" id={items.length} key={items.length}></Comment>])
        }}>add comment</button>
    </>
}
const Exported = (props) => {
    return <SheetContext.Provider value={props.worksheet}>
        <Wrap>
            <InjectWorker></InjectWorker>
            <Page {...props}></Page>
        </Wrap>
    </SheetContext.Provider>
}
Exported.getInitialProps = async (req) => {
    return { ...req.query };
}

export default Exported;