"use client";

import { useMemo, useCallback, memo, useState, useEffect } from "react";
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
  /** Custom examples to display (optional, uses random selection if not provided) */
  examples?: ExampleComparison[];
  /** Number of examples to show (default: 5) */
  count?: number;
}

/**
 * Curated pool of 15 impactful comparisons
 * Selected for: emotional resonance, clear contrast, memorable numbers
 */
const EXAMPLE_POOL: ExampleComparison[] = [
  // Military hardware vs. people
  {
    budgetId: "program-f35",
    budgetName: "F-35 Program (Annual)",
    amount: 13_200_000_000,
    unitId: "teacher-salary",
  },
  {
    budgetId: "program-aircraft-carrier",
    budgetName: "One Aircraft Carrier",
    amount: 13_000_000_000,
    unitId: "va-healthcare-annual",
  },
  {
    budgetId: "program-columbia-submarine",
    budgetName: "One Nuclear Submarine",
    amount: 9_000_000_000,
    unitId: "childcare-preschool-year",
  },
  {
    budgetId: "program-overseas-bases",
    budgetName: "Overseas Military Bases",
    amount: 25_000_000_000,
    unitId: "affordable-housing-unit",
  },
  // Waste vs. essential services
  {
    budgetId: "prog-improper-payments",
    budgetName: "Improper Payments (Fraud/Errors)",
    amount: 236_000_000_000,
    unitId: "health-insurance-annual",
  },
  {
    budgetId: "prog-military-aid-israel",
    budgetName: "Military Aid to Israel",
    amount: 3_800_000_000,
    unitId: "pell-grant-max",
  },
  {
    budgetId: "program-military-bands",
    budgetName: "Military Bands",
    amount: 437_000_000,
    unitId: "firefighter-salary",
  },
  // Border/immigration vs. communities
  {
    budgetId: "prog-ice-detention",
    budgetName: "ICE Detention Operations",
    amount: 3_500_000_000,
    unitId: "head-start-slot",
  },
  {
    budgetId: "prog-border-wall",
    budgetName: "Border Wall Construction",
    amount: 1_200_000_000,
    unitId: "school-lunch-year",
  },
  // Government operations vs. everyday costs
  {
    budgetId: "prog-congressional-salaries",
    budgetName: "Congressional Salaries",
    amount: 100_000_000,
    unitId: "emt-salary",
  },
  {
    budgetId: "prog-air-force-one",
    budgetName: "Air Force One Fleet",
    amount: 200_000_000,
    unitId: "ambulance",
  },
  // Debt interest vs. what we could fund
  {
    budgetId: "dept-treasury",
    budgetName: "Daily Interest on Debt",
    amount: 2_900_000_000,
    unitId: "section-8-voucher-year",
  },
  // Foreign aid vs. domestic
  {
    budgetId: "prog-foreign-economic-aid",
    budgetName: "Foreign Economic Aid",
    amount: 30_000_000_000,
    unitId: "snap-benefits-person-annual",
  },
  // Veterans contrast
  {
    budgetId: "program-nuclear-weapons",
    budgetName: "Nuclear Weapons Maintenance",
    amount: 20_000_000_000,
    unitId: "veteran-disability-annual",
  },
  // Healthcare contrast
  {
    budgetId: "prog-fossil-fuel-subsidies",
    budgetName: "Fossil Fuel Subsidies",
    amount: 20_000_000_000,
    unitId: "therapy-year-weekly",
  },
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random selection of examples
 */
function getRandomExamples(count: number): ExampleComparison[] {
  return shuffleArray(EXAMPLE_POOL).slice(0, count);
}

/**
 * ExamplesSidebar
 *
 * A sidebar component displaying clickable example comparisons.
 * Shows a randomly selected set of examples from the curated pool.
 * Users can click examples to load them into the comparison builder.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Memoized calculations and callbacks
 * - Random selection happens once on mount
 */
export const ExamplesSidebar = memo<ExamplesSidebarProps>(
  function ExamplesSidebar({ onExampleClick, examples, count = 5 }) {
    // Select random examples on mount (client-side only)
    const [selectedExamples, setSelectedExamples] = useState<
      ExampleComparison[]
    >([]);

    useEffect(() => {
      // Use provided examples or get random selection
      setSelectedExamples(examples || getRandomExamples(count));
    }, [examples, count]);

    // Create unit lookup map
    const unitMap = useMemo(() => {
      const map = new Map<string, ComparisonUnit>();
      ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
      return map;
    }, []);

    // Generate example cards with calculated counts
    const exampleCards = useMemo(() => {
      return selectedExamples
        .map((example) => {
          const unit = unitMap.get(example.unitId);
          if (!unit) return null;
          const result = calculateComparison(example.amount, unit);
          return { ...example, unitName: unit.name, count: result.count };
        })
        .filter(Boolean);
    }, [selectedExamples, unitMap]);

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
