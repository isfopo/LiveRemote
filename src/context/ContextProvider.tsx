import { PropsWithChildren } from "react";
import { LiveProvider } from "./live/LiveProvider";
import { SocketProvider } from "./socket/SocketProvider";

export const ContextProvider = ({ children }: PropsWithChildren) => (
  <LiveProvider>
    <SocketProvider>{children}</SocketProvider>
  </LiveProvider>
);
