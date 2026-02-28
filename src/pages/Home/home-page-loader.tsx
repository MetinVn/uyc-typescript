import { Skeleton } from "@/components/ui/skeleton";

export const HomePageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[var(--gray-900)] overflow-hidden">
      {/* Header Section */}
      <div className="w-full flex items-center justify-end min-h-20 p-1 bg-[var(--gray-800)]">
        {/* Profile Skeleton on the right */}
        <Skeleton className="w-[200px] h-14 rounded-xl mr-20" />
      </div>

      {/* Main Content Section */}
      <div className="flex flex-grow flex-col justify-center items-center h-full w-full px-5 sm:px-0">
        <div className="flex flex-col p-1 sm:flex-row items-start sm:items-center w-full px-1 sm:px-3 sm:py-2 gap-2 max-w-[570px] bg-[var(--gray-800)] rounded-md">
          {/* Input and Buttons Skeleton */}
          <Skeleton className="h-10 w-full sm:w-[360px] rounded-md" />

          <div className="w-full sm:w-auto flex items-center gap-2">
            {/* Small Select container */}
            <Skeleton className="h-10 w-16 sm:w-22 rounded-md" />
            {/* Animating Button */}
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
