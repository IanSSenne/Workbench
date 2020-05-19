import { createStore } from "redux";
import rootReducer from "../reducers";

export default function configureStore(initialState, history) {
    return createStore(rootReducer);
}