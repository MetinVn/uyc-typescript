import { lazy, Suspense, ComponentType } from "react";

type LazyComponent<T> = () => Promise<{ default: ComponentType<T> }>;

const withLazyLoad = <T extends object>(importFn: LazyComponent<T>, fallbackMessage: string = "Loading...") => {
  const LazyLoadedComponent = lazy(importFn);

  const WrapperComponent = (props: T) => {
    const PageLoadingFallback = () => (
      <div className="min-h-screen text-center text-white bg-[var(--gray-900)]">{fallbackMessage}</div>
    );

    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <LazyLoadedComponent {...props} />
      </Suspense>
    );
  };

  return WrapperComponent;
};

export default withLazyLoad;
