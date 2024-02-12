import { PropsWithChildren } from "react";
import { DialogProvider } from "./dialog/DialogProvider";
import { LiveProvider } from "./live/LiveProvider";

export const ContextProvider = ({ children }: PropsWithChildren) => (
  <LiveProvider>
    <DialogProvider>{children}</DialogProvider>
  </LiveProvider>
);
