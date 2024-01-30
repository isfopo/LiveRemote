export interface SocketState {
  socket: WebSocket | null;
}

export interface ConnectPayload {
  url: string;
}
