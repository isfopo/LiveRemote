import { combineReducers } from "@reduxjs/toolkit";
import live from "./live/slice";
import socket from "./socket/slice";

const rootReducer = combineReducers({ live, socket });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
