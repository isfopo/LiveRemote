import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { socketMiddleware } from "./middleware/socketMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export default store;
