import { Skeleton } from "@/components/ui/skeleton";

export const DropdownLoader = () => {
  return (
    <>
      <div className="flex flex-col justify-center gap-1.5 h-[72px]">
        {/* Skeleton for the first dropdown item */}
        <div className="px-4 py-2 w-full flex items-center gap-2">
          <Skeleton className="h-[12px] w-4 bg-[var(--gray-500)]" />
          <Skeleton className="h-[12px] w-12 bg-[var(--gray-500)]" />
        </div>

        {/* Skeleton for the second dropdown item */}
        <div className="px-4 py-2 w-full flex items-center gap-2">
          <Skeleton className="h-[12px] w-4 bg-[var(--gray-500)]" />
          <Skeleton className="h-[12px] w-12 bg-[var(--gray-500)]" />
        </div>
      </div>
    </>
  );
};
