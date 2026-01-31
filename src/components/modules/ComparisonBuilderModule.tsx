"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { calculateComparison } from "@/lib/comparison-engine";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { DataFreshnessIndicator } from "@/components/budget/DataFreshnessIndicator";
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
import { Link2, ChevronDown, Equal, Share2 } from "lucide-react";
import type { BudgetItem } from "@/types/budget";
import type { ComparisonUnit } from "@/types/comparison";

interface ComparisonBuilderModuleProps {
  /** Available budget items to select from */
  budgetItems: BudgetItem[];
  /** Last updated timestamp for data freshness indicator */
  lastUpdated: Date;
  /** Initial budget item ID to select */
  initialBudgetItemId?: string;
  /** Initial unit ID to select */
  initialUnitId?: string;
  /** Callback when selections change */
  onSelectionChange?: (budgetItemId: string, unitId: string) => void;
}

// Default preset comparison
const DEFAULT_BUDGET_ITEM = {
  id: "program-f35",
  name: "F-35 Fighter Program",
  amount: 13_200_000_000,
};

const DEFAULT_UNIT_ID = "teacher-salary";

/**
 * ComparisonBuilderModule
 *
 * The primary interactive module for building budget comparisons.
 * Allows users to select a government expense and compare it to tangible units.
 *
 * Performance optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Memoized callbacks and computed values
 * - Optimized unit lookup with Map
 */
export const ComparisonBuilderModule = memo<ComparisonBuilderModuleProps>(
  function ComparisonBuilderModule({
    budgetItems,
    lastUpdated,
    initialBudgetItemId = DEFAULT_BUDGET_ITEM.id,
    initialUnitId = DEFAULT_UNIT_ID,
    onSelectionChange,
  }) {
    const router = useRouter();

    const [selectedBudgetItemId, setSelectedBudgetItemId] =
      useState<string>(initialBudgetItemId);
    const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId);

    // Create unit lookup map - memoized to avoid recreation
    const unitMap = useMemo(() => {
      const map = new Map<string, ComparisonUnit>();
      ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
      return map;
    }, []);

    // Get selected items - memoized to avoid recalculation
    const selectedBudgetItem = useMemo(
      () =>
        budgetItems.find((item) => item.id === selectedBudgetItemId) || {
          id: DEFAULT_BUDGET_ITEM.id,
          name: DEFAULT_BUDGET_ITEM.name,
          amount: DEFAULT_BUDGET_ITEM.amount,
        },
      [budgetItems, selectedBudgetItemId],
    );

    const selectedUnit = useMemo(
      () => unitMap.get(selectedUnitId),
      [unitMap, selectedUnitId],
    );

    // Calculate comparison - memoized to avoid recalculation
    const comparison = useMemo(
      () =>
        selectedUnit
          ? calculateComparison(selectedBudgetItem.amount, selectedUnit)
          : null,
      [selectedBudgetItem.amount, selectedUnit],
    );

    // Group units by category - memoized to avoid recreation
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

    // Memoized callbacks to prevent prop changes in child components
    const handleBudgetItemChange = useCallback(
      (id: string) => {
        setSelectedBudgetItemId(id);
        onSelectionChange?.(id, selectedUnitId);
      },
      [onSelectionChange, selectedUnitId],
    );

    const handleUnitChange = useCallback(
      (id: string) => {
        setSelectedUnitId(id);
        onSelectionChange?.(selectedBudgetItemId, id);
      },
      [onSelectionChange, selectedBudgetItemId],
    );

    const handleShare = useCallback(() => {
      const url = `${window.location.origin}/compare/${selectedBudgetItemId}/${selectedUnitId}`;
      navigator.clipboard.writeText(url);
    }, [selectedBudgetItemId, selectedUnitId]);

    return (
      <div>
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 p-4 shadow-2xl sm:rounded-3xl sm:p-6 md:p-8">
          {/* Module Instructions */}
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-slate-500 sm:mb-6 sm:text-sm">
            Select a government expense and see what it could buy instead
          </p>

          {/* Responsive Layout: Horizontal on md+, Vertical on mobile */}
          <div className="flex flex-col items-stretch gap-4 md:flex-row">
            {/* LEFT: Government Expense */}
            <div className="flex flex-1 flex-col rounded-2xl border border-blue-500/30 bg-slate-800/50 p-5">
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-blue-400">
                Government Expense
              </label>
              <Select
                value={selectedBudgetItemId}
                onValueChange={handleBudgetItemChange}
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-2 border-slate-600 bg-slate-900/80 px-3 text-sm font-medium text-white transition-all hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30">
                  <SelectValue placeholder="Select expense..." />
                  <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
                </SelectTrigger>
                <SelectContent className="max-h-80 border-slate-700 bg-slate-900">
                  <SelectGroup>
                    {budgetItems.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="text-base"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Expense Amount */}
              <div className="mt-auto flex flex-col items-center justify-center pt-6">
                <p className="text-3xl font-bold text-white lg:text-4xl">
                  {formatCurrency(selectedBudgetItem.amount, {
                    compact: true,
                  })}
                </p>
                <p className="mt-1 text-xs text-slate-500">Annual spending</p>
              </div>
            </div>

            {/* CENTER: Equals Sign - Vertical on mobile, Horizontal on md+ */}
            <div className="flex shrink-0 items-center justify-center py-2 md:py-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 ring-2 ring-slate-600 md:h-16 md:w-16">
                <Equal
                  className="h-6 w-6 rotate-90 text-white md:h-8 md:w-8 md:rotate-0"
                  strokeWidth={3}
                />
              </div>
            </div>

            {/* RIGHT: Compare To */}
            <div className="flex flex-1 flex-col rounded-2xl border border-emerald-500/30 bg-slate-800/50 p-5">
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-emerald-400">
                Compare To
              </label>
              <Select value={selectedUnitId} onValueChange={handleUnitChange}>
                <SelectTrigger className="h-12 w-full rounded-xl border-2 border-slate-600 bg-slate-900/80 px-3 text-sm font-medium text-white transition-all hover:border-emerald-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30">
                  <SelectValue placeholder="Select unit..." />
                  <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
                </SelectTrigger>
                <SelectContent className="max-h-80 border-slate-700 bg-slate-900">
                  {Object.entries(unitsByCategory).map(([category, units]) => (
                    <SelectGroup key={category}>
                      <SelectLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {category}
                      </SelectLabel>
                      {units.map((unit) => (
                        <SelectItem
                          key={unit.id}
                          value={unit.id}
                          className="text-base"
                        >
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>

              {/* Result */}
              {comparison && selectedUnit && (
                <div className="mt-auto flex flex-col items-center justify-center pt-6">
                  <p className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                    {formatNumber(Math.floor(comparison.count))}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {comparison.count === 1
                      ? selectedUnit.nameSingular
                      : selectedUnit.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    @{" "}
                    {formatCurrency(
                      selectedUnit.cost || selectedUnit.costPerUnit || 0,
                      { compact: true },
                    )}{" "}
                    each
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              size="default"
              className="w-full border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800 sm:w-auto"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/compare/${selectedBudgetItemId}/${selectedUnitId}`,
                )
              }
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 sm:w-auto"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share This
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
    );
  },
);
