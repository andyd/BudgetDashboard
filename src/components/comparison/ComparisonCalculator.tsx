"use client";

/**
 * ComparisonCalculator Component
 * Allows users to input a custom dollar amount and see what it could buy
 * across multiple unit categories.
 */

import { useState, useCallback, useMemo } from "react";
import { calculateComparison } from "@/lib/comparison-engine";
import { formatCurrency } from "@/lib/format";
import { mockUnits, getCategories } from "@/lib/mock-data/units";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ComparisonUnit } from "@/types";

interface ComparisonCalculatorProps {
  /** Optional initial amount to display */
  initialAmount?: number;
  /** Optional callback when amount changes */
  onAmountChange?: (amount: number) => void;
  /** Optional custom units to use instead of default mock units */
  units?: ComparisonUnit[];
  /** Optional class name for the container */
  className?: string;
}

/**
 * Preset amounts for quick selection
 */
const PRESET_AMOUNTS = [
  { label: "$1M", value: 1_000_000 },
  { label: "$1B", value: 1_000_000_000 },
  { label: "$1T", value: 1_000_000_000_000 },
];

/**
 * Category display names for better UX
 */
const CATEGORY_LABELS: Record<string, string> = {
  infrastructure: "Infrastructure",
  everyday: "Everyday Items",
  vehicles: "Vehicles",
  buildings: "Buildings",
  misc: "Miscellaneous",
  food: "Food",
  entertainment: "Entertainment",
  products: "Products",
  transportation: "Transportation",
  salary: "Salaries",
  healthcare: "Healthcare",
  education: "Education",
  general: "General",
  housing: "Housing",
  environment: "Environment",
  "public-services": "Public Services",
  income: "Income",
  veterans: "Veterans",
};

/**
 * Format input value with commas as user types
 */
function formatInputValue(value: string): string {
  // Remove all non-digit characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");

  // Split by decimal point
  const parts = cleaned.split(".");

  // Format the integer part with commas
  const integerPart = parts[0] || "";
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Rejoin with decimal if present
  if (parts.length > 1) {
    return `${formattedInteger}.${parts[1]}`;
  }

  return formattedInteger;
}

/**
 * Parse formatted string back to number
 */
function parseFormattedValue(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function ComparisonCalculator({
  initialAmount = 0,
  onAmountChange,
  units = mockUnits,
  className,
}: ComparisonCalculatorProps) {
  const [inputValue, setInputValue] = useState(
    initialAmount > 0 ? formatInputValue(initialAmount.toString()) : "",
  );
  const [amount, setAmount] = useState(initialAmount);

  // Get unique categories from units
  const categories = useMemo(() => {
    const cats = new Set(units.map((u) => u.category));
    return Array.from(cats);
  }, [units]);

  // Group units by category
  const unitsByCategory = useMemo(() => {
    return units.reduce<Record<string, ComparisonUnit[]>>((acc, unit) => {
      const category = unit.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category]!.push(unit);
      return acc;
    }, {});
  }, [units]);

  // Handle input change with formatting
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatInputValue(rawValue);
      setInputValue(formatted);

      const numericValue = parseFormattedValue(formatted);
      setAmount(numericValue);
      onAmountChange?.(numericValue);
    },
    [onAmountChange],
  );

  // Handle preset button click
  const handlePresetClick = useCallback(
    (presetValue: number) => {
      const formatted = formatInputValue(presetValue.toString());
      setInputValue(formatted);
      setAmount(presetValue);
      onAmountChange?.(presetValue);
    },
    [onAmountChange],
  );

  // Calculate comparisons for all units
  const comparisons = useMemo(() => {
    if (amount <= 0) return {};

    const results: Record<
      string,
      Array<{
        unit: ComparisonUnit;
        result: ReturnType<typeof calculateComparison>;
      }>
    > = {};

    for (const category of categories) {
      const categoryUnits = unitsByCategory[category] || [];
      results[category] = categoryUnits.map((unit) => ({
        unit,
        result: calculateComparison(amount, unit),
      }));
    }

    return results;
  }, [amount, categories, unitsByCategory]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">Budget Comparison Calculator</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a dollar amount to see what it could buy
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount-input" className="text-sm font-medium">
              Dollar Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount-input"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={inputValue}
                onChange={handleInputChange}
                className="pl-7 text-lg"
                aria-label="Enter dollar amount"
              />
            </div>
            {amount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(amount, { compact: true })}
              </p>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center mr-2">
              Quick select:
            </span>
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset.label}
                variant={amount === preset.value ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {amount > 0 && (
          <div className="space-y-6 pt-4 border-t">
            <h3 className="text-lg font-semibold">
              With {formatCurrency(amount, { compact: true })}, you could buy:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryResults = comparisons[category];
                if (!categoryResults || categoryResults.length === 0)
                  return null;

                return (
                  <div
                    key={category}
                    className="rounded-lg border bg-card p-4 space-y-3"
                  >
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {CATEGORY_LABELS[category] || category}
                    </h4>
                    <ul className="space-y-2">
                      {categoryResults.map(({ unit, result }) => (
                        <li
                          key={unit.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          {unit.icon && (
                            <span
                              className="text-base flex-shrink-0"
                              aria-hidden="true"
                            >
                              {unit.icon}
                            </span>
                          )}
                          <span className="flex-1">
                            <span className="font-semibold text-primary">
                              {result.formatted}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {amount <= 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Enter an amount above to see what it could buy
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
