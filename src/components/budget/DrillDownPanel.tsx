"use client";

import { useState } from "react";
import { ArrowUpDown, Sparkles } from "lucide-react";
import { BudgetItem, BudgetSort } from "@/types/budget";
import { formatCurrency } from "@/lib/format";
import { PercentageBar } from "./PercentageBar";
import { YearOverYearIndicator } from "./YearOverYearIndicator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DrillDownPanelProps {
  /** Array of child budget items to display */
  items: BudgetItem[];
  /** Parent budget item for context (optional) */
  parentItem?: BudgetItem;
  /** Callback when a budget item is clicked for drilling deeper */
  onItemClick: (item: BudgetItem) => void;
  /** Flag to indicate if items have spotlights available (optional) */
  hasSpotlights?: (item: BudgetItem) => boolean;
}

/**
 * DrillDownPanel displays a list of child budget items in a sortable table view.
 * Each row shows the item name, amount, percentage bar, and YoY change.
 * Clicking a row drills deeper into the budget hierarchy.
 */
export function DrillDownPanel({
  items,
  parentItem,
  onItemClick,
  hasSpotlights,
}: DrillDownPanelProps) {
  const [sort, setSort] = useState<BudgetSort>({
    field: "amount",
    direction: "desc",
  });

  // Calculate total if we have a parent, otherwise use sum of items
  const total = parentItem?.amount ?? items.reduce((sum, item) => sum + item.amount, 0);

  // Sort items based on current sort state
  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    // Handle null values (sort to end)
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // For strings, use localeCompare
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sort.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For numbers
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Toggle sort direction or change field
  const handleSort = (field: BudgetSort["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort indicator for column headers
  const getSortIndicator = (field: BudgetSort["field"]) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 transition-transform ${
          sort.direction === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p>No budget items to display</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {parentItem && (
        <div className="flex items-baseline gap-2 pb-2 border-b">
          <h3 className="text-lg font-semibold">{parentItem.name}</h3>
          <span className="text-muted-foreground">
            {formatCurrency(parentItem.amount, { compact: true })}
          </span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("name")}
                className="h-8 px-2 lg:px-3"
              >
                Name
                {getSortIndicator("name")}
              </Button>
            </TableHead>
            <TableHead className="w-[20%] text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("amount")}
                className="h-8 px-2 lg:px-3"
              >
                Amount
                {getSortIndicator("amount")}
              </Button>
            </TableHead>
            <TableHead className="w-[25%]">
              <span className="px-2">% of Parent</span>
            </TableHead>
            <TableHead className="w-[15%] text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("yearOverYearChange")}
                className="h-8 px-2 lg:px-3"
              >
                YoY Change
                {getSortIndicator("yearOverYearChange")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const percentOfTotal = total > 0 ? (item.amount / total) * 100 : 0;
            const hasSpotlight = hasSpotlights ? hasSpotlights(item) : false;
            const previousAmount = item.yearOverYearChange
              ? item.amount / (1 + item.yearOverYearChange / 100)
              : 0;

            return (
              <TableRow
                key={item.id}
                onClick={() => onItemClick(item)}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onItemClick(item);
                  }
                }}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {hasSpotlight && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Sparkles
                            className="h-4 w-4 text-amber-500"
                            aria-label="Has spotlight information"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Spotlight available</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatCurrency(item.amount, { compact: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <PercentageBar
                        value={percentOfTotal}
                        color="bg-blue-500"
                        showLabel={false}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums w-12 text-right">
                      {percentOfTotal.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {item.yearOverYearChange !== null ? (
                    <div className="flex justify-end">
                      <YearOverYearIndicator
                        change={item.yearOverYearChange}
                        previousAmount={previousAmount}
                        currentAmount={item.amount}
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <span>
          Showing {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        {parentItem && (
          <span>
            Total: {formatCurrency(total, { compact: true })}
          </span>
        )}
      </div>
    </div>
  );
}
