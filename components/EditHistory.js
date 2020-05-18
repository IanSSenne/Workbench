import React, { useState, useEffect } from "react";
import { useFirebase } from "react-redux-firebase";
import { Classes, Button, Tag, Intent } from "@blueprintjs/core";
import HTML from "./HTMLRender";


function Item({ revision, index }) {
    const [visible, setVisible] = useState(false);
    const [author, setAuthor] = useState(null);
    const firebase = useFirebase();
    useEffect(() => {
        firebase.ref(`/users/${revision.author}/displayName`).once("value", (snapshot) => {
            setAuthor(snapshot.val());
        })
    }, []);
    return <Button className={Classes.MINIMAL} onClick={() => setVisible(!visible)}>
        <h3>
            {index === 0 ? "created" : `revised`} by {author} ({new Date(revision.timestamp).toLocaleString()})
            </h3>
        {visible && <>
            <hr />
            <HTML>{revision.definition}</HTML>
            {revision.tags.map((tag, index) => {
                return <Tag
                    intent={tag.isSystemTag ? Intent.SUCCESS : Intent.NONE}
                    key={index}
                    style={{ marginRight: "5px" }}
                // rightIcon={<Button icon={"cross"}></Button>} 
                >{tag.tag}</Tag>
            })}
        </>}
    </Button>
}
export function EditHistory({ word, org, id }) {
    const [hasHistory, setHasHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const firebase = useFirebase();
    useEffect(() => {
        firebase.ref(`/org/${org}/words/${id}/history`).on("value", (snapshot => {
            setHasHistory(snapshot.exists());
            if (snapshot.exists()) {
                const v = snapshot.val();
                if (v) {
                    setHistory(Object.values(v));
                }
            }
            setIsLoading(false);
        }))
    }, []);
    return <div style={{
        "height": "400px",
        overflowY: "scroll"
    }}>{isLoading ? "loading..." : (
        !hasHistory ? <h3>No history found.</h3>//this should never be shown but may be visible during development for words created before this feature was implimented
            : history.map((_, index) => <Item revision={_} index={index} key={index}></Item>)
    )}</div>

}
