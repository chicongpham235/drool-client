import type { FC, ReactElement } from "react";
import { GuestOnlyRoute, PrivateRoute } from "./privateRoute";
import type { RouteProps } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { PageLoading } from "@/pages/loading";

export type WrapperRouteProps = RouteProps & {
  auth?: boolean;
  element: ReactElement;
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({
  auth,
  element,
  ...props
}) => {
  const { loadingInfo } = useSelector((state: RootState) => state.auth);
  if (loadingInfo) return <PageLoading />;

  if (!auth) return <GuestOnlyRoute {...props} element={element} />;
  if (auth) return <PrivateRoute {...props} auth={auth} element={element} />;
  return element as ReactElement;
};

export default WrapperRouteComponent;
