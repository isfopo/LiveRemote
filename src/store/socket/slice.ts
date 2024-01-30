import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ConnectPayload,
  FindPayload,
  IncomingMessage,
  Method,
  SocketState,
  Status,
} from "./types";

const initialState: SocketState = {
  code: null,
  candidates: [],
  socket: null,
};

export const socket = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    findSocket: (
      _,
      {
        payload: {
          port = 9001,
          base = "192.168.1",
          low = 0,
          high = 255,
          timeout = 2000,
        },
      }: PayloadAction<FindPayload>
    ) => {
      let index = low;
      const candidates: WebSocket[] = [];

      const next = () => {
        while (index <= high) {
          tryOne(index++);
        }
      };

      const tryOne = (ip: number) => {
        let socket: WebSocket | null = new WebSocket(
          `ws://${base}.${ip}:${port}`
        );

        console.log(ip);

        setTimeout(() => {
          const s = socket;
          socket = null;
          s?.close();
        }, timeout);

        socket.onopen = () => {
          done();
          next();
        };

        socket.onmessage = (e) => {
          const message = JSON.parse(e.data) as IncomingMessage;
          if (message.method === Method.AUTH) {
            if (message.address === "/socket" && message.prop === "info") {
              if (socket && message.status === Status.SUCCESS) {
                candidates.push(socket);
              }
            }
          }
        };

        socket.onerror = () => {
          done();
          next();
        };
      };

      const done = () => {
        if (index > high) {
          return {
            code: null,
            candidates,
            socket: null,
          };
        }
      };

      next();
    },
    connect: (_, { payload: { url } }: PayloadAction<ConnectPayload>) => {
      return {
        code: "",
        candidates: [],
        socket: new WebSocket(url),
      };
    },
    disconnect: (state) => {
      if (state.socket) {
        state.socket.close();
        return {
          code: null,
          candidates: [],
          socket: null,
        };
      }
    },
  },
});

export const { findSocket, connect, disconnect } = socket.actions;

export default socket.reducer;
