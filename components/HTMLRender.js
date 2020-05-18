import React from "react";
export default function HTML(props) {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const workingChildren = children.filter(Boolean);
    const parser = new DOMParser();
    for (let child of workingChildren) {
        if (typeof child != "string") {
            throw new Error("HTML expects only strings");
        }
    }
    const xml = parser.parseFromString(workingChildren, "text/html");
    return <HTML.Child type={React.Fragment} xml={xml.body.childNodes}></HTML.Child>
}
HTML.Child = function (props) {
    const { type, xml } = props;

    return React.createElement(type, null, ...Array.from(xml).map((item, index) => {
        if (item.nodeName === "#text") {
            return item.textContent
        }
        return <HTML.Child type={item.nodeName.toLowerCase()} xml={item.childNodes}></HTML.Child>
    }));
}