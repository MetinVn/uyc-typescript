import { lazy, Suspense } from "react";

export const AccountPage = () => {
  const LazyAccountPageChunk = lazy(() => import("./account-chunk"));
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen text-center text-white bg-[var(--gray-900)]">
            Loading account page...
          </div>
        }
      >
        <LazyAccountPageChunk />
      </Suspense>
    </>
  );
};

export default AccountPage;
