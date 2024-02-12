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
      return {
        ...state,
        host: {
          ...payload,
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
      const getType = () => {
        if (!payload.value) return null;
        return payload.type ?? typeof payload.value === "number"
          ? "int"
          : typeof payload.value;
      };

      if (state.host?.socket) {
        state.host.socket.send(
          JSON.stringify({
            ...payload,
            code: state.code,
            type: getType(),
          })
        );
      }
      return state;
    }
    case "reset": {
      return initialState;
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
