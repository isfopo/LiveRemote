import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectPayload, SocketState } from "./types";

const initialState: SocketState = {
  socket: null,
};

export const socket = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    connect: (_, { payload: { url } }: PayloadAction<ConnectPayload>) => {
      return {
        socket: new WebSocket(url),
      };
    },
    disconnect: (state) => {
      if (state.socket) {
        state.socket.close();
        return {
          socket: null,
        };
      }
    },
  },
});

export const { connect, disconnect } = socket.actions;

export default socket.reducer;
