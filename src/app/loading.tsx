import { Skeleton } from "@/components/ui/skeleton";
import {
  ComparisonBuilderModuleSkeleton,
  ExamplesSidebarSkeleton,
  BudgetOverviewModuleSkeleton,
  StatsBarSkeleton,
} from "@/components/modules";

/**
 * Loading state for the homepage
 *
 * Uses module-specific skeletons for consistent loading experience
 * that matches the actual rendered components.
 */
export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-2 h-10 w-80 bg-slate-800 sm:w-96" />
            <Skeleton className="mx-auto h-5 w-64 bg-slate-900" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Main Comparison Module - 8 cols */}
            <div className="lg:col-span-8">
              <ComparisonBuilderModuleSkeleton />
            </div>

            {/* Sidebar - 4 cols */}
            <div className="lg:col-span-4">
              <ExamplesSidebarSkeleton />
            </div>
          </div>
        </div>
      </section>

      {/* Budget Overview */}
      <BudgetOverviewModuleSkeleton />

      {/* Stats Section */}
      <StatsBarSkeleton />
    </div>
  );
}
