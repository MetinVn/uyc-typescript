import { Skeleton } from "@/components/ui/skeleton";

export const ProfileLoader = () => {
  return (
    <div className="flex flex-col gap-1">
      {/* Welcome section loader */}
      <div className="flex flex-col items-center gap-1 p-1">
        <Skeleton className="h-[9px] w-[70px] rounded-md bg-[var(--gray-700)]" />
        <Skeleton className="h-[8px] w-[150px] rounded-md bg-[var(--gray-700)]" />
      </div>

      {/* Feature list loader */}
      <ul className="space-y-2 p-1">
        {[...Array(4)].map((_, index) => (
          <li key={index} className="flex items-center gap-2">
            <Skeleton className="h-[12px] w-[12px] rounded-full bg-[var(--gray-700)]" />
            <Skeleton className="h-[10px] w-[100px] rounded-md bg-[var(--gray-700)]" />
          </li>
        ))}
      </ul>

      {/* Action buttons loader */}
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-[35px] w-full rounded-md bg-[var(--gray-700)]" />
        <Skeleton className="h-[35px] w-full rounded-md bg-[var(--gray-700)]" />
      </div>
    </div>
  );
};
