import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DrillDownSkeletonProps {
  className?: string;
}

export function DrillDownSkeleton({ className }: DrillDownSkeletonProps) {
  return (
    <div className={cn('w-full min-h-screen p-6 space-y-6', className)}>
      {/* Breadcrumb navigation skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Page title and stats */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />

        {/* Key stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      {/* Main content area - treemap */}
      <div className="rounded-xl border shadow-sm p-6">
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>

      {/* Spotlight/Info panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Sub-items table/list */}
      <div className="rounded-xl border shadow-sm p-6 space-y-4">
        <Skeleton className="h-6 w-40 mb-4" />

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b">
          <Skeleton className="col-span-6 h-4 w-20" />
          <Skeleton className="col-span-3 h-4 w-16" />
          <Skeleton className="col-span-3 h-4 w-24" />
        </div>

        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 py-3">
            <Skeleton className="col-span-6 h-5 w-full" />
            <Skeleton className="col-span-3 h-5 w-24" />
            <Skeleton className="col-span-3 h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
