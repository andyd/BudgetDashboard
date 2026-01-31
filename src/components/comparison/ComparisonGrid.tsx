"use client";

import { useState, useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComparisonCardMini } from "@/components/comparison/ComparisonCardMini";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

export interface ComparisonGridItem {
  budgetItem: {
    id: string;
    name: string;
    amount: number;
  };
  unit: {
    id: string;
    name: string;
    icon?: string;
  };
  count: number;
}

interface ComparisonGridProps {
  /** Array of comparisons to display */
  items: ComparisonGridItem[];
  /** Number of items to show initially (default: 12) */
  initialCount?: number;
  /** Number of items to load on each "load more" click (default: 12) */
  loadMoreCount?: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Callback when a comparison is clicked */
  onComparisonClick?: (item: ComparisonGridItem) => void;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom empty state description */
  emptyDescription?: string;
}

/**
 * ComparisonGrid - Displays multiple comparisons in a responsive grid layout
 *
 * Features:
 * - CSS Grid with auto-fit columns for responsive layout
 * - "Load more" pagination for large datasets
 * - Empty state handling when no items
 * - Compact cards for space efficiency
 */
export function ComparisonGrid({
  items,
  initialCount = 12,
  loadMoreCount = 12,
  className,
  onComparisonClick,
  emptyMessage = "No comparisons available",
  emptyDescription = "Create a comparison to see how federal spending translates into tangible terms.",
}: ComparisonGridProps) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const visibleItems = useMemo(
    () => items.slice(0, displayCount),
    [items, displayCount],
  );

  const hasMore = displayCount < items.length;
  const remainingCount = items.length - displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreCount, items.length));
  };

  // Empty state
  if (items.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title={emptyMessage}
        description={emptyDescription}
        iconSize="md"
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Grid container */}
      <div
        className={cn(
          "grid gap-4",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
        )}
        style={{
          // CSS Grid auto-fit for maximum responsiveness
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {visibleItems.map((item) => (
          <ComparisonCardMini
            key={`${item.budgetItem.id}-${item.unit.id}`}
            budgetItemId={item.budgetItem.id}
            budgetItemName={item.budgetItem.name}
            budgetAmount={item.budgetItem.amount}
            unitId={item.unit.id}
            unitName={item.unit.name}
            unitCount={item.count}
            unitIcon={item.unit.icon}
            className={onComparisonClick ? "cursor-pointer" : undefined}
          />
        ))}
      </div>

      {/* Load more section */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="min-w-[200px]"
          >
            Load More ({remainingCount} remaining)
          </Button>
          <p className="text-xs text-muted-foreground">
            Showing {displayCount} of {items.length} comparisons
          </p>
        </div>
      )}

      {/* End of list indicator when all loaded */}
      {!hasMore && items.length > initialCount && (
        <p className="text-center text-xs text-muted-foreground pt-4">
          Showing all {items.length} comparisons
        </p>
      )}
    </div>
  );
}
