import { Skeleton } from '@/components/ui/skeleton';

interface CatalogSkeletonGridProps {
  count?: number;
}

export function CatalogSkeletonGrid({ count = 9 }: CatalogSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`skel-${idx}`}
          className="border-brand-dark shadow-solid flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-white"
        >
          <Skeleton className="h-48 w-full rounded-none bg-stone-200" />
          <div className="space-y-3 p-5 sm:p-6">
            <Skeleton className="h-5 w-24 rounded-full bg-stone-200" />
            <Skeleton className="h-6 w-3/4 rounded-lg bg-stone-200" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-stone-200" />
            <Skeleton className="h-10 w-full rounded-md bg-stone-200" />
          </div>
          <div className="border-t border-black/10 p-5 sm:p-6">
            <Skeleton className="h-9 w-full rounded-full bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
