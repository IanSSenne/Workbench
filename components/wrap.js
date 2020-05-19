import firebase from "firebase/app";

import "firebase/database";
import "firebase/auth";
import createStore from "../helpers/createStore";
import fbConfig from "../firebase.config.js";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import "../scss/app.scss";

try {
    firebase.initializeApp(fbConfig);
} catch (err) { }

const store = createStore();
const rrfProps = {
    firebase,
    config: {
        userProfile: "users"
    },
    dispatch: store.dispatch
};
export function Wrap({ children }) {
    return <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            {children}
        </ReactReduxFirebaseProvider>
    </Provider>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }