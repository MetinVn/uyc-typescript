import { lazy, Suspense } from "react";

export const SignUpPage = () => {
  const LazyChunk = lazy(() => import("./signup-page-chunk"));

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen text-center text-white bg-[var(--gray-900)]">Loading sign up page...</div>
        }
      >
        <LazyChunk />
      </Suspense>
    </>
  );
};

export default SignUpPage;
