import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import HasPerm from "../HasPerm";
import scopes from "../../helpers/scopes";

export default function IsAdmin({ org, children }) {
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        (async () => {
            setIsAdmin(await HasPerm.any([
                scopes.ORG_ADMIN_MANAGE_USERS,
                scopes.ORG_ADMIN_UPLOAD_WORDS,
                scopes.ORG_ADMIN_REMOVE_USERS,
                scopes.ORG_OWNER
            ], org));
        })();
    }, []);

    if (!isAdmin) return null;
    return children;
}