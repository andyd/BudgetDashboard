"use client";

import * as React from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { BudgetItem } from "@/types/budget";

/**
 * Spending tier labels for grouping
 */
type SpendingTier = "Departments" | "Programs" | "Current Events";

/**
 * Extended budget item with tier information
 */
export interface SpendingItem extends BudgetItem {
  tier: SpendingTier;
}

export interface SpendingSelectorProps {
  /** Callback when an item is selected */
  onSelect: (item: SpendingItem) => void;
  /** Currently selected item */
  selectedItem: SpendingItem | null;
  /** Additional CSS classes */
  className?: string;
  /** Available spending items to choose from */
  items?: SpendingItem[];
  /** Placeholder text for the input */
  placeholder?: string;
  /** Label for the selector */
  label?: string;
}

/**
 * Formats currency amount with appropriate suffix
 */
const formatAmount = (amount: number): string => {
  if (amount >= 1e12) {
    return `$${(amount / 1e12).toFixed(1)}T`;
  }
  if (amount >= 1e9) {
    return `$${(amount / 1e9).toFixed(1)}B`;
  }
  if (amount >= 1e6) {
    return `$${(amount / 1e6).toFixed(1)}M`;
  }
  if (amount >= 1e3) {
    return `$${(amount / 1e3).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

/**
 * Groups items by their tier
 */
const groupByTier = (
  items: SpendingItem[],
): Record<SpendingTier, SpendingItem[]> => {
  const groups: Record<SpendingTier, SpendingItem[]> = {
    Departments: [],
    Programs: [],
    "Current Events": [],
  };

  for (const item of items) {
    if (groups[item.tier]) {
      groups[item.tier].push(item);
    }
  }

  return groups;
};

/**
 * Filters items based on search term
 */
const filterItems = (
  items: SpendingItem[],
  searchTerm: string,
): SpendingItem[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  if (!normalizedSearch) return items;

  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedSearch),
  );
};

/**
 * SpendingSelector Component
 *
 * A dropdown/search component for selecting budget spending items.
 * Features:
 * - Search input with autocomplete
 * - Grouped by tier (Departments, Programs, Current Events)
 * - Shows amount next to each item
 * - Click to select
 */
function SpendingSelector({
  onSelect,
  selectedItem,
  className,
  items = [],
  placeholder = "Search spending items...",
  label,
}: SpendingSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Filter and group items based on search
  const filteredItems = React.useMemo(
    () => filterItems(items, searchTerm),
    [items, searchTerm],
  );

  const groupedItems = React.useMemo(
    () => groupByTier(filteredItems),
    [filteredItems],
  );

  // Flatten grouped items for keyboard navigation
  const flattenedItems = React.useMemo(() => {
    const result: SpendingItem[] = [];
    const tiers: SpendingTier[] = ["Departments", "Programs", "Current Events"];
    for (const tier of tiers) {
      result.push(...groupedItems[tier]);
    }
    return result;
  }, [groupedItems]);

  // Reset selected index when filtered items change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle item selection
  const handleItemSelect = (item: SpendingItem) => {
    onSelect(item);
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm("");
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, flattenedItems.length - 1),
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (flattenedItems[selectedIndex]) {
          handleItemSelect(flattenedItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Scroll selected item into view
  React.useEffect(() => {
    if (!isOpen) return;

    const selectedElement = document.getElementById(
      `spending-item-${selectedIndex}`,
    );
    if (selectedElement && listRef.current) {
      selectedElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex, isOpen]);

  // Determine display value
  const displayValue = selectedItem
    ? `${selectedItem.name} (${formatAmount(selectedItem.amount)})`
    : "";

  // Count items per tier for display
  const tierCounts = React.useMemo(() => {
    return {
      Departments: groupedItems.Departments.length,
      Programs: groupedItems.Programs.length,
      "Current Events": groupedItems["Current Events"].length,
    };
  }, [groupedItems]);

  // Track cumulative index for flattened navigation
  let cumulativeIndex = 0;

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label
          htmlFor="spending-selector-input"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              id="spending-selector-input"
              type="text"
              placeholder={selectedItem ? displayValue : placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className={cn(
                "pl-9 pr-16",
                selectedItem && !searchTerm && "text-foreground",
              )}
              aria-label="Search spending items"
              aria-autocomplete="list"
              aria-controls="spending-results"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {(searchTerm || selectedItem) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-accent rounded-sm transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            ref={listRef}
            id="spending-results"
            role="listbox"
            className="max-h-[300px] overflow-y-auto"
          >
            {flattenedItems.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : "No spending items available"}
              </div>
            )}

            {(
              ["Departments", "Programs", "Current Events"] as SpendingTier[]
            ).map((tier) => {
              const tierItems = groupedItems[tier];
              if (tierItems.length === 0) return null;

              const startIndex = cumulativeIndex;
              cumulativeIndex += tierItems.length;

              return (
                <div key={tier}>
                  {/* Tier Header */}
                  <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                    {tier}
                    <span className="ml-2 text-muted-foreground/60">
                      ({tierCounts[tier]})
                    </span>
                  </div>

                  {/* Tier Items */}
                  {tierItems.map((item, itemIndex) => {
                    const globalIndex = startIndex + itemIndex;
                    const isSelected = globalIndex === selectedIndex;
                    const isCurrentlySelected = selectedItem?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`spending-item-${globalIndex}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleItemSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 transition-colors border-b last:border-b-0",
                          isSelected && "bg-accent text-accent-foreground",
                          !isSelected && "hover:bg-accent/50",
                          isCurrentlySelected &&
                            "bg-primary/10 border-l-2 border-l-primary",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div
                              className={cn(
                                "font-medium text-sm truncate",
                                isCurrentlySelected && "text-primary",
                              )}
                            >
                              {item.name}
                            </div>
                            {item.code && (
                              <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {item.code}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-right whitespace-nowrap tabular-nums">
                            {formatAmount(item.amount)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Item Display */}
      {selectedItem && !isOpen && !searchTerm && (
        <div className="mt-2 p-3 rounded-md bg-accent/30 border border-accent">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {selectedItem.tier}
              </span>
              <div className="font-medium text-sm">{selectedItem.name}</div>
            </div>
            <div className="text-lg font-bold text-primary tabular-nums">
              {formatAmount(selectedItem.amount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { SpendingSelector };
export default SpendingSelector;
