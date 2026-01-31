/**
 * ModuleSkeletons.tsx
 *
 * Loading skeleton components for all module components.
 * Provides consistent loading states across the application.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// ============================================================================
// StatsBarSkeleton
// ============================================================================

export function StatsBarSkeleton() {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="mx-auto h-10 w-32 bg-slate-800" />
              <Skeleton className="mx-auto h-4 w-40 bg-slate-900" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ComparisonBuilderModuleSkeleton
// ============================================================================

export function ComparisonBuilderModuleSkeleton() {
  return (
    <div>
      <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 p-6 shadow-2xl sm:p-8">
        {/* Tagline */}
        <div className="mb-6 flex justify-center">
          <Skeleton className="h-4 w-72 bg-slate-800" />
        </div>

        {/* Horizontal Layout: Left = Right */}
        <div className="flex flex-row items-stretch gap-4">
          {/* LEFT: Government Expense */}
          <div className="flex flex-1 flex-col rounded-2xl border border-blue-500/30 bg-slate-800/50 p-5">
            <Skeleton className="mb-3 h-3 w-32 bg-slate-700" />
            <Skeleton className="h-12 w-full rounded-xl bg-slate-900" />

            {/* Expense Amount */}
            <div className="mt-auto flex flex-col items-center justify-center pt-6">
              <Skeleton className="h-10 w-28 bg-slate-700" />
              <Skeleton className="mt-2 h-3 w-24 bg-slate-800" />
            </div>
          </div>

          {/* CENTER: Equals Sign */}
          <div className="flex shrink-0 items-center justify-center">
            <Skeleton className="h-16 w-16 rounded-full bg-slate-800" />
          </div>

          {/* RIGHT: Compare To */}
          <div className="flex flex-1 flex-col rounded-2xl border border-emerald-500/30 bg-slate-800/50 p-5">
            <Skeleton className="mb-3 h-3 w-24 bg-slate-700" />
            <Skeleton className="h-12 w-full rounded-xl bg-slate-900" />

            {/* Result */}
            <div className="mt-auto flex flex-col items-center justify-center pt-6">
              <Skeleton className="h-10 w-24 bg-slate-700" />
              <Skeleton className="mt-2 h-4 w-32 bg-slate-800" />
              <Skeleton className="mt-1 h-3 w-20 bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Skeleton className="h-10 w-32 rounded-md bg-slate-800" />
          <Skeleton className="h-10 w-32 rounded-md bg-slate-800" />
        </div>
      </div>

      {/* Data Source */}
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-5 w-48 bg-slate-900" />
      </div>
    </div>
  );
}

// ============================================================================
// BudgetOverviewModuleSkeleton
// ============================================================================

export function BudgetOverviewModuleSkeleton() {
  return (
    <section className="border-t border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-8 w-64 bg-slate-800" />
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="h-[400px] rounded-xl bg-slate-800/30 p-8">
            {/* Circular pie chart skeleton */}
            <div className="flex h-full items-center justify-center">
              <div className="relative">
                <Skeleton className="h-64 w-64 rounded-full bg-slate-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-32 w-32 rounded-full bg-slate-900/50" />
                </div>
              </div>
              {/* Legend */}
              <div className="ml-12 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded bg-slate-700" />
                    <Skeleton className="h-4 w-32 bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-5 w-40 bg-slate-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ExamplesSidebarSkeleton
// ============================================================================

export function ExamplesSidebarSkeleton() {
  return (
    <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <Skeleton className="mb-4 h-3 w-20 bg-slate-800" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-xl border border-transparent bg-slate-800/50 p-4"
          >
            <Skeleton className="h-3 w-24 bg-slate-700" />
            <Skeleton className="mt-2 h-5 w-full bg-slate-700" />
            <Skeleton className="mt-2 h-3 w-16 bg-slate-800" />
          </Card>
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        <Skeleton className="h-5 w-40 bg-slate-800" />
      </div>
    </div>
  );
}
