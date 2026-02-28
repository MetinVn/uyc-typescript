import { lazy, Suspense } from "react";
import { HomePageLoader } from "./home-page-loader";

export const HomePage = () => {
  const LazyHomePageChunk = lazy(() => import("./home-chunk"));

  return (
    <>
      <Suspense fallback={<HomePageLoader />}>
        <LazyHomePageChunk />
      </Suspense>
    </>
  );
};

export default HomePage;
