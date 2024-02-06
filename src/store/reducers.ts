import { combineReducers } from "@reduxjs/toolkit";
import live from "./live/slice";
import socket from "./socket/slice";
import modals from "./modals/slice";

const rootReducer = combineReducers({ live, modals, socket });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
