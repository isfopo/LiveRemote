import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from "react";
import { IActions } from "../types";
import { Method, SocketActions, SocketState } from "./types";

export const initialState: SocketState = {
  code: null,
  host: null,
  candidates: [],
  loading: false,
  connected: false,
  error: undefined,
};

export const SocketContext = createContext<{
  state: SocketState;
  dispatch: Dispatch<IActions<SocketActions>>;
}>({
  state: initialState,
  dispatch: () => {},
});

const socketReducer: Reducer<SocketState, IActions<SocketActions>> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "found": {
      return {
        ...state,
        candidates: payload,
        loading: false,
      };
    }
    case "connect": {
      const socket = new WebSocket(payload.url);

      // add event listeners

      return {
        ...state,
        host: {
          ...payload,
          socket,
        },
        connected: true,
        loading: false,
      };
    }
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
    case "send": {
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
    }
    case "disconnect":
      if (state.host) {
        state.host.socket.close();
        return {
          ...state,
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
