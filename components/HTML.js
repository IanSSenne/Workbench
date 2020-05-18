import React from "react"
// import HTML_ from "./HTMLRender";
import dynamic from "next/dynamic"

// const HTML_ = dynamic(() => import("./HTMLRender"), { ssr: false });

export default function HMTL(props) {
    return <div dangerouslySetInnerHTML={{ __html: Array.isArray(props.children) ? props.children.join("") : props.children }}></div>
    // return <HTML_ {...props}></HTML_>
}