import { lazy, Suspense } from "react";

export const SignInPage = () => {
  const LazyChunk = lazy(() => import("./signin-page-chunk"));

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen text-center text-white bg-[var(--gray-900)]">Loading sign in page...</div>
        }
      >
        <LazyChunk />
      </Suspense>
    </>
  );
};

export default SignInPage;
