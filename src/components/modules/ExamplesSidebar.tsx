"use client";

import { useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { calculateComparison } from "@/lib/comparison-engine";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { ArrowRight } from "lucide-react";
import type { ComparisonUnit } from "@/types/comparison";

interface ExampleComparison {
  budgetId: string;
  budgetName: string;
  amount: number;
  unitId: string;
}

interface ExamplesSidebarProps {
  /** Callback when an example is clicked */
  onExampleClick?: (budgetId: string, unitId: string) => void;
  /** Custom examples to display (optional, uses defaults if not provided) */
  examples?: ExampleComparison[];
}

// Default example comparisons
const DEFAULT_EXAMPLES: ExampleComparison[] = [
  {
    budgetId: "prog-ice-detention",
    budgetName: "ICE Detention",
    amount: 3_500_000_000,
    unitId: "pell-grant-max",
  },
  {
    budgetId: "prog-nasa",
    budgetName: "NASA Budget",
    amount: 25_000_000_000,
    unitId: "affordable-housing-unit",
  },
  {
    budgetId: "event-trump-inaugural-balls",
    budgetName: "Trump Inaugural",
    amount: 25_000_000,
    unitId: "health-insurance-annual",
  },
  {
    budgetId: "prog-border-wall",
    budgetName: "Border Wall",
    amount: 1_200_000_000,
    unitId: "year-of-rent",
  },
  {
    budgetId: "program-nuclear-weapons",
    budgetName: "Nuclear Weapons",
    amount: 20_000_000_000,
    unitId: "va-healthcare-annual",
  },
];

/**
 * ExamplesSidebar
 *
 * A sidebar component displaying clickable example comparisons.
 * Users can click examples to load them into the comparison builder.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Memoized calculations and callbacks
 */
export const ExamplesSidebar = memo<ExamplesSidebarProps>(
  function ExamplesSidebar({ onExampleClick, examples = DEFAULT_EXAMPLES }) {
    // Create unit lookup map
    const unitMap = useMemo(() => {
      const map = new Map<string, ComparisonUnit>();
      ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
      return map;
    }, []);

    // Generate example cards with calculated counts
    const exampleCards = useMemo(() => {
      return examples
        .map((example) => {
          const unit = unitMap.get(example.unitId);
          if (!unit) return null;
          const result = calculateComparison(example.amount, unit);
          return { ...example, unitName: unit.name, count: result.count };
        })
        .filter(Boolean);
    }, [examples, unitMap]);

    const handleExampleClick = useCallback(
      (budgetId: string, unitId: string) => {
        onExampleClick?.(budgetId, unitId);
      },
      [onExampleClick],
    );

    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 lg:sticky lg:top-24 lg:p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 lg:mb-4">
          Try These
        </h3>

        {/* Mobile: Horizontal scroll */}
        <div className="lg:hidden">
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {exampleCards.map(
              (card) =>
                card && (
                  <button
                    key={`${card.budgetId}-${card.unitId}`}
                    onClick={() =>
                      handleExampleClick(card.budgetId, card.unitId)
                    }
                    className="min-w-[280px] flex-shrink-0 rounded-xl border border-transparent bg-slate-800/50 p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-800 active:scale-[0.98]"
                  >
                    <p className="text-xs font-medium text-slate-500">
                      {card.budgetName}
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {formatNumber(Math.floor(card.count))}
                      </span>{" "}
                      <span className="text-sm text-slate-300">
                        {card.unitName}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {formatCurrency(card.amount, { compact: true })}
                    </p>
                  </button>
                ),
            )}
          </div>
        </div>

        {/* Desktop: Vertical stack */}
        <div className="hidden space-y-2 lg:block">
          {exampleCards.map(
            (card) =>
              card && (
                <button
                  key={`${card.budgetId}-${card.unitId}`}
                  onClick={() => handleExampleClick(card.budgetId, card.unitId)}
                  className="w-full rounded-xl border border-transparent bg-slate-800/50 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-800"
                >
                  <p className="text-xs font-medium text-slate-500">
                    {card.budgetName}
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {formatNumber(Math.floor(card.count))}
                    </span>{" "}
                    <span className="text-slate-300">{card.unitName}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {formatCurrency(card.amount, { compact: true })}
                  </p>
                </button>
              ),
          )}
        </div>

        <Link
          href="/compare"
          className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 lg:mt-5"
        >
          Browse all comparisons
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  },
);
