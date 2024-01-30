import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@tamagui/core/reset.css";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config.ts";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TamaguiProvider config={config}>
      <App />
    </TamaguiProvider>
  </React.StrictMode>
);
