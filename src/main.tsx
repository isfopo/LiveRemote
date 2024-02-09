import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@tamagui/core/reset.css";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ContextProvider } from "./context/ContextProvider.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContextProvider>
      <TamaguiProvider config={config}>
        <RouterProvider router={router} />
      </TamaguiProvider>
    </ContextProvider>
  </React.StrictMode>
);
