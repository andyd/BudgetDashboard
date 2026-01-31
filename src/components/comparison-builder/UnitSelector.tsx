"use client";

import * as React from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComparisonUnit {
  id: string;
  name: string;
  namePlural?: string;
  category: string;
  cost: number;
  icon?: string;
  description?: string;
}

interface UnitSelectorProps {
  onSelect: (unit: ComparisonUnit) => void;
  selectedUnit: ComparisonUnit | null;
  className?: string;
  units?: ComparisonUnit[];
  placeholder?: string;
}

// Category display configuration
const CATEGORY_CONFIG: Record<string, { displayName: string; order: number }> =
  {
    healthcare: { displayName: "Healthcare", order: 1 },
    education: { displayName: "Education", order: 2 },
    housing: { displayName: "Housing", order: 3 },
    transportation: { displayName: "Transportation", order: 4 },
    food: { displayName: "Food", order: 5 },
    environment: { displayName: "Environment", order: 6 },
    infrastructure: { displayName: "Infrastructure", order: 7 },
    entertainment: { displayName: "Entertainment", order: 8 },
    technology: { displayName: "Technology", order: 9 },
    household: { displayName: "Household", order: 10 },
    everyday: { displayName: "Everyday Items", order: 11 },
    vehicles: { displayName: "Vehicles", order: 12 },
    buildings: { displayName: "Buildings", order: 13 },
    salary: { displayName: "Salaries", order: 14 },
    subscription: { displayName: "Subscriptions", order: 15 },
    experience: { displayName: "Experiences", order: 16 },
    luxury: { displayName: "Luxury", order: 17 },
    misc: { displayName: "Miscellaneous", order: 99 },
    general: { displayName: "General", order: 100 },
  };

// Default units for demonstration
const DEFAULT_UNITS: ComparisonUnit[] = [
  {
    id: "1",
    name: "Teacher Salary",
    namePlural: "Teacher Salaries",
    category: "education",
    cost: 65000,
    icon: "👨‍🏫",
  },
  {
    id: "2",
    name: "School Lunch",
    namePlural: "School Lunches",
    category: "food",
    cost: 3.5,
    icon: "🍱",
  },
  {
    id: "3",
    name: "Health Insurance Premium",
    namePlural: "Health Insurance Premiums",
    category: "healthcare",
    cost: 8500,
    icon: "🏥",
  },
  {
    id: "4",
    name: "Average Rent (Annual)",
    namePlural: "Years of Rent",
    category: "housing",
    cost: 18000,
    icon: "🏠",
  },
  {
    id: "5",
    name: "Mile of Highway",
    namePlural: "Miles of Highway",
    category: "infrastructure",
    cost: 10000000,
    icon: "🛣️",
  },
  {
    id: "6",
    name: "Electric Vehicle",
    namePlural: "Electric Vehicles",
    category: "transportation",
    cost: 48000,
    icon: "🚗",
  },
];

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

function groupUnitsByCategory(
  units: ComparisonUnit[],
): Map<string, ComparisonUnit[]> {
  const grouped = new Map<string, ComparisonUnit[]>();

  for (const unit of units) {
    const category = unit.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(unit);
  }

  return grouped;
}

function getSortedCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const orderA = CATEGORY_CONFIG[a]?.order ?? 99;
    const orderB = CATEGORY_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });
}

function getCategoryDisplayName(category: string): string {
  return (
    CATEGORY_CONFIG[category]?.displayName ??
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

export default function UnitSelector({
  onSelect,
  selectedUnit,
  className,
  units = DEFAULT_UNITS,
  placeholder = "Search comparison units...",
}: UnitSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter units based on search query
  const filteredUnits = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return units;
    }

    const query = searchQuery.toLowerCase();
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.category.toLowerCase().includes(query) ||
        unit.description?.toLowerCase().includes(query),
    );
  }, [units, searchQuery]);

  // Group filtered units by category
  const groupedUnits = React.useMemo(
    () => groupUnitsByCategory(filteredUnits),
    [filteredUnits],
  );

  // Get sorted category keys
  const sortedCategories = React.useMemo(
    () => getSortedCategories(Array.from(groupedUnits.keys())),
    [groupedUnits],
  );

  const handleSelect = (unit: ComparisonUnit) => {
    onSelect(unit);
    setOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Focus search input when opening
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearchQuery("");
    }
  };

  const listboxId = React.useId();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-accent/50 transition-colors",
            className,
          )}
        >
          {selectedUnit ? (
            <span className="flex items-center gap-2 truncate">
              {selectedUnit.icon && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {selectedUnit.icon}
                </span>
              )}
              <span className="truncate">{selectedUnit.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {formatCost(selectedUnit.cost)}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
      >
        {/* Search input */}
        <div className="flex items-center border-b px-3">
          <Search
            className="mr-2 h-4 w-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..."
            className="h-10 border-0 bg-transparent px-0 py-2 shadow-none focus-visible:ring-0"
            aria-label="Search comparison units"
          />
        </div>

        {/* Unit list */}
        <div
          id={listboxId}
          role="listbox"
          aria-label="Comparison units"
          className="max-h-[300px] overflow-y-auto p-1"
        >
          {sortedCategories.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No units found.
            </div>
          ) : (
            sortedCategories.map((category) => (
              <div key={category} className="mb-2 last:mb-0">
                {/* Category header */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {getCategoryDisplayName(category)}
                </div>
                {/* Category items */}
                {groupedUnits.get(category)?.map((unit) => {
                  const isSelected = selectedUnit?.id === unit.id;
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(unit)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        isSelected && "bg-accent",
                      )}
                    >
                      {/* Icon */}
                      {unit.icon && (
                        <span
                          className="mr-2 flex-shrink-0 text-base"
                          aria-hidden="true"
                        >
                          {unit.icon}
                        </span>
                      )}

                      {/* Name */}
                      <span className="flex-1 truncate text-left">
                        {unit.name}
                      </span>

                      {/* Cost */}
                      <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground">
                        {formatCost(unit.cost)}
                      </span>

                      {/* Check mark for selected */}
                      {isSelected && (
                        <Check
                          className="ml-2 h-4 w-4 flex-shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
