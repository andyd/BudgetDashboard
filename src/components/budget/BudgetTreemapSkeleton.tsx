import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BudgetTreemapSkeletonProps {
  className?: string;
}

export function BudgetTreemapSkeleton({ className }: BudgetTreemapSkeletonProps) {
  return (
    <div className={cn('w-full h-full min-h-[400px] p-4', className)}>
      {/* Main container matching treemap aspect ratio */}
      <div className="grid grid-cols-12 grid-rows-8 gap-2 h-full">
        {/* Large top-left box - simulating largest budget item */}
        <Skeleton className="col-span-5 row-span-4 rounded-lg" />

        {/* Medium top-right box */}
        <Skeleton className="col-span-4 row-span-3 rounded-lg" />

        {/* Small top-right boxes */}
        <Skeleton className="col-span-3 row-span-2 rounded-lg" />
        <Skeleton className="col-span-3 row-span-1 rounded-lg" />

        {/* Second row - medium boxes */}
        <Skeleton className="col-span-3 row-span-2 rounded-lg" />
        <Skeleton className="col-span-4 row-span-2 rounded-lg" />

        {/* Bottom left medium box */}
        <Skeleton className="col-span-5 row-span-4 rounded-lg" />

        {/* Bottom middle boxes */}
        <Skeleton className="col-span-3 row-span-2 rounded-lg" />
        <Skeleton className="col-span-4 row-span-2 rounded-lg" />

        {/* Bottom small boxes */}
        <Skeleton className="col-span-3 row-span-2 rounded-lg" />
        <Skeleton className="col-span-2 row-span-2 rounded-lg" />
        <Skeleton className="col-span-2 row-span-2 rounded-lg" />
      </div>
    </div>
  );
}
