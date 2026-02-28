import { lazy, Suspense } from "react";

export const PasswordResetPage = () => {
  const LazyChunk = lazy(() => import("./reset-password-chunk"));

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen text-center text-white bg-[var(--gray-900)]">
            Loading password reset page...
          </div>
        }
      >
        <LazyChunk />
      </Suspense>
    </>
  );
};

export default PasswordResetPage;
