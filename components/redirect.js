import React, { useEffect } from "react";
import { useRouter } from "next/router";
export default ({ target, auto = true, instant = false }) => {
    const router = useRouter();
    useEffect(() => {
        const id = setTimeout(() => {
            if (globalThis.location && auto) router.replace(target);
        }, instant ? 0 : 1000)
        return () => {
            clearTimeout(id);
        }
    }, [])
    return <a href={target}>if not automatically redirected please click here.</a>
}