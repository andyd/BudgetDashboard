"use client";

import { useState, useMemo } from "react";
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
 */
export function ComparisonBuilderModule({
  budgetItems,
  lastUpdated,
  initialBudgetItemId = DEFAULT_BUDGET_ITEM.id,
  initialUnitId = DEFAULT_UNIT_ID,
  onSelectionChange,
}: ComparisonBuilderModuleProps) {
  const router = useRouter();

  const [selectedBudgetItemId, setSelectedBudgetItemId] =
    useState<string>(initialBudgetItemId);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId);

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

  const handleBudgetItemChange = (id: string) => {
    setSelectedBudgetItemId(id);
    onSelectionChange?.(id, selectedUnitId);
  };

  const handleUnitChange = (id: string) => {
    setSelectedUnitId(id);
    onSelectionChange?.(selectedBudgetItemId, id);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/compare/${selectedBudgetItemId}/${selectedUnitId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div>
      <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 p-6 shadow-2xl sm:p-8">
        {/* Tagline */}
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          Turn billions into something you can understand
        </p>

        {/* Horizontal Layout: Left = Right */}
        <div className="flex flex-row items-stretch gap-4">
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

          {/* CENTER: Equals Sign */}
          <div className="flex shrink-0 items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 ring-2 ring-slate-600">
              <Equal className="h-8 w-8 text-white" strokeWidth={3} />
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
                    selectedUnit.cost || selectedUnit.costPerUnit,
                    { compact: true },
                  )}{" "}
                  each
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={handleShare}
            variant="outline"
            size="default"
            className="border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <Button
            onClick={() =>
              router.push(`/compare/${selectedBudgetItemId}/${selectedUnitId}`)
            }
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
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
}
