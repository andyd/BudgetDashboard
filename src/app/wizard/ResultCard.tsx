"use client";

import Link from "next/link";
import { memo } from "react";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Sparkles } from "lucide-react";

interface ResultCardProps {
  /** Budget item name to display */
  budgetItemName: string;
  /** Budget item amount in dollars */
  budgetItemAmount: number;
  /** Number of units the budget could buy */
  unitCount: number;
  /** Name of the unit (plural form) */
  unitName: string;
  /** Cost of a single unit */
  unitCost: number;
  /** Whether this is a top priority match */
  isTopPriority: boolean;
  /** Budget item ID for linking */
  budgetItemId: string;
  /** Unit ID for linking */
  unitId: string;
}

/**
 * ResultCard
 *
 * Displays a single personalized comparison result from the wizard.
 * Shows budget item and its equivalent in user-relevant units.
 * Links back to the home page with the comparison pre-selected.
 *
 * Design matches ExamplesSidebar cards:
 * - Dark theme (slate-800/900)
 * - Gradient highlight for count
 * - Compact currency format
 * - Hover effects
 * - Top priority badge
 */
export const ResultCard = memo<ResultCardProps>(function ResultCard({
  budgetItemName,
  budgetItemAmount,
  unitCount,
  unitName,
  unitCost: _unitCost,
  isTopPriority,
  budgetItemId,
  unitId,
}) {
  return (
    <Link
      href={`/?budget=${budgetItemId}&unit=${unitId}`}
      className="group relative block rounded-xl border border-transparent bg-slate-800/50 p-3 sm:p-4 transition-all hover:border-slate-700 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={`View detailed comparison: ${budgetItemName} budget of ${formatCurrency(budgetItemAmount, { compact: true })} could fund ${formatNumber(Math.floor(unitCount))} ${unitName}${isTopPriority ? ". Top priority match" : ""}`}
    >
      {/* Top Priority Badge */}
      {isTopPriority && (
        <div
          className="absolute right-2 sm:right-3 top-2 sm:top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30"
          aria-hidden="true"
        >
          <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
          <span className="hidden xs:inline">Top Match</span>
          <span className="inline xs:hidden">Top</span>
        </div>
      )}

      {/* Budget Item Name */}
      <p
        className="text-[11px] sm:text-xs font-medium text-slate-500 pr-16 sm:pr-20 leading-tight"
        aria-hidden="true"
      >
        {budgetItemName}
      </p>

      {/* Main Comparison Display */}
      <p
        className="mt-2 text-sm sm:text-base font-semibold text-white leading-tight"
        aria-hidden="true"
      >
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {formatNumber(Math.floor(unitCount))}
        </span>{" "}
        <span className="text-slate-300">{unitName}</span>
      </p>

      {/* Budget Amount */}
      <p
        className="mt-1 text-[10px] sm:text-xs text-slate-600"
        aria-hidden="true"
      >
        {formatCurrency(budgetItemAmount, { compact: true })}
      </p>

      {/* Hover indicator */}
      <div
        className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        <span>View comparison</span>
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
});
