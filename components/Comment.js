import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { SheetContext } from "../helpers/SheetContext";
import { useFirebase } from "react-redux-firebase";
import "react-quill/dist/quill.bubble.css"
const Quill = dynamic(() => import("react-quill"), { "ssr": false });
export const Comment = ({ id, comment }) => {
    const [value, setValue] = useState(comment);
    const firebase = useFirebase();
    const page = useContext(SheetContext);
    useEffect(() => {
        const timeout_id = setTimeout(() => {
            firebase.ref(`/${page}/workbook/${id}`).set({ comment: value, type: "comment" });
        }, 1000);
        return () => clearTimeout(timeout_id);
    }, [value]);
    return <p>
        <Quill
            defaultValue={value}
            onChange={(evt) => {
                setValue(evt);
            }}
            theme="bubble"
        ></Quill>
    </p>;
};
