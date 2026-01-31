"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
 * @example
 * ```tsx
 * <BudgetOverviewModule budgetData={budgetData} />
 * ```
 */
export function BudgetOverviewModule({
  budgetData,
}: BudgetOverviewModuleProps) {
  const router = useRouter();

  const handleItemClick = (id: string) => {
    router.push(`/budget/${id}`);
  };

  return (
    <section className="border-t border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Explore the Full Budget
        </h2>
        <div className="mx-auto max-w-3xl">
          <div className="h-[400px]">
            <BudgetPieChart
              data={budgetData}
              onItemClick={handleItemClick}
              onItemHover={() => {}}
            />
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/budget"
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              View detailed breakdown &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
