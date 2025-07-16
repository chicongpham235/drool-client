import type { FC } from "react";
import { Navigate } from "react-router-dom";
import { Page403 } from "@/pages/403";
import { RootState } from "@/stores/index";
import type { RouteProps } from "react-router";
import { useSelector } from "react-redux";

export const PrivateRoute: FC<{
  auth: boolean;
  element: React.ReactNode;
}> = ({ auth, element }) => {
  if (!auth) {
    return <Page403 />;
  }
  return element;
};
export const GuestOnlyRoute: FC<RouteProps> = (props) => {
  const { logged, currentUser } = useSelector((state: RootState) => state.auth);
  if (!logged) {
    return props.element;
  }
  if (currentUser && currentUser.id) {
    return <Navigate to="rules" />;
  }
  return props.element;
};
export default PrivateRoute;
