"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "budget-comparison-history";
const MAX_HISTORY_ITEMS = 10;

export interface ComparisonHistoryItem {
  budgetId: string;
  budgetName: string;
  unitId: string;
  unitName: string;
  resultCount: number;
  timestamp: number;
}

interface ComparisonHistoryProps {
  className?: string;
  onSelect?: (item: ComparisonHistoryItem) => void;
}

function getStoredHistory(): ComparisonHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: ComparisonHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function addToComparisonHistory(
  item: Omit<ComparisonHistoryItem, "timestamp">,
): void {
  const history = getStoredHistory();

  // Remove any existing entry for the same budget + unit combination
  const filtered = history.filter(
    (h) => !(h.budgetId === item.budgetId && h.unitId === item.unitId),
  );

  // Add new item at the beginning
  const newHistory = [{ ...item, timestamp: Date.now() }, ...filtered].slice(
    0,
    MAX_HISTORY_ITEMS,
  );

  saveHistory(newHistory);
}

export function clearComparisonHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}

export function ComparisonHistory({
  className,
  onSelect,
}: ComparisonHistoryProps) {
  const [history, setHistory] = React.useState<ComparisonHistoryItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setHistory(getStoredHistory());
  }, []);

  const handleClearHistory = React.useCallback(() => {
    clearComparisonHistory();
    setHistory([]);
  }, []);

  const handleItemClick = React.useCallback(
    (item: ComparisonHistoryItem) => {
      if (onSelect) {
        onSelect(item);
      }
    },
    [onSelect],
  );

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  // Empty state
  if (history.length === 0) {
    return (
      <Card className={cn("bg-muted/30", className)}>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No recent comparisons yet. Start exploring budget items to build
            your history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Recent Comparisons</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="text-muted-foreground hover:text-destructive"
        >
          Clear History
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.map((item) => (
          <Link
            key={`${item.budgetId}-${item.unitId}-${item.timestamp}`}
            href={`/compare/${item.budgetId}/${item.unitId}`}
            onClick={() => handleItemClick(item)}
            className={cn(
              "block rounded-lg border bg-card p-3 transition-all",
              "hover:shadow-md hover:border-primary/30",
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.budgetName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  compared to {item.unitName}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">
                  {formatNumber(item.resultCount)}
                </p>
                <p className="text-xs text-muted-foreground">units</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
