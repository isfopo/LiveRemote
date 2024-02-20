import set from "lodash.set";
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
    is_playing: 0,
    record_mode: 0,
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
      const updated: LiveState = { ...state };

      set(
        updated,
        [payload.address.split("/"), payload.prop].join("."),
        payload.result
      );

      return updated;
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
