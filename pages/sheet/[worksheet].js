import { Wrap } from "../../components/wrap";
import { TopBar } from "../../components/topbar";
import '../../scss/app.scss';
import Loading from '../../components/Loading';
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-markup';

import { InjectWorker } from "../../helpers/sandbox/runner";
import { CodeBlock } from "../../components/CodeBlock";
import { SheetContext } from "../../helpers/SheetContext";
import Login from "../../components/login";
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
    return <section className="addPage">
        {items}
        <button className="addCodeBtn" onClick={() => {
            setItems([...items, <CodeBlock code="//make something awesome!" id={items.length} key={items.length}></CodeBlock>])
        }}>Add code block</button>
        <button className="addCodeBtn" onClick={() => {
            setItems([...items, <Comment comment="<p>write something awesome!<p>" id={items.length} key={items.length}></Comment>])
        }}>Add comment</button>
    </section>
}
const Exported = (props) => {
    return <section className="worksheet">
        <InjectWorker></InjectWorker>
        <SheetContext.Provider value={props.worksheet}>
            <Wrap>
                <TopBar></TopBar>
                {/* <Loading /> */}
                <Page {...props}></Page>
            </Wrap>
        </SheetContext.Provider>
    </section>
}
Exported.getInitialProps = async (req) => {
    return { ...req.query };
}

export default Exported;