import { PropsWithChildren } from "react";
import { createContext, useReducer } from "react";
import { SocketHost } from "./types";
import { Reducer } from "react";
import { Dispatch } from "react";

type SocketAction = {
  type: "connect" | "send" | "disconnect";
  payload?: any;
};

const SocketContext = createContext<SocketHost | null>(null);
export const SocketDispatchContext =
  createContext<Dispatch<SocketAction> | null>(null);

const socketReducer: Reducer<SocketHost | null, SocketAction> = (
  socket,
  action
) => {
  switch (action.type) {
    default: {
      return socket;
    }
  }
};

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [host, dispatch] = useReducer(socketReducer, null);

  return (
    <SocketContext.Provider value={host}>
      <SocketDispatchContext.Provider value={dispatch}>
        {children}
      </SocketDispatchContext.Provider>
    </SocketContext.Provider>
  );
};
