import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from "react";
import { IActions } from "../types";
import { DialogActions, DialogState } from "./types";

export const initialState: DialogState = {
  activeDialog: null,
  previousDialog: null,
};

export const DialogContext = createContext<{
  state: DialogState;
  dispatch: Dispatch<IActions<DialogActions>>;
}>({
  state: initialState,
  dispatch: () => {},
});

const dialogReducer: Reducer<DialogState, IActions<DialogActions>> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "open":
      return {
        previousDialog: state.activeDialog,
        activeDialog: payload,
      };
    case "close":
      return {
        previousDialog: state.activeDialog,
        activeDialog: null,
      };
    default:
      return state;
  }
};

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(dialogReducer, initialState);

  return (
    <DialogContext.Provider value={{ state, dispatch }}>
      {children}
    </DialogContext.Provider>
  );
};
