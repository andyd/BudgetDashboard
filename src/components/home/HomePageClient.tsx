"use client";

import { useState, useCallback } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  ComparisonBuilderModule,
  ExamplesSidebar,
  BudgetOverviewModule,
  StatsBar,
} from "@/components/modules";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";

interface HomePageClientProps {
  budgetData: BudgetHierarchy;
  budgetItems: BudgetItem[];
  currentFiscalYear: number;
  lastUpdated: Date;
}

/**
 * HomePageClient
 *
 * The main homepage component that composes the budget dashboard using PageLayout.
 * Uses a clean composition pattern with modular components:
 * - mainModule: ComparisonBuilderModule (primary interaction)
 * - sideContent: ExamplesSidebar (example comparisons)
 * - secondaryContent: BudgetOverviewModule + StatsBar
 */
export function HomePageClient({
  budgetData,
  budgetItems,
  currentFiscalYear,
  lastUpdated,
}: HomePageClientProps) {
  // Track selected comparison to sync between modules
  const [selectedBudgetItemId, setSelectedBudgetItemId] =
    useState<string>("program-f35");
  const [selectedUnitId, setSelectedUnitId] =
    useState<string>("teacher-salary");

  // Handle selection changes from ComparisonBuilderModule
  const handleSelectionChange = useCallback(
    (budgetItemId: string, unitId: string) => {
      setSelectedBudgetItemId(budgetItemId);
      setSelectedUnitId(unitId);
    },
    [],
  );

  // Handle example clicks from sidebar
  const handleExampleClick = useCallback((budgetId: string, unitId: string) => {
    setSelectedBudgetItemId(budgetId);
    setSelectedUnitId(unitId);
  }, []);

  return (
    <PageLayout
      mainModule={
        <ComparisonBuilderModule
          budgetItems={budgetItems}
          lastUpdated={lastUpdated}
          initialBudgetItemId={selectedBudgetItemId}
          initialUnitId={selectedUnitId}
          onSelectionChange={handleSelectionChange}
        />
      }
      sideContent={<ExamplesSidebar onExampleClick={handleExampleClick} />}
      secondaryContent={
        <>
          <BudgetOverviewModule budgetData={budgetData} />
          <StatsBar fiscalYear={currentFiscalYear} />
        </>
      }
    />
  );
}
