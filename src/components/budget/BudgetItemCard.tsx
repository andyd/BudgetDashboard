/**
 * BudgetItemCard Component
 *
 * Displays a budget item with full accessibility support.
 * Demonstrates proper usage of accessibility utilities.
 */

'use client';

import React from 'react';
import { BudgetItem } from '@/types/budget';
import {
  formatAmountForScreenReader,
  formatPercentageForScreenReader,
  formatYearOverYearChange,
  getAriaLabel,
  ARIA_LABELS,
} from '@/lib/a11y';
import { VisuallyHidden } from '@/components/common/VisuallyHidden';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

export interface BudgetItemCardProps {
  item: BudgetItem;
  onClick?: () => void;
  showPercentage?: boolean;
  showYearOverYear?: boolean;
}

/**
 * Format currency for visual display (abbreviated)
 */
function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

/**
 * Get icon and color for year-over-year change
 */
function getChangeIndicator(change: number | null) {
  if (change === null || change === 0) {
    return {
      icon: MinusIcon,
      className: 'state-badge-neutral',
      label: 'no change',
    };
  }

  if (change > 0) {
    return {
      icon: ArrowUpIcon,
      className: 'state-badge-positive',
      label: 'increase',
    };
  }

  return {
    icon: ArrowDownIcon,
    className: 'state-badge-negative',
    label: 'decrease',
  };
}

export function BudgetItemCard({
  item,
  onClick,
  showPercentage = true,
  showYearOverYear = true,
}: BudgetItemCardProps) {
  const changeIndicator = getChangeIndicator(item.yearOverYearChange);
  const ChangeIcon = changeIndicator.icon;

  // Comprehensive ARIA label for the entire card
  const cardAriaLabel = getAriaLabel(item);

  return (
    <Card
      className="comparison-card cursor-pointer focus-visible-only"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={cardAriaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardHeader className="comparison-card-header">
        <CardTitle className="flex items-start justify-between gap-4">
          <span className="text-lg font-semibold">{item.name}</span>

          {/* Year-over-year badge with screen reader text */}
          {showYearOverYear && item.yearOverYearChange !== null && (
            <Badge className={`state-badge ${changeIndicator.className}`}>
              <ChangeIcon className="w-3 h-3" aria-hidden="true" />
              <span aria-hidden="true">
                {Math.abs(item.yearOverYearChange).toFixed(1)}%
              </span>
              <VisuallyHidden>
                {formatYearOverYearChange(item.yearOverYearChange)}
              </VisuallyHidden>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Budget Amount */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            Budget Amount
          </div>
          <div className="comparison-value" aria-label={ARIA_LABELS.AMOUNT_VALUE}>
            {/* Visual display */}
            <span aria-hidden="true">{formatCurrency(item.amount)}</span>

            {/* Screen reader friendly version */}
            <VisuallyHidden>
              {formatAmountForScreenReader(item.amount)}
            </VisuallyHidden>
          </div>
        </div>

        {/* Percentage of Parent Budget */}
        {showPercentage && item.percentOfParent !== null && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Percentage of Parent Budget
            </div>

            {/* Visual progress bar */}
            <div
              className="relative"
              role="presentation"
              aria-hidden="true"
            >
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(item.percentOfParent, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-right text-sm font-medium">
                {item.percentOfParent.toFixed(1)}%
              </div>
            </div>

            {/* Screen reader friendly description */}
            <VisuallyHidden>
              {formatPercentageForScreenReader(item.percentOfParent)} of parent budget
            </VisuallyHidden>
          </div>
        )}

        {/* Fiscal Year */}
        <div className="text-xs text-muted-foreground">
          Fiscal Year {item.fiscalYear}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example: Accessible Budget Grid
 *
 * Shows how to use BudgetItemCard in a grid with proper landmarks
 */
export function BudgetItemGrid({
  items,
  onItemClick,
  title = 'Budget Items',
}: {
  items: BudgetItem[];
  onItemClick?: (item: BudgetItem) => void;
  title?: string;
}) {
  return (
    <section aria-labelledby="budget-grid-heading">
      {/* Visible heading */}
      <h2 id="budget-grid-heading" className="text-2xl font-bold mb-6">
        {title}
      </h2>

      {/* Screen reader announcement */}
      <VisuallyHidden>
        Grid of {items.length} budget items. Use arrow keys to navigate.
      </VisuallyHidden>

      {/* Grid container */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
      >
        {items.map((item) => (
          <div key={item.id} role="listitem">
            <BudgetItemCard
              item={item}
              onClick={() => onItemClick?.(item)}
            />
          </div>
        ))}
      </div>

      {/* Empty state with proper accessibility */}
      {items.length === 0 && (
        <div
          className="text-center py-12 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <p>No budget items to display.</p>
          <VisuallyHidden>Budget items list is empty</VisuallyHidden>
        </div>
      )}
    </section>
  );
}
