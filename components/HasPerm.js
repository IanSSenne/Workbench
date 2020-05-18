import { useState, useEffect } from "react";
import { getFirebase } from "react-redux-firebase";
import STATES from "../helpers/scopes";
globalThis.STATES = STATES;

const HasPerm = (props, organization) => {
    const firebase = getFirebase();
    const auth = getFirebase().auth().currentUser;
    if (!props?.children) {
        return new Promise((resolve, reject) => {
            firebase.ref(`/org/${organization}/users/${auth.uid}/scopes`).once("value", (snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().includes(props)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(null);
                }
            })
        });
    }
    const { org, perm, children, any, all } = props;
    const [state, setState] = useState(0);
    useEffect(() => {
        if (any || all) {
            (async () => {
                if (any) {
                    setState(await HasPerm.any(any));
                } else {
                    setState(await HasPerm.all(all));
                }
            })();
        } else {
            firebase.ref(`/org/${org}/users/${auth.uid}/scopes`).once("value", (snapshot) => {
                if (snapshot.exists()) {
                    if (snapshot.val().includes(perm)) {
                        setState(Math.random());
                    }
                }
            });
        }
    }, []);
    if (state === 0) {
        return null;
    }
    return children;
}

HasPerm.any = (perms, organization) => {
    const firebase = getFirebase();
    const auth = getFirebase().auth().currentUser;
    return new Promise((resolve) => {
        firebase.ref(`/org/${organization}/users/${auth.uid}/scopes`).once("value", (snapshot) => {
            if (snapshot.exists()) {
                for (const perm of perms) {
                    if (snapshot.val().includes(perm)) {
                        return resolve(true);
                    }
                }
                return resolve(false);
            } else {
                resolve(null);
            }
        })
    });
}

HasPerm.all = (perms, organization) => {
    const firebase = getFirebase();
    const auth = getFirebase().auth().currentUser;
    return new Promise((resolve) => {
        firebase.ref(`/org/${organization}/users/${auth.uid}/scopes`).once("value", (snapshot) => {
            if (snapshot.exists()) {
                for (const perm of perms) {
                    if (!snapshot.val().includes(perm)) {
                        return resolve(false);
                    }
                }
                return resolve(true);
            } else {
                resolve(null);
            }
        })
    });
}




export default HasPerm;