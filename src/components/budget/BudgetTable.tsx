"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/format";
import { BudgetItem } from "@/types/budget";
import { cn } from "@/lib/utils";

type SortField = "name" | "amount" | "percentOfParent" | "yearOverYearChange";
type SortDirection = "asc" | "desc";

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface BudgetTableProps {
  /** Array of budget items to display */
  budgetItems: BudgetItem[];
  /** Optional callback when a row is clicked (overrides default navigation) */
  onRowClick?: (item: BudgetItem) => void;
  /** Optional base path for navigation (default: '/budget') */
  basePath?: string;
  /** Show the % of Total column (default: true) */
  showPercentOfTotal?: boolean;
  /** Show the YoY Change column (default: true) */
  showYoYChange?: boolean;
  /** Optional class name for the table container */
  className?: string;
}

/**
 * BudgetTable Component
 *
 * Displays budget items in a sortable table with columns for:
 * - Name
 * - Amount (formatted as currency)
 * - % of Total (percentage of parent budget)
 * - YoY Change (year-over-year change)
 *
 * Features:
 * - Click column headers to sort ascending/descending
 * - Hover highlight on rows
 * - Click rows to navigate to detail page
 */
export function BudgetTable({
  budgetItems,
  onRowClick,
  basePath = "/budget",
  showPercentOfTotal = true,
  showYoYChange = true,
  className,
}: BudgetTableProps) {
  const router = useRouter();
  const [sort, setSort] = React.useState<SortState>({
    field: "amount",
    direction: "desc",
  });

  // Sort items based on current sort state
  const sortedItems = React.useMemo(() => {
    const items = [...budgetItems];

    items.sort((a, b) => {
      let aValue: string | number | null;
      let bValue: string | number | null;

      switch (sort.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "percentOfParent":
          aValue = a.percentOfParent ?? -Infinity;
          bValue = b.percentOfParent ?? -Infinity;
          break;
        case "yearOverYearChange":
          aValue = a.yearOverYearChange ?? -Infinity;
          bValue = b.yearOverYearChange ?? -Infinity;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  }, [budgetItems, sort]);

  // Toggle sort when clicking a column header
  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle row click - navigate to detail page or call custom handler
  const handleRowClick = (item: BudgetItem) => {
    if (onRowClick) {
      onRowClick(item);
    } else {
      router.push(`${basePath}/${item.id}`);
    }
  };

  // Render sort icon for column headers
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Render YoY change with appropriate styling and icon
  const renderYoYChange = (change: number | null) => {
    if (change === null) {
      return <span className="text-muted-foreground">--</span>;
    }

    const isPositive = change > 0;
    const isNegative = change < 0;
    const isNeutral = change === 0;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          isPositive && "text-green-600 dark:text-green-400",
          isNegative && "text-red-600 dark:text-red-400",
          isNeutral && "text-muted-foreground",
        )}
      >
        {isPositive && <TrendingUp className="h-4 w-4" aria-hidden="true" />}
        {isNegative && <TrendingDown className="h-4 w-4" aria-hidden="true" />}
        {isNeutral && <Minus className="h-4 w-4" aria-hidden="true" />}
        <span>
          {isPositive && "+"}
          {formatPercent(change / 100, 1)}
        </span>
      </span>
    );
  };

  if (budgetItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No budget items to display.
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Name
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none hover:bg-muted/50 text-right"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center justify-end">
                Amount
                <SortIcon field="amount" />
              </div>
            </TableHead>
            {showPercentOfTotal && (
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 text-right"
                onClick={() => handleSort("percentOfParent")}
              >
                <div className="flex items-center justify-end">
                  % of Total
                  <SortIcon field="percentOfParent" />
                </div>
              </TableHead>
            )}
            {showYoYChange && (
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 text-right"
                onClick={() => handleSort("yearOverYearChange")}
              >
                <div className="flex items-center justify-end">
                  YoY Change
                  <SortIcon field="yearOverYearChange" />
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => handleRowClick(item)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(item);
                }
              }}
              role="button"
              aria-label={`View details for ${item.name}`}
            >
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(item.amount, { compact: true })}
              </TableCell>
              {showPercentOfTotal && (
                <TableCell className="text-right font-mono">
                  {item.percentOfParent !== null
                    ? formatPercent(item.percentOfParent / 100, 1)
                    : "--"}
                </TableCell>
              )}
              {showYoYChange && (
                <TableCell className="text-right">
                  {renderYoYChange(item.yearOverYearChange)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default BudgetTable;
