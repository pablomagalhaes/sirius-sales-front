import { combineReducers } from "redux";
import { i18nReducer } from "react-redux-i18n";
import app from "./app";

const rootReducer = combineReducers({ app, i18n: i18nReducer });
export default rootReducer;
