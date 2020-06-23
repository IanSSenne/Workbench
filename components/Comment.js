import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { SheetContext } from "../helpers/SheetContext";
import { useFirebase, isEmpty, isLoaded } from "react-redux-firebase";
import "react-quill/dist/quill.bubble.css"
import { useSelector } from "react-redux";
import Loading from './Loading';
import loaderHelper from "../helpers/loaderHelper";
const Quill = dynamic(() => import("react-quill"), { "ssr": false, loading: Loading });
export const Comment = ({ id, comment }) => {
    loaderHelper.load("comment");
    const [value, setValue] = useState(comment);
    const firebase = useFirebase();
    const page = useContext(SheetContext);
    const auth = useSelector(state => state.firebase.auth);
    useEffect(() => {
        const timeout_id = setTimeout(() => {
            if (!isEmpty(auth) && isLoaded(auth))
                firebase.ref(`/${page}/workbook/${id}`).set({ comment: value, type: "comment" });
        }, 1000);
        return () => clearTimeout(timeout_id);
    }, [value]);
    return <p>
        {/* <button onClick={() => {
            firebase.ref(`/${page}/workbook/${id}`).set(undefined, window.location.reload);
        }}>test</button> */}
        <Quill
            defaultValue={value}
            onChange={(evt) => {
                setValue(evt);
            }}
            theme="bubble"
        ></Quill>
    </p>;
};
