"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALL_COMPARISON_UNITS, type UnitCategory } from "@/lib/data";

/**
 * Category configuration for display names and ordering
 */
const CATEGORY_CONFIG: Record<
  UnitCategory,
  { displayName: string; order: number }
> = {
  healthcare: { displayName: "Healthcare", order: 1 },
  education: { displayName: "Education", order: 2 },
  housing: { displayName: "Housing", order: 3 },
  transportation: { displayName: "Transportation", order: 4 },
  food: { displayName: "Food", order: 5 },
  income: { displayName: "Income", order: 6 },
  "public-services": { displayName: "Public Services", order: 7 },
  veterans: { displayName: "Veterans", order: 8 },
  environment: { displayName: "Environment", order: 9 },
  infrastructure: { displayName: "Infrastructure", order: 10 },
  everyday: { displayName: "Everyday", order: 11 },
  vehicles: { displayName: "Vehicles", order: 12 },
  buildings: { displayName: "Buildings", order: 13 },
  entertainment: { displayName: "Entertainment", order: 14 },
  products: { displayName: "Products", order: 15 },
  salary: { displayName: "Salary", order: 16 },
  general: { displayName: "General", order: 17 },
  misc: { displayName: "Miscellaneous", order: 99 },
};

/**
 * Calculate unit counts per category from ALL_COMPARISON_UNITS
 */
function getCategoryCounts(): Map<UnitCategory, number> {
  const counts = new Map<UnitCategory, number>();

  for (const unit of ALL_COMPARISON_UNITS) {
    const current = counts.get(unit.category) ?? 0;
    counts.set(unit.category, current + 1);
  }

  return counts;
}

/**
 * Get all unique categories from comparison units, sorted by config order
 */
function getSortedCategories(): UnitCategory[] {
  const categoriesSet = new Set<UnitCategory>();

  for (const unit of ALL_COMPARISON_UNITS) {
    categoriesSet.add(unit.category);
  }

  return Array.from(categoriesSet).sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });
}

interface CategoryFilterProps {
  /** Currently selected categories */
  selectedCategories: UnitCategory[];
  /** Callback when selection changes */
  onChange: (categories: UnitCategory[]) => void;
  /** Optional className for container */
  className?: string;
}

/**
 * CategoryFilter Component
 *
 * Displays all comparison unit categories as toggleable filter pills/chips.
 * Supports multi-select with "All" and "Clear" quick actions.
 *
 * @example
 * ```tsx
 * const [selected, setSelected] = useState<UnitCategory[]>([]);
 *
 * <CategoryFilter
 *   selectedCategories={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
export function CategoryFilter({
  selectedCategories,
  onChange,
  className,
}: CategoryFilterProps) {
  const categories = React.useMemo(() => getSortedCategories(), []);
  const categoryCounts = React.useMemo(() => getCategoryCounts(), []);

  const allSelected = selectedCategories.length === categories.length;
  const noneSelected = selectedCategories.length === 0;

  /**
   * Toggle a single category on/off
   */
  const toggleCategory = (category: UnitCategory) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  /**
   * Select all categories
   */
  const selectAll = () => {
    onChange([...categories]);
  };

  /**
   * Clear all selections
   */
  const clearAll = () => {
    onChange([]);
  };

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="group"
      aria-label="Filter comparison units by category"
    >
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          disabled={allSelected}
          className="text-xs"
        >
          All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          disabled={noneSelected}
          className="text-xs"
        >
          Clear
        </Button>
        {!noneSelected && (
          <span className="text-xs text-muted-foreground ml-2">
            {selectedCategories.length} of {categories.length} selected
          </span>
        )}
      </div>

      {/* Category chips */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Category filters"
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const count = categoryCounts.get(category) ?? 0;
          const displayName =
            CATEGORY_CONFIG[category]?.displayName ?? category;

          return (
            <button
              key={category}
              type="button"
              role="checkbox"
              onClick={() => toggleCategory(category)}
              aria-checked={isSelected}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span>{displayName}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={cn(
                  "h-5 min-w-5 px-1.5 text-xs font-normal",
                  isSelected &&
                    "bg-primary-foreground/20 text-primary-foreground border-transparent",
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
