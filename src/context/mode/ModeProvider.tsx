import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from "react";
import { IActions } from "../types";
import { Mode, ModeActions, ModeState } from "./types";

export const initialState: ModeState = {
  mode: Mode.REMOTE,
};

export const ModeContext = createContext<{
  state: ModeState;
  dispatch: Dispatch<IActions<ModeActions>>;
}>({
  state: initialState,
  dispatch: () => {},
});

const ModeReducer: Reducer<ModeState, IActions<ModeActions>> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "update":
      return {
        ...state,
        mode: payload,
      };
    default:
      return state;
  }
};

export const ModeProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(ModeReducer, initialState);

  return (
    <ModeContext.Provider value={{ state, dispatch }}>
      {children}
    </ModeContext.Provider>
  );
};
