import { PropsWithChildren } from "react";
import { createContext, useReducer } from "react";
import { SocketHost } from "./types";
import { Reducer } from "react";
import { Dispatch } from "react";

export interface SocketState {
  code: number | null;
  host: SocketHost | null;
}

export interface SocketAction {
  type: "connect" | "send" | "disconnect";
  payload?: any;
}

export const initialState: SocketState = {
  code: null,
  host: null,
};

export const SocketContext = createContext<{
  state: SocketState;
  dispatch: Dispatch<SocketAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const socketReducer: Reducer<SocketState, SocketAction> = (socket, action) => {
  switch (action.type) {
    default: {
      return socket;
    }
  }
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  return (
    <SocketContext.Provider value={{ state, dispatch }}>
      {children}
    </SocketContext.Provider>
  );
};
