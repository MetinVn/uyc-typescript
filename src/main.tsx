import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { ROUTES } from "./routes/routes.ts";
import { UserProvider } from "./contexts/context-user.tsx";
import { lazy, Suspense } from "react";
import { Notifications } from "./components/notifications.tsx";
import { GuestPage, UserPage } from "./components/access-guards.tsx";

const LazyApp = lazy(() => import("./app.tsx"));
const LazySignIn = lazy(() => import("./pages/signin-page.tsx"));
const LazySignUp = lazy(() => import("./pages/signup-page.tsx"));
const LazyResetPassword = lazy(() => import("./pages/reset-password-page.tsx"));
const LazyAccount = lazy(() => import("./pages/account-page.tsx"));
const LazyMusic = lazy(() => import("./pages/music-page.tsx"));
const LazyRouteNotFound = lazy(() => import("./pages/route-not-found.tsx"));

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <Router>
      <Notifications />
      <Suspense fallback={<div className="min-h-screen text-center text-black">Loading...</div>}>
        <Routes>
          <Route index path={ROUTES.HOME} element={<LazyApp />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<LazyResetPassword />} />
          <Route path={ROUTES.ROUTE_NOT_FOUND} element={<LazyRouteNotFound />} />

          <Route element={<GuestPage />}>
            <Route path={ROUTES.AUTH.SIGN_IN} element={<LazySignIn />} />
            <Route path={ROUTES.AUTH.SIGN_UP} element={<LazySignUp />} />
          </Route>

          <Route element={<UserPage />}>
            <Route path={ROUTES.MUSIC} element={<LazyMusic />} />
            <Route path={ROUTES.AUTH.ACCOUNT} element={<LazyAccount />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  </UserProvider>
);
