"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { memo, useCallback } from "react";
import { BudgetPieChart } from "@/components/budget/BudgetPieChart";
import type { BudgetHierarchy } from "@/types/budget";

interface BudgetOverviewModuleProps {
  /** Budget hierarchy data to visualize in the pie chart */
  budgetData: BudgetHierarchy;
}

/**
 * BudgetOverviewModule
 *
 * A standalone module displaying the federal budget overview with an interactive
 * pie chart visualization. Clicking on pie chart items navigates to the detailed
 * budget breakdown for that item.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Memoized click handler callback
 *
 * @example
 * ```tsx
 * <BudgetOverviewModule budgetData={budgetData} />
 * ```
 */
export const BudgetOverviewModule = memo<BudgetOverviewModuleProps>(
  function BudgetOverviewModule({ budgetData }) {
    const router = useRouter();

    const handleItemClick = useCallback(
      (id: string) => {
        router.push(`/budget/${id}`);
      },
      [router],
    );

    return (
      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold text-white sm:mb-8 sm:text-2xl lg:text-3xl">
            Explore the Full Budget
          </h2>
          <div className="mx-auto max-w-3xl">
            {/* Responsive chart height: 300px on mobile, 400px on tablet+, 500px on desktop */}
            <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
              <BudgetPieChart
                data={budgetData}
                onItemClick={handleItemClick}
                onItemHover={() => {}}
                innerRadiusRatio={0.5} // Slightly larger inner radius for better mobile readability
                outerRadiusRatio={0.7} // Reduce outer radius to prevent label overflow on mobile
              />
            </div>
            <div className="mt-4 text-center sm:mt-6">
              <Link
                href="/budget"
                className="text-sm font-medium text-blue-400 hover:text-blue-300 sm:text-base"
              >
                View detailed breakdown &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
