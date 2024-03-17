import { PropsWithChildren } from "react";
import { DialogProvider } from "./dialog/DialogProvider";
import { LiveProvider } from "./live/LiveProvider";
import { ModeProvider } from "./mode/ModeProvider";

export const ContextProvider = ({ children }: PropsWithChildren) => (
  <LiveProvider>
    <ModeProvider>
      <DialogProvider>{children}</DialogProvider>
    </ModeProvider>
  </LiveProvider>
);
