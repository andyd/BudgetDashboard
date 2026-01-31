import { memo } from "react";

interface StatsBarProps {
  totalBudget?: string;
  budgetItemsCount?: string;
  comparisonUnitsCount?: string;
  fiscalYear?: number;
}

/**
 * StatsBar
 *
 * A simple stats display component showing key metrics.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 */
export const StatsBar = memo<StatsBarProps>(function StatsBar({
  totalBudget = "$7.0T",
  budgetItemsCount = "100+",
  comparisonUnitsCount = "75+",
  fiscalYear = 2025,
}) {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-8">
          <div className="space-y-1">
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {totalBudget}
            </p>
            <p className="text-xs text-slate-500 sm:text-sm">
              Total FY{fiscalYear} Budget
            </p>
          </div>
          <div className="space-y-1">
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {budgetItemsCount}
            </p>
            <p className="text-xs text-slate-500 sm:text-sm">Budget Items</p>
          </div>
          <div className="space-y-1">
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {comparisonUnitsCount}
            </p>
            <p className="text-xs text-slate-500 sm:text-sm">
              Comparison Units
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
