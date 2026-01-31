"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import type { ComparisonUnit } from "@/types/comparison";

interface SearchableUnitSelectProps {
  /** Currently selected unit ID */
  value: string | null;
  /** Callback when a unit is selected */
  onValueChange: (unitId: string) => void;
  /** Placeholder text when no unit is selected */
  placeholder?: string;
  /** Label for the select */
  label?: string;
  /** Additional class names for the trigger button */
  className?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
}

/**
 * Category display configuration
 */
const CATEGORY_CONFIG: Record<string, { order: number; displayName: string }> =
  {
    healthcare: { order: 1, displayName: "Healthcare" },
    housing: { order: 2, displayName: "Housing" },
    education: { order: 3, displayName: "Education" },
    food: { order: 4, displayName: "Food" },
    transportation: { order: 5, displayName: "Transportation" },
    income: { order: 6, displayName: "Income & Salary" },
    "public-services": { order: 7, displayName: "Public Services" },
    veterans: { order: 8, displayName: "Veterans" },
    environment: { order: 9, displayName: "Environment" },
    infrastructure: { order: 10, displayName: "Infrastructure" },
    everyday: { order: 11, displayName: "Everyday Items" },
    vehicles: { order: 12, displayName: "Vehicles" },
    buildings: { order: 13, displayName: "Buildings" },
    misc: { order: 99, displayName: "Miscellaneous" },
  };

/**
 * Debounce hook for search input
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Format cost for display
 */
function formatCost(cost: number): string {
  if (cost >= 1_000_000_000) {
    return `$${(cost / 1_000_000_000).toFixed(1)}B`;
  }
  if (cost >= 1_000_000) {
    return `$${(cost / 1_000_000).toFixed(1)}M`;
  }
  if (cost >= 1_000) {
    return `$${(cost / 1_000).toFixed(1)}K`;
  }
  if (cost < 1) {
    return `$${cost.toFixed(2)}`;
  }
  return `$${cost.toLocaleString()}`;
}

/**
 * Get cost from unit (handles both costPerUnit and cost properties)
 */
function getUnitCost(unit: ComparisonUnit): number {
  return unit.costPerUnit ?? unit.cost ?? 0;
}

/**
 * Searchable dropdown for comparison units
 * Extends Select with search/filter functionality, grouped results, and keyboard navigation
 */
export function SearchableUnitSelect({
  value,
  onValueChange,
  placeholder = "Select a comparison unit...",
  label,
  className,
  disabled = false,
}: SearchableUnitSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const debouncedSearch = useDebounce(search, 150);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  // Get selected unit
  const selectedUnit = React.useMemo(
    () => ALL_COMPARISON_UNITS.find((u) => u.id === value),
    [value],
  );

  // Filter units based on search
  const filteredUnits = React.useMemo(() => {
    if (!debouncedSearch.trim()) {
      return ALL_COMPARISON_UNITS;
    }

    const searchLower = debouncedSearch.toLowerCase();
    return ALL_COMPARISON_UNITS.filter((unit) => {
      const nameMatch = unit.name.toLowerCase().includes(searchLower);
      const singularMatch = unit.nameSingular
        ?.toLowerCase()
        .includes(searchLower);
      const descriptionMatch = unit.description
        ?.toLowerCase()
        .includes(searchLower);
      return nameMatch || singularMatch || descriptionMatch;
    });
  }, [debouncedSearch]);

  // Group filtered units by category
  const groupedUnits = React.useMemo(() => {
    const groups: Record<string, ComparisonUnit[]> = {};

    for (const unit of filteredUnits) {
      const category = unit.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(unit);
    }

    // Sort categories by defined order
    const sortedCategories = Object.keys(groups).sort(
      (a, b) =>
        (CATEGORY_CONFIG[a]?.order ?? 99) - (CATEGORY_CONFIG[b]?.order ?? 99),
    );

    return { groups, sortedCategories };
  }, [filteredUnits]);

  // Flat list of units for keyboard navigation
  const flatUnits = React.useMemo(() => {
    const units: ComparisonUnit[] = [];
    for (const category of groupedUnits.sortedCategories) {
      units.push(...(groupedUnits.groups[category] ?? []));
    }
    return units;
  }, [groupedUnits]);

  // Reset highlight when search changes
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [debouncedSearch]);

  // Focus input when popover opens
  React.useEffect(() => {
    if (open) {
      // Small delay to ensure popover is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [open]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && highlightedIndex < flatUnits.length) {
      const unit = flatUnits[highlightedIndex];
      const element = itemRefs.current.get(unit.id);
      element?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, flatUnits]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < flatUnits.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < flatUnits.length) {
            const unit = flatUnits[highlightedIndex];
            onValueChange(unit.id);
            setOpen(false);
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          break;
        case "Home":
          event.preventDefault();
          setHighlightedIndex(0);
          break;
        case "End":
          event.preventDefault();
          setHighlightedIndex(flatUnits.length - 1);
          break;
      }
    },
    [open, flatUnits, highlightedIndex, onValueChange],
  );

  // Handle item selection
  const handleSelect = React.useCallback(
    (unitId: string) => {
      onValueChange(unitId);
      setOpen(false);
    },
    [onValueChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9",
              className,
            )}
          >
            {selectedUnit ? (
              <span className="flex items-center gap-2 truncate">
                {selectedUnit.icon && <span>{selectedUnit.icon}</span>}
                <span className="truncate">{selectedUnit.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatCost(getUnitCost(selectedUnit))}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="size-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              placeholder="Search units..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
            />
          </div>

          {/* Results list */}
          <div
            ref={listRef}
            role="listbox"
            className="max-h-[300px] overflow-y-auto p-1"
          >
            {flatUnits.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No units found.
              </div>
            ) : (
              groupedUnits.sortedCategories.map((category) => {
                const units = groupedUnits.groups[category] ?? [];
                if (units.length === 0) return null;

                return (
                  <div
                    key={category}
                    role="group"
                    aria-label={
                      CATEGORY_CONFIG[category]?.displayName ?? category
                    }
                  >
                    {/* Category label */}
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                      {CATEGORY_CONFIG[category]?.displayName ?? category}
                    </div>

                    {/* Units in category */}
                    {units.map((unit) => {
                      const flatIndex = flatUnits.findIndex(
                        (u) => u.id === unit.id,
                      );
                      const isHighlighted = flatIndex === highlightedIndex;
                      const isSelected = unit.id === value;

                      return (
                        <div
                          key={unit.id}
                          ref={(el) => {
                            if (el) {
                              itemRefs.current.set(unit.id, el);
                            } else {
                              itemRefs.current.delete(unit.id);
                            }
                          }}
                          role="option"
                          aria-selected={isSelected}
                          data-highlighted={isHighlighted}
                          onClick={() => handleSelect(unit.id)}
                          onMouseEnter={() => setHighlightedIndex(flatIndex)}
                          className={cn(
                            "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm py-1.5 px-2 text-sm outline-none select-none",
                            isHighlighted && "bg-accent text-accent-foreground",
                            isSelected && !isHighlighted && "bg-accent/50",
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {unit.icon && (
                              <span className="shrink-0">{unit.icon}</span>
                            )}
                            <span className="truncate">{unit.name}</span>
                          </span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="text-muted-foreground text-xs">
                              {formatCost(getUnitCost(unit))}
                            </span>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
