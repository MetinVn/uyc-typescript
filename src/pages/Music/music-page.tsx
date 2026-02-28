import { lazy, Suspense } from "react";

export const MusicPage = () => {
  const LazyChunk = lazy(() => import("./music-chunk"));

  return (
    <>
      <Suspense
        fallback={<div className="min-h-screen text-center text-white bg-[var(--gray-900)]">Loading music page...</div>}
      >
        <LazyChunk />
      </Suspense>
    </>
  );
};

export default MusicPage;
