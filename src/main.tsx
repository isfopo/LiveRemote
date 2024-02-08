import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@tamagui/core/reset.css";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config.ts";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SocketProvider } from "./context/socket/SocketProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <SocketProvider>
        <TamaguiProvider config={config}>
          <RouterProvider router={router} />
        </TamaguiProvider>
      </SocketProvider>
    </React.StrictMode>
  </Provider>
);
