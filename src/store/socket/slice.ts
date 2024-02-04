import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectPayload, SocketHost, SocketState } from "./types";

const initialState: SocketState = {
  code: null,
  host: null,
};

export const socket = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    connect: (state, { payload }: PayloadAction<SocketHost>) => {
      return {
        host: payload,
        code: null,
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

export const { connect, disconnect } = socket.actions;

export default socket.reducer;
