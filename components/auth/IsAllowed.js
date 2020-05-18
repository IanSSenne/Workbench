import React, { useEffect, useState } from "react";
import IsAuthenticated from "./IsAuthenticated";
import { useFirebase, firebaseReducer, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";

export default function IsAllowed({ org, children, negate }) {
    const firebase = useFirebase();
    let [visible, setVisible] = useState(false);
    const auth = useSelector(state => state.firebase.auth);
    useEffect(() => {
        if (!isEmpty(auth) && isLoaded(auth)) {
            firebase.ref(`org/${org}/users/${auth.uid}`).once("value", snap => {
                if (snap.exists()) {
                    if (snap.val().accepted) {
                        setVisible(true);
                    }
                }
            });
            firebase.ref(`org/${org}/owner`).once("value", snap => {
                if (snap.val() === auth.uid) {
                    setVisible(true);
                }
            });
        }
    }, [auth]);
    if (negate) {
        visible = !visible;
    }
    if (!visible) {
        return null;
    }
    return <>
        {children}
    </>
}