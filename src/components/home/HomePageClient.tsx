"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BudgetPieChart } from "@/components/budget/BudgetPieChart";
import { DataFreshnessIndicator } from "@/components/budget/DataFreshnessIndicator";
import { calculateComparison } from "@/lib/comparison-engine";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Share2, Link2, ArrowRight } from "lucide-react";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";
import type { ComparisonUnit } from "@/types/comparison";

interface HomePageClientProps {
  budgetData: BudgetHierarchy;
  budgetItems: BudgetItem[];
  currentFiscalYear: number;
  lastUpdated: Date;
}

// Default preset comparison
const DEFAULT_BUDGET_ITEM = {
  id: "f35-program",
  name: "F-35 Fighter Program",
  amount: 13_200_000_000,
};

const DEFAULT_UNIT_ID = "teacher-salary";

// Example comparisons for the sidebar
const SIDEBAR_EXAMPLES = [
  {
    budgetId: "ice-detention",
    budgetName: "ICE Detention",
    amount: 3_500_000_000,
    unitId: "pell-grant-max",
  },
  {
    budgetId: "nasa",
    budgetName: "NASA Budget",
    amount: 25_000_000_000,
    unitId: "affordable-housing-unit",
  },
  {
    budgetId: "trump-inaugural",
    budgetName: "Trump Inaugural",
    amount: 25_000_000,
    unitId: "health-insurance-annual",
  },
  {
    budgetId: "border-wall",
    budgetName: "Border Wall",
    amount: 1_200_000_000,
    unitId: "year-of-rent",
  },
  {
    budgetId: "nuclear-weapons",
    budgetName: "Nuclear Weapons",
    amount: 37_700_000_000,
    unitId: "va-healthcare-annual",
  },
];

export function HomePageClient({
  budgetData,
  budgetItems,
  currentFiscalYear,
  lastUpdated,
}: HomePageClientProps) {
  const router = useRouter();

  // Initialize with default preset
  const [selectedBudgetItemId, setSelectedBudgetItemId] = useState<string>(
    DEFAULT_BUDGET_ITEM.id,
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string>(DEFAULT_UNIT_ID);

  // Create unit lookup map
  const unitMap = useMemo(() => {
    const map = new Map<string, ComparisonUnit>();
    ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
    return map;
  }, []);

  // Get selected items
  const selectedBudgetItem = budgetItems.find(
    (item) => item.id === selectedBudgetItemId,
  ) || {
    id: DEFAULT_BUDGET_ITEM.id,
    name: DEFAULT_BUDGET_ITEM.name,
    amount: DEFAULT_BUDGET_ITEM.amount,
  };
  const selectedUnit = unitMap.get(selectedUnitId);

  // Calculate comparison
  const comparison = selectedUnit
    ? calculateComparison(selectedBudgetItem.amount, selectedUnit)
    : null;

  // Generate sidebar examples
  const sidebarCards = useMemo(() => {
    return SIDEBAR_EXAMPLES.map((example) => {
      const unit = unitMap.get(example.unitId);
      if (!unit) return null;
      const result = calculateComparison(example.amount, unit);
      return { ...example, unitName: unit.name, count: result.count };
    }).filter(Boolean);
  }, [unitMap]);

  // Group units by category
  const unitsByCategory = useMemo(() => {
    return ALL_COMPARISON_UNITS.reduce(
      (acc, unit) => {
        const category = unit.category || "other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(unit);
        return acc;
      },
      {} as Record<string, ComparisonUnit[]>,
    );
  }, []);

  const handleShare = () => {
    const url = `${window.location.origin}/compare/${selectedBudgetItemId}/${selectedUnitId}`;
    navigator.clipboard.writeText(url);
  };

  const handleExampleClick = (budgetId: string, unitId: string) => {
    setSelectedBudgetItemId(budgetId);
    setSelectedUnitId(unitId);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What Could Your Tax Dollars Buy?
            </h1>
            <p className="text-muted-foreground">
              FY {currentFiscalYear} · Turn billions into tangible comparisons
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Main Comparison Module - 8 cols */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
                {/* Result Display - The Hero */}
                {comparison && selectedUnit && (
                  <div className="mb-8 text-center">
                    <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      {selectedBudgetItem.name}
                    </p>
                    <p className="mb-4 text-lg text-muted-foreground">
                      {formatCurrency(selectedBudgetItem.amount, {
                        compact: true,
                      })}{" "}
                      could fund
                    </p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-primary sm:text-6xl">
                        {formatNumber(Math.floor(comparison.count))}
                      </span>
                    </div>
                    <p className="text-xl font-medium sm:text-2xl">
                      {comparison.count === 1
                        ? selectedUnit.nameSingular
                        : selectedUnit.name}
                    </p>
                    {selectedUnit.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        @{" "}
                        {formatCurrency(
                          selectedUnit.cost || selectedUnit.costPerUnit,
                          { compact: true },
                        )}{" "}
                        each
                      </p>
                    )}
                  </div>
                )}

                {/* Selectors */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Budget Item
                    </label>
                    <Select
                      value={selectedBudgetItemId}
                      onValueChange={setSelectedBudgetItemId}
                    >
                      <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {budgetItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Compare To
                    </label>
                    <Select
                      value={selectedUnitId}
                      onValueChange={setSelectedUnitId}
                    >
                      <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(unitsByCategory).map(
                          ([category, units]) => (
                            <SelectGroup key={category}>
                              <SelectLabel className="capitalize">
                                {category}
                              </SelectLabel>
                              {units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Link2 className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(
                        `/compare/${selectedBudgetItemId}/${selectedUnitId}`,
                      )
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Card
                  </Button>
                </div>
              </div>

              {/* Data Source */}
              <div className="mt-4 flex justify-center">
                <DataFreshnessIndicator
                  lastUpdated={lastUpdated}
                  source="USAspending.gov"
                  sourceUrl="https://www.usaspending.gov"
                />
              </div>
            </div>

            {/* Sidebar - 4 cols */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800/50">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  More Comparisons
                </h3>
                <div className="space-y-2">
                  {sidebarCards.map(
                    (card) =>
                      card && (
                        <button
                          key={`${card.budgetId}-${card.unitId}`}
                          onClick={() =>
                            handleExampleClick(card.budgetId, card.unitId)
                          }
                          className="w-full rounded-lg bg-white p-3 text-left transition-all hover:shadow-md dark:bg-slate-900"
                        >
                          <p className="text-xs text-muted-foreground">
                            {card.budgetName}
                          </p>
                          <p className="font-semibold">
                            <span className="text-primary">
                              {formatNumber(Math.floor(card.count))}
                            </span>{" "}
                            {card.unitName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(card.amount, { compact: true })}
                          </p>
                        </button>
                      ),
                  )}
                </div>
                <Link
                  href="/compare"
                  className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Browse all comparisons
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Overview */}
      <section className="border-t bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Explore the Full Budget
          </h2>
          <div className="mx-auto max-w-3xl">
            <div className="h-[400px]">
              <BudgetPieChart
                data={budgetData}
                onItemClick={(id) => router.push(`/budget/${id}`)}
                onItemHover={() => {}}
              />
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/budget"
                className="text-sm font-medium text-primary hover:underline"
              >
                View detailed breakdown →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-primary">$7.0T</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Total FY2025 Budget
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="mt-1 text-sm text-muted-foreground">Budget Items</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">75+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Comparison Units
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
