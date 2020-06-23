import React, { useEffect, useState } from "react";
import "../scss/index.scss";
import { Wrap } from "../components/wrap";
import { useFirebase, isEmpty, isLoaded } from "react-redux-firebase";
import generate from "meaningful-string";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Login from "../components/login";
const Page = () => {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const router = useRouter();
    const [login, setLogin] = useState(false);
    useEffect(() => {
        if (!isEmpty(auth) && isLoaded(auth)) {
            const uid = generate.meaningful({ numberUpto: 1000, joinBy: "-" }).toLowerCase();
            const ref = firebase.ref(`/${uid}/`);
            ref.on("value", (s) => {
                if (!s.exists()) {
                    ref.set({ workbook: [{ type: "code", code: "//have fun :)" }], owner: auth.uid }).then(() => {
                        router.replace("/sheet/[worksheet]", `/sheet/${uid}`);
                    });
                }
            });
        } else if (isEmpty(auth) && isLoaded(auth)) {
            setLogin(true);
        }
    }, [auth]);
    return login && <Login></Login>
}
export default (props) => {
    return (
        <Wrap><Page></Page></Wrap>
    );
};
