import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./app.tsx";
import { ROUTES } from "./routes/routes.ts";
import { UserProvider } from "./contexts/context-user.tsx";
import { lazy } from "react";
import { Notifications } from "./components/notifications.tsx";
import { GuestPage, UserPage } from "./components/access-guards.tsx";

const LazySignIn = lazy(() => import("./pages/signin-page.tsx"));
const LazySignUp = lazy(() => import("./pages/signup-page.tsx"));
const LazyResetPassword = lazy(() => import("./pages/reset-password-page.tsx"));
const LazyAccount = lazy(() => import("./pages/account-page.tsx"));
const LazyMusic = lazy(() => import("./pages/music-page.tsx"));

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <Router>
      <Notifications />
      <Routes>
        <Route index path={ROUTES.HOME} element={<App />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<LazyResetPassword />} />

        <Route element={<GuestPage />}>
          <Route path={ROUTES.AUTH.SIGN_IN} element={<LazySignIn />} />
          <Route path={ROUTES.AUTH.SIGN_UP} element={<LazySignUp />} />
        </Route>

        <Route element={<UserPage />}>
          <Route path={ROUTES.MUSIC} element={<LazyMusic />} />{" "}
          <Route path={ROUTES.AUTH.ACCOUNT} element={<LazyAccount />} />{" "}
        </Route>
      </Routes>
    </Router>
  </UserProvider>
);
