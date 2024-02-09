import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from "react";
import { LiveAction, LiveState } from "./types";

export const initialState: LiveState = {
  song: {
    isPlaying: false,
    recordMode: false,
  },
};

export const LiveContext = createContext<{
  state: LiveState;
  dispatch: Dispatch<LiveAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const liveReducer: Reducer<LiveState, LiveAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "update":
      // parse incoming message to update the Live state
      return state;
    case "reset":
      return initialState;
    default:
      return state;
  }
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(liveReducer, initialState);

  return (
    <LiveContext.Provider value={{ state, dispatch }}>
      {children}
    </LiveContext.Provider>
  );
};
