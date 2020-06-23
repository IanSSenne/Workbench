import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty, useFirebase } from "react-redux-firebase";
import Scheme from "password-validator";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import {FaTimes} from 'react-icons/fa';
import '../scss/login.scss';

const Pass = new Scheme()
    .is().min(10)
    .is().max(100)
    .has().digits()
    .has().lowercase()
    .has().uppercase()
    .has().letters()
    .has().symbols();

export default () => {
    const [error, setError] = useState(Pass.validate("", { list: true }));
    const [loginPopupShown, setLoginPopupShown] = useState(false);
    const [panel, setPanel] = useState("login");
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase.auth);
    if (isLoaded(auth) && !isEmpty(auth)) {
        return <div className="login">
            <button className="logout" onClick={() => {
                firebase.auth().signOut();
            }}><FiLogIn></FiLogIn></button>
        </div>
    } else {
        return <div className="login">
            <button className="logout" onClick={() => setLoginPopupShown(!loginPopupShown)}><FiLogOut></FiLogOut></button>
            {loginPopupShown &&
            <div className="formModalContainer">
            <div className="formModal">
            <FaTimes onClick={() => setLoginPopupShown(!loginPopupShown)} />
                {panel === "signup" &&
                    <form onSubmit={(evt) => {
                        evt.preventDefault();
                        const formData = new FormData(evt.target);
                        const name = formData.get("USERNAME");
                        const password = formData.get("PASSWORD");
                        if (Pass.validate(password)) {
                            firebase.auth().createUserWithEmailAndPassword(name, password).then(() => {
                                console.log("successfully created account");
                            }).catch(e => {
                                setError(["failed to log in, either you mistyped something or the account does not exist."]);
                            });
                        }
                    }}>
                        <label htmlFor="LOGIN-FORM-USERNAME">Email</label>
                        <input id="LOGIN-FORM-USERNAME" type="text" name="USERNAME" autoComplete="username"></input>
                        <label htmlFor="LOGIN-FORM-PASSWORD">Password</label>
                        <input id="LOGIN-FORM-PASSWORD" type="password" name="PASSWORD" onChange={(e) => {
                            setError(Pass.validate(e.target.value, { list: true }));
                        }} autoComplete="password" />
                        {error.length > 0 ?
                            error.length === 1 ?
                                <span style={{ color: "red" }}>{error}</span>
                                : <span style={{ color: "red" }}>{error.slice(0, error.length - 1).join(", ")} and {error[error.length - 1]}</span>
                            : <span style={{ color: "green" }}>All Requirements Met</span>}
                          <div className="btnContainer">
                            <input type="submit" value="Sign up" />
                            <button onClick={() => setPanel("login")}>Login</button>
                          </div>
                    </form>
                }
                {panel === "login" &&
                    <form onSubmit={(evt) => {
                        evt.preventDefault();
                        const formData = new FormData(evt.target);
                        const name = formData.get("USERNAME");
                        const password = formData.get("PASSWORD");
                        firebase.auth().signInWithEmailAndPassword(name, password).catch(e => {
                            setError(["failed to log in, either you mistyped something or the account does not exist."]);
                        });
                    }}>
                        <label htmlFor="LOGIN-FORM-USERNAME">Email</label>
                        <input id="LOGIN-FORM-USERNAME" type="text" name="USERNAME" autoComplete="username"></input>
                        <label htmlFor="LOGIN-FORM-PASSWORD">Password</label>
                        <input id="LOGIN-FORM-PASSWORD" type="password" name="PASSWORD" onChange={(e) => {
                            setError(Pass.validate(e.target.value, { list: true }));
                        }} autoComplete="password" />
                        <div className="btnContainer">
                          <input type="submit" value='Login' />
                          <button onClick={() => setPanel("signup")}>Sign up</button>
                        </div>
                    </form>
                }
            </div>
</div>
            }
        </div>
    }
}