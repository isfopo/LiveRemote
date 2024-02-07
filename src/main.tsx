import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@tamagui/core/reset.css";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config.ts";
import { SocketProvider } from "./context/socket/SocketProvider.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SocketProvider>
      <TamaguiProvider config={config}>
        <App />
      </TamaguiProvider>
    </SocketProvider>
  </React.StrictMode>
);
