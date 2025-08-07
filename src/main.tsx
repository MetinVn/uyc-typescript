import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ROUTES } from "./routes/routes.ts";
import { Notifications } from "./components/notifications.tsx";
import { UserProvider } from "./contexts/context-user.tsx";
import { AuthInitializer, GuestPages, UserPages } from "./components/access-guards.tsx";

const HomePage = lazy(() => import("./pages/Home/home-page.tsx"));
const RouteNotFoundPage = lazy(() => import("./pages/NotFound/route-not-found.tsx"));
const AccountPage = lazy(() => import("./pages/Account/account-page.tsx"));
const MusicPage = lazy(() => import("./pages/Music/music-chunk.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword/reset-password-page.tsx"));
const SignInPage = lazy(() => import("./pages/SignIn/signin-page.tsx"));
const SignUpPage = lazy(() => import("./pages/SignUp/signup-page.tsx"));

createRoot(document.getElementById("root")!).render(
  <Router>
    <Notifications />
    <UserProvider>
      <Routes>
        <Route index path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ROUTE_NOT_FOUND} element={<RouteNotFoundPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ResetPasswordPage />} />
        <Route element={<AuthInitializer />}>
          <Route element={<GuestPages />}>
            <Route path={ROUTES.AUTH.SIGN_IN} element={<SignInPage />} />
            <Route path={ROUTES.AUTH.SIGN_UP} element={<SignUpPage />} />
          </Route>
          <Route element={<UserPages />}>
            <Route path={ROUTES.MUSIC} element={<MusicPage />} />
            <Route path={ROUTES.AUTH.ACCOUNT} element={<AccountPage />} />
          </Route>
        </Route>
      </Routes>
    </UserProvider>
  </Router>
);
