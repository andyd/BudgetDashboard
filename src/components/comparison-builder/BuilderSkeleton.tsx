"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BuilderSkeletonProps {
  className?: string;
}

/**
 * Loading skeleton for the comparison builder interface.
 * Displays placeholder shapes that match the actual builder layout:
 * - Two selector inputs (spending and unit)
 * - Result display card with gradient background
 * - Alternatives panel with two columns
 * - Share buttons row
 */
export default function BuilderSkeleton({ className }: BuilderSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Selectors area */}
      <div className="space-y-4">
        {/* Spending selector */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Select input */}
        </div>

        {/* "could fund" text placeholder */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Unit selector */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Select input */}
        </div>
      </div>

      {/* Result area - matches ComparisonResult gradient card layout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 p-8 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700">
        {/* Background decoration placeholders */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

        <div className="relative z-10 space-y-4 text-center">
          {/* Icon placeholder */}
          <Skeleton className="mx-auto h-12 w-12 rounded-lg" />

          {/* Main headline placeholders */}
          <div className="space-y-3">
            {/* Spending name */}
            <Skeleton className="mx-auto h-8 w-48" />
            {/* Equals sign */}
            <Skeleton className="mx-auto h-6 w-8" />
            {/* Result number */}
            <Skeleton className="mx-auto h-12 w-32" />
            {/* Unit name */}
            <Skeleton className="mx-auto h-6 w-36" />
          </div>

          {/* Subline with amounts */}
          <Skeleton className="mx-auto h-5 w-56" />

          {/* Divider */}
          <Skeleton className="mx-auto h-px w-24" />

          {/* Source citation */}
          <Skeleton className="mx-auto h-4 w-40" />
        </div>
      </div>

      {/* Alternatives panel - two-column grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column: Try Other Spending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Section header */}
          <Skeleton className="mb-4 h-4 w-32" />

          {/* Alternative items */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`spending-${i}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>

          {/* Browse all link */}
          <Skeleton className="mt-4 h-4 w-20" />
        </div>

        {/* Right column: Try Other Comparisons */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Section header */}
          <Skeleton className="mb-4 h-4 w-40" />

          {/* Alternative items */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`unit-${i}`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
              >
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>

          {/* Browse all link */}
          <Skeleton className="mt-4 h-4 w-20" />
        </div>
      </div>

      {/* Share buttons row */}
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}
