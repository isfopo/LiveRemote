import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SendOptions, SendPayload, SocketHost, SocketState } from "./types";

const initialState: SocketState = {
  code: null,
  host: null,
};

export const socket = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    connectHost: (state, { payload }: PayloadAction<SocketHost>) => {
      return {
        ...state,
        host: payload,
        code: null,
      };
    },
    setCode: (state, { payload }: PayloadAction<number | null>) => {
      return {
        ...state,
        code: payload,
      };
    },
    send: (
      state,
      { payload: { message, codeOverride } }: PayloadAction<SendPayload>
    ) => {
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
            code: codeOverride ?? state.code,
            type: getType(),
          })
        );
      }
    },
    disconnect: (state) => {
      if (state.host) {
        state.host.socket.close();
        return {
          code: null,
          host: null,
        };
      } else {
        return { ...state };
      }
    },
  },
});

export const { connectHost, setCode, send, disconnect } = socket.actions;

export default socket.reducer;
