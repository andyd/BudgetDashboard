"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ============================================================================
// ComparisonCardSkeleton
// Matches the layout of ComparisonCard component
// ============================================================================

interface ComparisonCardSkeletonProps {
  className?: string;
}

export function ComparisonCardSkeleton({
  className,
}: ComparisonCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-br from-purple-50 via-white to-blue-50",
        "dark:from-purple-950/20 dark:via-gray-950 dark:to-blue-950/20",
        "border-purple-200/60 dark:border-purple-800/40",
        className,
      )}
    >
      <CardContent className="relative p-8 space-y-6">
        {/* Icon and Category Badge */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Main Headline */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>

        {/* Visual Equation Box */}
        <div className="flex items-center justify-center gap-4 py-6 px-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-purple-200/40 dark:border-purple-800/40">
          <div className="text-center space-y-2">
            <Skeleton className="h-10 w-24 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>

          <Skeleton className="h-8 w-8 rounded" />

          <div className="text-center space-y-2">
            <Skeleton className="h-10 w-24 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        </div>

        {/* Context Text */}
        <div className="pt-4 border-t border-purple-200/40 dark:border-purple-800/40 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Unit Details */}
        <div className="pt-4 border-t border-purple-200/40 dark:border-purple-800/40 space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BudgetTableSkeleton
// Matches the layout of DrillDownPanel table
// ============================================================================

interface BudgetTableSkeletonProps {
  /** Number of rows to display */
  rows?: number;
  /** Show header row */
  showHeader?: boolean;
  className?: string;
}

export function BudgetTableSkeleton({
  rows = 5,
  showHeader = true,
  className,
}: BudgetTableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Optional parent header */}
      {showHeader && (
        <div className="flex items-baseline gap-2 pb-2 border-b">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="w-[20%] text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableHead>
            <TableHead className="w-[25%]">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-[15%] text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-5 w-16 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

// ============================================================================
// ChartSkeleton
// Placeholder skeleton for chart visualizations
// ============================================================================

interface ChartSkeletonProps {
  /** Chart type affects the skeleton shape */
  type?: "bar" | "line" | "pie" | "treemap";
  /** Height of the chart area */
  height?: number | string;
  className?: string;
}

export function ChartSkeleton({
  type = "bar",
  height = 300,
  className,
}: ChartSkeletonProps) {
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  if (type === "treemap") {
    return (
      <div
        className={cn("w-full p-4", className)}
        style={{ height: heightStyle }}
      >
        <div className="grid grid-cols-12 grid-rows-6 gap-2 h-full">
          <Skeleton className="col-span-5 row-span-3 rounded-lg" />
          <Skeleton className="col-span-4 row-span-2 rounded-lg" />
          <Skeleton className="col-span-3 row-span-2 rounded-lg" />
          <Skeleton className="col-span-4 row-span-2 rounded-lg" />
          <Skeleton className="col-span-3 row-span-2 rounded-lg" />
          <Skeleton className="col-span-5 row-span-3 rounded-lg" />
          <Skeleton className="col-span-3 row-span-2 rounded-lg" />
          <Skeleton className="col-span-4 row-span-2 rounded-lg" />
          <Skeleton className="col-span-3 row-span-2 rounded-lg" />
          <Skeleton className="col-span-4 row-span-2 rounded-lg" />
        </div>
      </div>
    );
  }

  if (type === "pie") {
    return (
      <div
        className={cn("w-full flex items-center justify-center p-4", className)}
        style={{ height: heightStyle }}
      >
        <div className="relative">
          <Skeleton className="h-48 w-48 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full bg-background" />
          </div>
        </div>
        {/* Legend */}
        <div className="ml-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div
        className={cn("w-full p-4", className)}
        style={{ height: heightStyle }}
      >
        {/* Y-axis labels */}
        <div className="flex h-full">
          <div className="flex flex-col justify-between pr-4 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-10" />
            ))}
          </div>
          {/* Chart area */}
          <div className="flex-1 relative">
            <Skeleton className="absolute inset-0 rounded-lg opacity-30" />
            {/* Simulate line path with multiple segments */}
            <div className="absolute inset-0 flex items-end p-4">
              <div className="w-full h-[60%] relative">
                <Skeleton className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between pt-2 pl-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-12" />
          ))}
        </div>
      </div>
    );
  }

  // Default: bar chart
  return (
    <div
      className={cn("w-full p-4", className)}
      style={{ height: heightStyle }}
    >
      {/* Y-axis labels */}
      <div className="flex h-full">
        <div className="flex flex-col justify-between pr-4 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-10" />
          ))}
        </div>
        {/* Bars */}
        <div className="flex-1 flex items-end gap-4 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <Skeleton
                className="w-full rounded-t-md"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between pt-2 pl-14">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PageHeaderSkeleton
// Header with title and optional subtitle
// ============================================================================

interface PageHeaderSkeletonProps {
  /** Show subtitle line */
  showSubtitle?: boolean;
  /** Show breadcrumb */
  showBreadcrumb?: boolean;
  /** Show action buttons on the right */
  showActions?: boolean;
  className?: string;
}

export function PageHeaderSkeleton({
  showSubtitle = true,
  showBreadcrumb = false,
  showActions = false,
  className,
}: PageHeaderSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          {showSubtitle && <Skeleton className="h-5 w-96" />}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-9" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// GridSkeleton
// Responsive grid of card skeletons
// ============================================================================

interface GridSkeletonProps {
  /** Number of cards to display */
  count?: number;
  /** Grid columns configuration */
  columns?: 1 | 2 | 3 | 4;
  /** Type of card skeleton to render */
  cardType?: "comparison" | "simple" | "stat";
  className?: string;
}

export function GridSkeleton({
  count = 6,
  columns = 3,
  cardType = "simple",
  className,
}: GridSkeletonProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const renderCard = (index: number) => {
    if (cardType === "comparison") {
      return <ComparisonCardSkeleton key={index} />;
    }

    if (cardType === "stat") {
      return (
        <Card key={index}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      );
    }

    // Simple card
    return (
      <Card key={index}>
        <CardHeader>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, index) => renderCard(index))}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  type ComparisonCardSkeletonProps,
  type BudgetTableSkeletonProps,
  type ChartSkeletonProps,
  type PageHeaderSkeletonProps,
  type GridSkeletonProps,
};
