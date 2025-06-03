import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/context-user";
import { ROUTES } from "../routes/routes";

// New wrapper: AuthInitializer
// This wrapper is responsible for waiting until the initial Firebase auth state
// has been determined (userLoading becomes false).
export const AuthInitializer = () => {
  const { userLoading } = useUser();

  if (userLoading) {
    // While the authentication state is being determined, show a global loading indicator.
    // This is for the very first load of the application or when Firebase is re-initializing.
    return <div className="min-h-screen flex items-center justify-center text-black">Loading application...</div>;
  }

  // Once userLoading is false, it means Firebase has checked the auth state.
  // Now, render the Outlet, allowing the nested routes (GuestPage/UserPage)
  // to proceed based on the known user status.
  return <Outlet />;
};

// UserPage: Now only checks 'user' because 'userLoading' is already false here.
export const UserPage = () => {
  const { user } = useUser();

  // If user is null, redirect to sign-in. This happens instantly if userLoading is false.
  return user ? <Outlet context={user} /> : <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
};

// GuestPage: Now only checks 'user' because 'userLoading' is already false here.
export const GuestPage = () => {
  const { user } = useUser();

  // If user is not null, redirect to home. This happens instantly if userLoading is false.
  return !user ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />;
};
