import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useState, useEffect } from "react";
export function AuthenticationStatus(auth) {
    return !isLoaded(auth) ?
        "unknown" :
        isEmpty(auth)
            ? "unauthenticated"
            : "authenticated"
}
export default function IsAuthenticated({ children, target = "authenticated" }) {
    const [isAuthenticated, setAuthenticated] = useState("unknown");
    const auth = useSelector(state => state.firebase.auth)
    const status = AuthenticationStatus(auth);
    if (target === status) return children;

    return null;
}