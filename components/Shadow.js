import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export const Shadow = ({ children }) => {
    const el = React.useRef();
    const [portal, setPortal] = useState(null);
    useEffect(() => {
        if (el.current) {
            const doc = el.current.shadowRoot || el.current.attachShadow({ mode: 'open' });
            const node = doc.children[0] || document.createElement("div");
            doc.appendChild(node);
            setPortal(ReactDOM.createPortal(children, node));
        }
    }, [el.current, children]);
    return <div ref={el}>
        {portal}
    </div>
}