import { Skeleton } from "@/components/ui/skeleton";

export const HomePageProfileLoader = () => {
  return (
    <div className="flex items-center gap-4 mr-20 w-[200px] p-2 rounded-xl bg-[var(--gray-900)]">
      <Skeleton className="h-13 w-13 rounded-full" />
      <div className="flex flex-col gap-3 ">
        <Skeleton className="h-2 w-[100px]" />
        <Skeleton className="h-2 w-[110px]" />
      </div>
    </div>
  );
};
