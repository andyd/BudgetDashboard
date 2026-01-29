import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ComparisonCardSkeletonProps {
  className?: string;
}

export function ComparisonCardSkeleton({ className }: ComparisonCardSkeletonProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main comparison value */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full max-w-md" />
        </div>

        {/* Visual representation (bar or icon area) */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
          </div>
        </div>

        {/* Source/metadata */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-40" />
        </div>
      </CardContent>
    </Card>
  );
}
