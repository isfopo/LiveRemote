import { PropsWithChildren } from "react";
import { createContext, useReducer } from "react";
import {
  Candidate,
  IncomingMessage,
  Method,
  SocketActions,
  SocketHost,
  SocketState,
  Status,
} from "./types";
import { Reducer } from "react";
import { Dispatch } from "react";
import { IActions } from "../types";
import { range } from "../../helpers/arrays";

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
    case "find": {
      const { port = 8000, base = "192.168.1", high = 255, low = 0 } = payload;
      const promises: Promise<Candidate>[] = [];
      let candidates: SocketHost[] = [];

      for (const ip in range(high - low, low)) {
        promises.push(
          new Promise((resolve, reject) => {
            try {
              const socket = new WebSocket(`ws://${base}.${ip}:${port}`);

              socket.onopen = () => {
                // onConnect?.();
              };

              socket.onmessage = (e) => {
                const message = JSON.parse(e.data) as IncomingMessage;
                if (
                  message.method === Method.AUTH &&
                  message.address === "/socket" &&
                  message.prop === "info" &&
                  message.status === Status.SUCCESS &&
                  socket
                ) {
                  resolve({
                    url: socket.url,
                    name: message.result as string,
                  });
                } else {
                  reject();
                }
              };
              socket.onerror = () => {
                reject();
              };
            } catch {
              reject();
            }
          })
        );
      }

      Promise.allSettled(promises).then((results) => {
        candidates = (
          results.filter(
            (result) => result.status === "fulfilled"
          ) as PromiseFulfilledResult<SocketHost>[]
        ).map((r) => r.value);
      });

      return {
        ...state,
        candidates,
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
