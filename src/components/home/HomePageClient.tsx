"use client";

import { useState, useCallback, memo, lazy, Suspense } from "react";
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
 * SecondaryContent component - Memoized to prevent unnecessary re-renders
 * when parent state changes
 */
const SecondaryContent = memo<{
  budgetData: BudgetHierarchy;
  fiscalYear: number;
}>(function SecondaryContent({ budgetData, fiscalYear }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-700/50 bg-slate-900/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500" />
        </div>
      }
    >
      <BudgetOverviewModule budgetData={budgetData} />
      <StatsBar fiscalYear={fiscalYear} />
    </Suspense>
  );
});

/**
 * HomePageClient
 *
 * The main homepage component that composes the budget dashboard using PageLayout.
 * Uses a clean composition pattern with modular components:
 * - mainModule: ComparisonBuilderModule (primary interaction)
 * - sideContent: ExamplesSidebar (example comparisons)
 * - secondaryContent: BudgetOverviewModule + StatsBar (lazy loaded)
 *
 * Performance optimizations:
 * - Lazy loads below-the-fold components (BudgetOverviewModule, StatsBar)
 * - Memoizes callbacks and secondary content to prevent unnecessary re-renders
 * - Uses Suspense with loading fallback for better UX during code splitting
 */
export const HomePageClient = memo<HomePageClientProps>(
  function HomePageClient({
    budgetData,
    budgetItems,
    currentFiscalYear,
    lastUpdated,
    initialBudgetItemId,
    initialUnitId,
  }) {
    // Track selected comparison to sync between modules
    // Use URL params if provided, otherwise fall back to defaults
    const [selectedBudgetItemId, setSelectedBudgetItemId] = useState<string>(
      initialBudgetItemId || "program-f35",
    );
    const [selectedUnitId, setSelectedUnitId] = useState<string>(
      initialUnitId || "teacher-salary",
    );

    // Handle selection changes from ComparisonBuilderModule
    // Memoized to prevent recreation on every render
    const handleSelectionChange = useCallback(
      (budgetItemId: string, unitId: string) => {
        setSelectedBudgetItemId(budgetItemId);
        setSelectedUnitId(unitId);
      },
      [],
    );

    // Handle example clicks from sidebar
    // Memoized to prevent recreation on every render
    const handleExampleClick = useCallback(
      (budgetId: string, unitId: string) => {
        setSelectedBudgetItemId(budgetId);
        setSelectedUnitId(unitId);
      },
      [],
    );

    return (
      <PageLayout
        headerBanner={
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              How We Spend. How We Could Spend.
            </h1>
            <p className="mt-2 text-base text-slate-300 sm:text-lg md:text-xl lg:text-2xl">
              What Your Tax Dollars Buy. And What They Could.
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm">
              Rethinking U.S. Federal Spending
            </p>
          </div>
        }
        mainModule={
          <ComparisonBuilderModule
            budgetItems={budgetItems}
            initialBudgetItemId={selectedBudgetItemId}
            initialUnitId={selectedUnitId}
            onSelectionChange={handleSelectionChange}
          />
        }
        sideContent={<ExamplesSidebar onExampleClick={handleExampleClick} />}
        secondaryContent={
          <SecondaryContent
            budgetData={budgetData}
            fiscalYear={currentFiscalYear}
          />
        }
      />
    );
  },
);
