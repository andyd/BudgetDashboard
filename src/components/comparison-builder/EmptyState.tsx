"use client";

import { DollarSign, Scale, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Callback when user clicks "Browse Spending" */
  onBrowseSpending?: () => void;
  /** Callback when user clicks "Browse Comparisons" */
  onBrowseComparisons?: () => void;
  /** Callback when user clicks a featured comparison */
  onSelectFeatured?: (comparisonId: string) => void;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Empty state shown before any selection in the Comparison Builder.
 * Displays a friendly prompt with two action cards to get started.
 */
export default function EmptyState({
  onBrowseSpending,
  onBrowseComparisons,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "py-12 px-4 sm:py-16 sm:px-6 lg:py-20",
        className,
      )}
    >
      {/* Header with icon */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-lg" />
          <div className="relative rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50">
            <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Friendly prompt */}
      <h2 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
        Ready to explore federal spending?
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground sm:text-lg">
        Select a spending item or comparison to see how government budgets
        translate into everyday terms.
      </p>

      {/* Action cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Browse Spending Card */}
        <button
          onClick={onBrowseSpending}
          className={cn(
            "group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-200",
            "border border-border bg-card hover:border-indigo-300 hover:shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
            "dark:hover:border-indigo-700",
          )}
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-indigo-950/30" />

          <div className="relative">
            <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/50">
              <DollarSign className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Browse Spending
            </h3>
            <p className="text-sm text-muted-foreground">
              Explore federal budget categories and pick a spending item to
              compare.
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        {/* Browse Comparisons Card */}
        <button
          onClick={onBrowseComparisons}
          className={cn(
            "group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-200",
            "border border-border bg-card hover:border-purple-300 hover:shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
            "dark:hover:border-purple-700",
          )}
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-950/30" />

          <div className="relative">
            <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 dark:bg-purple-900/50">
              <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Browse Comparisons
            </h3>
            <p className="text-sm text-muted-foreground">
              See pre-made comparisons that put spending into everyday
              perspective.
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="absolute bottom-4 right-4 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-purple-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Subtle hint */}
      <p className="mt-8 text-xs text-muted-foreground/60">
        Tip: Try comparing NASA&apos;s budget to everyday items like coffee or
        streaming subscriptions.
      </p>
    </div>
  );
}
