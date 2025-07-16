import type { FC } from "react";
import LayoutPage from "@/layout";
import { Navigate } from "react-router";
import type { RouteObject } from "react-router";
import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import WrapperRouteComponent from "./config";

const NotFound = lazy(() => import("@/pages/404"));
const RulePage = lazy(() => import("@/pages/rules"));
const FeePage = lazy(() => import("@/pages/fee"));
const TargetPage = lazy(() => import("@/pages/targets"));

const routeList: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/rules" />,
  },
  {
    path: "/",
    element: <WrapperRouteComponent auth element={<LayoutPage />} />,
    children: [
      {
        path: "rules",
        element: <RulePage />,
      },
      {
        path: "transactions",
        element: <FeePage />,
      },
      {
        path: "targets",
        element: <TargetPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
