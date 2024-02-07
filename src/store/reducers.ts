import { combineReducers } from "@reduxjs/toolkit";
import live from "./live/slice";

const rootReducer = combineReducers({ live });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
