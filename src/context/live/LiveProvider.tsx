import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from "react";
import { IActions } from "../types";
import { LiveActions, LiveState } from "./types";

export const initialState: LiveState = {
  song: {
    isPlaying: false,
    recordMode: false,
  },
};

export const LiveContext = createContext<{
  state: LiveState;
  dispatch: Dispatch<IActions<LiveActions>>;
}>({
  state: initialState,
  dispatch: () => {},
});

const liveReducer: Reducer<LiveState, IActions<LiveActions>> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "update": {
      // parse incoming message to update the Live state
      console.log("update", payload);
      return state;
    }
    case "reset":
      return initialState;
    default:
      return state;
  }
};

export const LiveProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(liveReducer, initialState);

  return (
    <LiveContext.Provider value={{ state, dispatch }}>
      {children}
    </LiveContext.Provider>
  );
};
