import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/context-user";
import { ROUTES } from "../routes/routes";

export const UserPage = () => {
  const { user, userLoading } = useUser();

  if (userLoading) return null;

  return user ? <Outlet context={user} /> : <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
};

export const GuestPage = () => {
  const { user, userLoading } = useUser();

  if (userLoading) return null;

  return !user ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />;
};
