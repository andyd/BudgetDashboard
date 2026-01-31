"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ALL_BUDGET_ITEMS, type BudgetSpendingItem } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

interface BudgetSearchAutocompleteProps {
  /** Callback when an item is selected */
  onSelect: (item: BudgetSpendingItem) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional class name for the container */
  className?: string;
  /** Whether to show the button trigger style (default) or inline input style */
  variant?: "button" | "input";
}

interface SearchResult {
  item: BudgetSpendingItem;
  matchField: "name" | "id" | "tier";
}

/**
 * Searches budget items by name, id, and tier
 */
function searchBudgetItems(searchTerm: string): SearchResult[] {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) return [];

  const results: SearchResult[] = [];

  for (const item of ALL_BUDGET_ITEMS) {
    // Check name match
    if (item.name.toLowerCase().includes(normalizedSearch)) {
      results.push({ item, matchField: "name" });
      continue;
    }

    // Check id match
    if (item.id.toLowerCase().includes(normalizedSearch)) {
      results.push({ item, matchField: "id" });
      continue;
    }

    // Check tier match
    if (item.tier.toLowerCase().includes(normalizedSearch)) {
      results.push({ item, matchField: "tier" });
      continue;
    }
  }

  return results;
}

/**
 * Formats the tier for display
 */
function formatTier(tier: BudgetSpendingItem["tier"]): string {
  switch (tier) {
    case "department":
      return "Department";
    case "program":
      return "Program";
    case "current-event":
      return "Current Event";
    default:
      return tier;
  }
}

/**
 * BudgetSearchAutocomplete
 *
 * Combobox-style search component for finding budget items.
 * Searches across name, id, and tier with 300ms debounce.
 *
 * @example
 * <BudgetSearchAutocomplete
 *   onSelect={(item) => console.log('Selected:', item)}
 *   placeholder="Search budget items..."
 * />
 */
export function BudgetSearchAutocomplete({
  onSelect,
  placeholder = "Search budget items...",
  className,
  variant = "button",
}: BudgetSearchAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedTerm, setDebouncedTerm] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedItem, setSelectedItem] =
    React.useState<BudgetSpendingItem | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounce search term (300ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
  React.useEffect(() => {
    if (debouncedTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    const searchResults = searchBudgetItems(debouncedTerm);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [debouncedTerm]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].item);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  // Handle item selection
  const handleSelect = (item: BudgetSpendingItem) => {
    setSelectedItem(item);
    setSearchTerm("");
    setResults([]);
    setOpen(false);
    onSelect(item);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  // Scroll selected item into view
  React.useEffect(() => {
    const selectedElement = document.getElementById(
      `autocomplete-result-${selectedIndex}`,
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Focus input when popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Delay to ensure popover is rendered
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "button" ? (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={placeholder}
            className={cn("w-full justify-between", className)}
          >
            <span className="truncate">
              {selectedItem ? selectedItem.name : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={selectedItem ? selectedItem.name : ""}
              readOnly
              className="pl-9 cursor-pointer"
              aria-label={placeholder}
            />
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search input inside popover */}
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Type to search..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex h-10 w-full border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-autocomplete="list"
            aria-controls="autocomplete-results"
          />
        </div>

        {/* Results list */}
        <div
          id="autocomplete-results"
          role="listbox"
          className="max-h-[300px] overflow-y-auto"
        >
          {/* Empty state when no search term */}
          {debouncedTerm.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Start typing to search budget items
            </div>
          )}

          {/* No results state */}
          {debouncedTerm.length > 0 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for &quot;{debouncedTerm}&quot;
            </div>
          )}

          {/* Results */}
          {results.map((result, index) => (
            <button
              key={result.item.id}
              id={`autocomplete-result-${index}`}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(result.item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 flex items-center gap-3",
                index === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50",
              )}
            >
              <Check
                className={cn(
                  "h-4 w-4 shrink-0",
                  selectedItem?.id === result.item.id
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {result.item.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatTier(result.item.tier)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-right whitespace-nowrap">
                    {formatCurrency(result.item.amount, { compact: true })}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
