import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { Comment } from "./Comment";
import { CodeBlock } from "./CodeBlock";
export const Item = ({ id }) => {
    const [type, setType] = useState(null);
    const firebase = useFirebase();
    if (type === "comment") {
        return <Comment id={id}></Comment>;
    }
    else {
        return <CodeBlock id={id}></CodeBlock>;
    }
};
