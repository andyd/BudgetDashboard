import {
  BudgetTreemapSkeleton,
  ComparisonCardSkeleton,
  DrillDownSkeleton,
} from '@/components';

/**
 * Demo page showing all loading skeleton components
 * Visit /skeleton-demo to see these in action
 */
export default function SkeletonDemoPage() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Skeleton Components Demo</h1>
        <p className="text-muted-foreground">
          Visual preview of all loading skeleton states
        </p>
      </div>

      {/* BudgetTreemapSkeleton */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">BudgetTreemapSkeleton</h2>
        <div className="border rounded-lg p-4 bg-background">
          <BudgetTreemapSkeleton />
        </div>
      </section>

      {/* ComparisonCardSkeleton */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ComparisonCardSkeleton</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ComparisonCardSkeleton />
          <ComparisonCardSkeleton />
          <ComparisonCardSkeleton />
        </div>
      </section>

      {/* DrillDownSkeleton */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">DrillDownSkeleton</h2>
        <div className="border rounded-lg bg-background">
          <DrillDownSkeleton />
        </div>
      </section>
    </div>
  );
}
