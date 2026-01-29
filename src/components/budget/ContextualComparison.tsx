/**
 * Contextual Comparison Component
 *
 * Shows an automatic, inline comparison for a budget item.
 * Picks the most striking comparison based on an impact scoring algorithm.
 * Displays as a small, inline element with a link to see all comparisons.
 *
 * @example
 * ```tsx
 * // Default variant - inline badge with icon
 * <ContextualComparison budgetItem={budgetItem} />
 *
 * // Compact variant - minimal text only
 * <ContextualComparison budgetItem={budgetItem} variant="compact" />
 *
 * // Card variant - full card with icon and description
 * <ContextualComparison budgetItem={budgetItem} variant="card" />
 *
 * // Without link to full comparison page
 * <ContextualComparison budgetItem={budgetItem} showLink={false} />
 * ```
 *
 * The component automatically:
 * - Calculates all possible unit comparisons for the budget amount
 * - Scores each comparison based on impact/relatability (whole numbers, relatable scales)
 * - Selects and displays the most striking comparison
 * - Shows unit icon/description when available
 */

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';
import type { BudgetItem } from '@/types/budget';
import type { ComparisonUnit } from '@/types/comparison';
import { mockUnits } from '@/lib/mock-data/units';
import { cn } from '@/lib/utils';

interface ContextualComparisonProps {
  /** The budget item to compare */
  budgetItem: BudgetItem;

  /** Optional list of other budget items for cross-budget comparisons */
  allBudgetItems?: BudgetItem[];

  /** Display variant */
  variant?: 'default' | 'compact' | 'card';

  /** Optional custom className */
  className?: string;

  /** Whether to show the "See all comparisons" link */
  showLink?: boolean;
}

interface ComparisonResult {
  unit: ComparisonUnit;
  count: number;
  score: number;
  formatted: string;
}

/**
 * Calculate an impact score for how striking/interesting a comparison is
 */
function calculateImpactScore(budgetAmount: number, unit: ComparisonUnit, count: number): number {
  let score = 0;

  // Prefer whole numbers
  const isWholeNumber = Math.abs(count - Math.round(count)) < 0.1;
  if (isWholeNumber) score += 20;

  // Prefer counts between 1 and 1000 (most relatable)
  if (count >= 1 && count <= 10) score += 30;
  else if (count > 10 && count <= 100) score += 20;
  else if (count > 100 && count <= 1000) score += 10;

  // Prefer units with similar magnitude (more striking)
  const ratio = budgetAmount / unit.costPerUnit;
  if (ratio >= 0.5 && ratio <= 2) score += 30; // Very similar amounts
  else if (ratio >= 2 && ratio <= 10) score += 20; // Same order of magnitude
  else if (ratio >= 10 && ratio <= 100) score += 10; // One order of magnitude

  // Category bonuses (favor relatable items)
  if (unit.category === 'everyday') score += 15;
  if (unit.category === 'misc') score += 10;
  if (unit.category === 'vehicles') score += 8;

  return score;
}

/**
 * Format a comparison into readable text
 */
function formatComparison(count: number, unit: ComparisonUnit): string {
  const formattedCount = Number.isInteger(count)
    ? count.toLocaleString()
    : count.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const unitName = count === 1 ? unit.nameSingular : unit.name;

  if (count < 1) {
    const percentage = Math.round(count * 100);
    return `This is ${percentage}% of ${unit.nameSingular}`;
  }

  if (count >= 1000000) {
    const millions = (count / 1000000).toFixed(1);
    return `This equals ${millions}M ${unitName}`;
  }

  if (count >= 1000) {
    const thousands = (count / 1000).toFixed(1);
    return `This equals ${thousands}K ${unitName}`;
  }

  return `This equals ${formattedCount} ${unitName}`;
}

/**
 * Find the best comparison for a budget item
 */
function findBestComparison(budgetItem: BudgetItem): ComparisonResult | null {
  const results: ComparisonResult[] = [];

  for (const unit of mockUnits) {
    const count = budgetItem.amount / unit.costPerUnit;

    // Skip if the conversion results in very small or very large numbers
    if (count < 0.01 || count > 10000000) continue;

    const score = calculateImpactScore(budgetItem.amount, unit, count);
    const formatted = formatComparison(count, unit);

    results.push({
      unit,
      count,
      score,
      formatted
    });
  }

  // Sort by score and return the best
  results.sort((a, b) => b.score - a.score);
  return results[0] ?? null;
}

export function ContextualComparison({
  budgetItem,
  variant = 'default',
  className,
  showLink = true
}: ContextualComparisonProps) {
  // Find the best automatic comparison
  const bestComparison = useMemo<ComparisonResult | null>(() => {
    return findBestComparison(budgetItem);
  }, [budgetItem]);

  // If no good comparison found, don't render anything
  if (!bestComparison) {
    return null;
  }

  // Render different variants
  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <Scale className="h-3 w-3" />
        <span>{bestComparison.formatted}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent/5',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {bestComparison.unit.icon ? (
            <div className="text-2xl">{bestComparison.unit.icon}</div>
          ) : (
            <div className="mt-0.5 rounded-full bg-primary/10 p-2">
              <Scale className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-tight">{bestComparison.formatted}</p>
            {bestComparison.unit.description && (
              <p className="text-xs text-muted-foreground">
                {bestComparison.unit.description}
              </p>
            )}
            {showLink && (
              <Link
                href={`/compare/${budgetItem.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                See all comparisons
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm', className)}>
      {bestComparison.unit.icon ? (
        <span className="mt-0.5 text-lg flex-shrink-0">{bestComparison.unit.icon}</span>
      ) : (
        <Scale className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
      )}
      <div className="flex-1">
        <p className="font-medium text-foreground">{bestComparison.formatted}</p>
        {bestComparison.unit.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {bestComparison.unit.description}
          </p>
        )}
        {showLink && (
          <Link
            href={`/compare/${budgetItem.id}`}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            See all comparisons
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
