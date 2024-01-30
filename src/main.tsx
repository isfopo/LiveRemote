import React = require("react");
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@tamagui/core/reset.css";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config.ts";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TamaguiProvider config={config}>
      <App />
    </TamaguiProvider>
  </React.StrictMode>
);
