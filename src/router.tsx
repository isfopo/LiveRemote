import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./views/Layout";
import { Index } from "./views/Index";
import { Connect } from "./views/Connect";
import { Remote } from "./views/Remote";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "remote",
        element: <Remote />,
        children: [
          {
            path: "connect",
            element: <Connect />,
          },
        ],
      },
    ],
  },
]);
