import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";

import { RouterProvider } from "react-router-dom";
import { ContextProvider } from "./context/ContextProvider.tsx";
import { router } from "./router.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
