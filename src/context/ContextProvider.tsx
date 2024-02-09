import { PropsWithChildren } from "react";
import { LiveProvider } from "./live/LiveProvider";
import { SocketProvider } from "./socket/SocketProvider";
import { DialogProvider } from "./dialog/DialogProvider";

export const ContextProvider = ({ children }: PropsWithChildren) => (
  <LiveProvider>
    <DialogProvider>
      <SocketProvider>{children}</SocketProvider>
    </DialogProvider>
  </LiveProvider>
);
