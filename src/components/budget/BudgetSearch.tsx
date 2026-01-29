"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useBudgetStore } from "@/stores/budget-store";
import type { BudgetItem } from "@/types/budget";

interface SearchResult {
  item: BudgetItem;
  parentPath: string;
}

/**
 * Recursively searches budget items by name
 */
const searchBudgetItems = (
  item: BudgetItem,
  searchTerm: string,
  parentPath: string[] = []
): SearchResult[] => {
  const results: SearchResult[] = [];
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) return results;

  // Check if current item matches
  if (item.name.toLowerCase().includes(normalizedSearch)) {
    results.push({
      item,
      parentPath: parentPath.length > 0 ? parentPath.join(" > ") : "Root",
    });
  }

  // Recursively search children
  if (item.children && item.children.length > 0) {
    const currentPath = [...parentPath, item.name];
    for (const child of item.children) {
      const childResults = searchBudgetItems(child, searchTerm, currentPath);
      results.push(...childResults);
    }
  }

  return results;
};

/**
 * Formats currency amount
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
  return `$${amount.toLocaleString()}`;
};

export function BudgetSearch() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedTerm, setDebouncedTerm] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const budgetData = useBudgetStore((state) => state.budgetData);
  const navigateToItem = useBudgetStore((state) => state.navigateToItem);

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
    if (!budgetData) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debouncedTerm.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = searchBudgetItems(budgetData, debouncedTerm);
    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
    setSelectedIndex(0);
  }, [debouncedTerm, budgetData]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

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
          handleResultClick(results[selectedIndex].item.id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (itemId: string) => {
    navigateToItem(itemId);
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Scroll selected item into view
  React.useEffect(() => {
    const selectedElement = document.getElementById(
      `search-result-${selectedIndex}`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  return (
    <div className="relative w-full max-w-md">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search budget items..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-9"
              aria-label="Search budget items"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={isOpen}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            id="search-results"
            role="listbox"
            className="max-h-[300px] overflow-y-auto"
          >
            {results.length === 0 && debouncedTerm && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No results found for "{debouncedTerm}"
              </div>
            )}

            {results.map((result, index) => (
              <button
                key={result.item.id}
                id={`search-result-${index}`}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleResultClick(result.item.id)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {result.item.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {result.parentPath}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-right whitespace-nowrap">
                    {formatAmount(result.item.amount)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
