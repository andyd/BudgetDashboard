"use client";

import { useState, useCallback, memo, lazy, Suspense, useRef } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ComparisonBuilderModule, ExamplesSidebar } from "@/components/modules";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";

// Lazy load below-the-fold components for better initial load performance
const BudgetOverviewModule = lazy(() =>
  import("@/components/modules").then((mod) => ({
    default: mod.BudgetOverviewModule,
  })),
);

const StatsBar = lazy(() =>
  import("@/components/modules").then((mod) => ({
    default: mod.StatsBar,
  })),
);

interface HomePageClientProps {
  budgetData: BudgetHierarchy;
  budgetItems: BudgetItem[];
  currentFiscalYear: number;
  lastUpdated: Date;
  /** Initial budget item ID from URL params */
  initialBudgetItemId?: string;
  /** Initial unit ID from URL params */
  initialUnitId?: string;
}

/**
 * Mapping from department IDs to featured budget items and comparison units
 * When hovering a department, show a relevant comparison
 */
const DEPARTMENT_TO_COMPARISON: Record<
  string,
  { budgetItemId: string; unitId: string }
> = {
  "dept-defense": { budgetItemId: "program-f35", unitId: "teacher-salary" },
  "dept-hhs": {
    budgetItemId: "prog-medicare",
    unitId: "health-insurance-annual",
  },
  "dept-treasury": {
    budgetItemId: "dept-treasury",
    unitId: "section-8-voucher-year",
  },
  "dept-ssa": { budgetItemId: "prog-social-security", unitId: "median-income" },
  "dept-va": {
    budgetItemId: "prog-va-healthcare",
    unitId: "va-healthcare-annual",
  },
  "dept-education": {
    budgetItemId: "prog-pell-grants",
    unitId: "pell-grant-max",
  },
  "dept-dhs": {
    budgetItemId: "prog-ice-detention",
    unitId: "head-start-slot",
  },
  "dept-state": {
    budgetItemId: "prog-foreign-economic-aid",
    unitId: "snap-benefits-person-annual",
  },
  "dept-dot": {
    budgetItemId: "prog-highway-funding",
    unitId: "mile-of-broadband",
  },
  "dept-energy": {
    budgetItemId: "program-nuclear-weapons",
    unitId: "solar-panel-install",
  },
  "dept-usda": {
    budgetItemId: "prog-snap",
    unitId: "school-lunch-year",
  },
  "dept-justice": {
    budgetItemId: "prog-fbi",
    unitId: "police-officer-salary",
  },
  "dept-interior": {
    budgetItemId: "prog-national-parks",
    unitId: "park-ranger-salary",
  },
  "dept-labor": {
    budgetItemId: "prog-unemployment-insurance",
    unitId: "unemployment-weekly",
  },
  "dept-nasa": {
    budgetItemId: "prog-nasa",
    unitId: "affordable-housing-unit",
  },
};

const DEFAULT_BUDGET_ITEM = "program-f35";
const DEFAULT_UNIT = "teacher-salary";

/**
 * HomePageClient
 *
 * The main homepage component that composes the budget dashboard using PageLayout.
 * Features:
 * - Hover on pie chart segment updates comparison builder above
 * - Click examples in sidebar to load comparisons
 * - Lazy loads below-the-fold components
 */
export const HomePageClient = memo<HomePageClientProps>(
  function HomePageClient({
    budgetData,
    budgetItems,
    currentFiscalYear,
    initialBudgetItemId,
    initialUnitId,
  }) {
    // Track selected comparison
    const [selectedBudgetItemId, setSelectedBudgetItemId] = useState<string>(
      initialBudgetItemId || DEFAULT_BUDGET_ITEM,
    );
    const [selectedUnitId, setSelectedUnitId] = useState<string>(
      initialUnitId || DEFAULT_UNIT,
    );

    // Track hover state
    const [isHovering, setIsHovering] = useState(false);

    // Store base selection in a ref to avoid stale closure issues
    const baseSelectionRef = useRef<{ budgetItemId: string; unitId: string }>({
      budgetItemId: initialBudgetItemId || DEFAULT_BUDGET_ITEM,
      unitId: initialUnitId || DEFAULT_UNIT,
    });

    // Handle selection changes from ComparisonBuilderModule
    const handleSelectionChange = useCallback(
      (budgetItemId: string, unitId: string) => {
        setSelectedBudgetItemId(budgetItemId);
        setSelectedUnitId(unitId);
        baseSelectionRef.current = { budgetItemId, unitId };
      },
      [],
    );

    // Handle example clicks from sidebar
    const handleExampleClick = useCallback(
      (budgetId: string, unitId: string) => {
        setSelectedBudgetItemId(budgetId);
        setSelectedUnitId(unitId);
        baseSelectionRef.current = { budgetItemId: budgetId, unitId };
      },
      [],
    );

    // Handle pie chart hover - update comparison to show relevant item
    const handlePieChartHover = useCallback(
      (departmentId: string | null) => {
        if (departmentId) {
          // Look up the comparison for this department
          const comparison = DEPARTMENT_TO_COMPARISON[departmentId];
          if (comparison) {
            setSelectedBudgetItemId(comparison.budgetItemId);
            setSelectedUnitId(comparison.unitId);
            setIsHovering(true);
          }
        } else {
          // Restore base selection when hover ends
          setSelectedBudgetItemId(baseSelectionRef.current.budgetItemId);
          setSelectedUnitId(baseSelectionRef.current.unitId);
          setIsHovering(false);
        }
      },
      [], // No dependencies - uses ref for base selection
    );

    return (
      <PageLayout
        headerBanner={
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              How Government Spends Our Money, And What Else We Could Do With It
            </h1>
            <p className="mt-3 text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm">
              Rethinking U.S. Federal Spending
            </p>
          </div>
        }
        mainModule={
          <div className="relative">
            {isHovering && (
              <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                Previewing department comparison
              </div>
            )}
            <ComparisonBuilderModule
              budgetItems={budgetItems}
              initialBudgetItemId={selectedBudgetItemId}
              initialUnitId={selectedUnitId}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        }
        sideContent={<ExamplesSidebar onExampleClick={handleExampleClick} />}
        secondaryContent={
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-700/50 bg-slate-900/50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500" />
              </div>
            }
          >
            <BudgetOverviewModule
              budgetData={budgetData}
              onItemHover={handlePieChartHover}
            />
            <StatsBar fiscalYear={currentFiscalYear} />
          </Suspense>
        }
      />
    );
  },
);
