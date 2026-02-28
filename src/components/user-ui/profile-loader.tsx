import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoader = () => {
  return (
    <div className="flex flex-col gap-2 min-w-35 w-full p-4 rounded-xl z-20 bg-[var(--gray-800)]">
      <Skeleton className="h-[36px] w-full rounded-md bg-[var(--gray-700)]" />
      <Skeleton className="h-[36px] w-full rounded-md bg-[var(--gray-700)]" />
      <Skeleton className="h-[36px] w-full rounded-md bg-[var(--gray-700)] mt-2" />
    </div>
  );
};
