import type { FC } from "react";
import LayoutPage from "@/layout";
import { Navigate } from "react-router";
import type { RouteObject } from "react-router";
import { lazy, useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import WrapperRouteComponent from "./config";
import { setTableState } from "@/stores/features/table";
import { useAppDispatch } from "@/stores/hook";

const NotFound = lazy(() => import("@/pages/404"));
const RulePage = lazy(() => import("@/pages/rules"));

const routeList: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/rules" />,
  },
  {
    path: "/",
    element: <WrapperRouteComponent element={<LayoutPage />} />,
    children: [
      {
        path: "rules",
        element: <RulePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const RenderRouter: FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setTableState({
        pagination: {
          itemsPerPage: 10,
          page: 1,
        },
      })
    );
  }, [location]);

  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
