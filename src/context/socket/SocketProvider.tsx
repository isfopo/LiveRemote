import { PropsWithChildren } from "react";
import { createContext, useReducer } from "react";
import { Method, SocketAction, SocketState } from "./types";
import { Reducer } from "react";
import { Dispatch } from "react";

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

const socketReducer: Reducer<SocketState, SocketAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "connect":
      return {
        ...state,
        host: payload,
      };
    case "checkCode":
      if (state.host?.socket) {
        state.host.socket.send(
          JSON.stringify({
            method: Method.AUTH,
            address: "/code",
            prop: "check",
            code: payload,
          })
        );
      }
      return state;
    case "setCode":
      return {
        ...state,
        code: payload,
      };
    case "send":
      const { message } = payload;
      const getType = () => {
        if (!message.value) return null;
        return message.type ?? typeof message.value === "number"
          ? "int"
          : typeof message.value;
      };

      if (state.host?.socket) {
        state.host.socket.send(
          JSON.stringify({
            ...message,
            code: state.code,
            type: getType(),
          })
        );
      }
      return state;
    case "disconnect":
      if (state.host) {
        state.host.socket.close();
        return {
          code: null,
          host: null,
        };
      } else {
        return state;
      }
    default: {
      return state;
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
