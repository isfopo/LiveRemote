import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketHost, SocketState } from "./types";

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
    setCode: (state, { payload }: PayloadAction<string>) => {
      return {
        ...state,
        code: payload,
      };
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

export const { connectHost, disconnect } = socket.actions;

export default socket.reducer;
