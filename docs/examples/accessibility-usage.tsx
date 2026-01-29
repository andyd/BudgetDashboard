/**
 * Accessibility Usage Examples
 *
 * This file demonstrates how to use the accessibility utilities
 * in real-world scenarios throughout the Budget Dashboard.
 */

import React, { useEffect } from 'react';
import { BudgetItem } from '@/types/budget';
import {
  formatAmountForScreenReader,
  formatPercentageForScreenReader,
  formatYearOverYearChange,
  getAriaLabel,
  getComparisonAriaLabel,
  announceToScreenReader,
  announceNavigationChange,
  announceLoadingState,
  announceError,
  isActivationKey,
  moveFocusTo,
  ARIA_LABELS,
} from '@/lib/a11y';
import { VisuallyHidden } from '@/components/common/VisuallyHidden';

// ============================================================================
// Example 1: Accessible Currency Display
// ============================================================================

/**
 * Shows currency with both visual and screen-reader formats
 */
export function CurrencyDisplay({ amount }: { amount: number }) {
  return (
    <div>
      {/* Visual display - short format for sighted users */}
      <span aria-hidden="true">
        ${(amount / 1_000_000_000).toFixed(1)}B
      </span>

      {/* Screen reader version - full descriptive format */}
      <VisuallyHidden>
        {formatAmountForScreenReader(amount)}
      </VisuallyHidden>
    </div>
  );
}

// Usage:
// <CurrencyDisplay amount={800000000000} />
// Visual: "$800.0B"
// Screen reader: "800 billion dollars"

// ============================================================================
// Example 2: Accessible Progress Bar
// ============================================================================

/**
 * Progress bar with proper ARIA attributes
 */
export function BudgetProgressBar({
  label,
  percentage
}: {
  label: string;
  percentage: number
}) {
  return (
    <div>
      <label id={`progress-${label}`}>{label}</label>
      <div
        role="progressbar"
        aria-labelledby={`progress-${label}`}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={formatPercentageForScreenReader(percentage)}
        className="h-2 bg-gray-200 rounded"
      >
        {/* Visual bar */}
        <div
          aria-hidden="true"
          className="h-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage text */}
      <div className="text-sm mt-1">
        <span aria-hidden="true">{percentage}%</span>
        <VisuallyHidden>
          {formatPercentageForScreenReader(percentage)} of budget allocated
        </VisuallyHidden>
      </div>
    </div>
  );
}

// ============================================================================
// Example 3: Accessible Icon Button
// ============================================================================

/**
 * Icon-only button with proper labeling
 */
export function DeleteButton({
  onDelete,
  itemName
}: {
  onDelete: () => void;
  itemName: string
}) {
  return (
    <button
      onClick={onDelete}
      aria-label={`Delete ${itemName}`}
      className="p-2 hover:bg-red-100 rounded"
    >
      {/* Icon is decorative */}
      <TrashIcon aria-hidden="true" />

      {/* Accessible label */}
      <VisuallyHidden>
        Delete {itemName}
      </VisuallyHidden>
    </button>
  );
}

// ============================================================================
// Example 4: Accessible Data Card with Keyboard Support
// ============================================================================

/**
 * Clickable card that works with keyboard and screen readers
 */
export function AccessibleBudgetCard({
  item,
  onClick
}: {
  item: BudgetItem;
  onClick: () => void
}) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isActivationKey(event)) {
      event.preventDefault();
      onClick();
      announceToScreenReader(`Viewing ${item.name} details`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel(item)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="border rounded-lg p-4 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Visual content */}
      <h3 className="text-lg font-bold">{item.name}</h3>

      <div className="mt-2">
        <span aria-hidden="true">
          ${(item.amount / 1_000_000_000).toFixed(1)}B
        </span>
        <VisuallyHidden>
          {formatAmountForScreenReader(item.amount)}
        </VisuallyHidden>
      </div>

      {item.yearOverYearChange !== null && (
        <div className="mt-2">
          <span aria-hidden="true">
            {item.yearOverYearChange > 0 ? '↑' : '↓'}{' '}
            {Math.abs(item.yearOverYearChange)}%
          </span>
          <VisuallyHidden>
            {formatYearOverYearChange(item.yearOverYearChange)}
          </VisuallyHidden>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 5: Accessible Comparison Display
// ============================================================================

/**
 * Shows budget comparison with descriptive labels
 */
export function ComparisonDisplay({
  budgetAmount,
  comparisonUnit,
  unitAmount,
}: {
  budgetAmount: number;
  comparisonUnit: string;
  unitAmount: number;
}) {
  const multiple = (budgetAmount / unitAmount).toFixed(1);
  const ariaLabel = getComparisonAriaLabel(budgetAmount, comparisonUnit, unitAmount);

  return (
    <div
      className="flex items-center gap-4 p-4 border rounded"
      aria-label={ariaLabel}
    >
      <div>
        <div aria-hidden="true">
          ${(budgetAmount / 1_000_000_000).toFixed(1)}B
        </div>
        <VisuallyHidden>
          {formatAmountForScreenReader(budgetAmount)}
        </VisuallyHidden>
      </div>

      <div aria-hidden="true">=</div>

      <div>
        <div aria-hidden="true">
          {multiple}x {comparisonUnit}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Loading State with Announcements
// ============================================================================

/**
 * Component that announces loading state changes
 */
export function DataLoader({
  isLoading,
  data
}: {
  isLoading: boolean;
  data: any[]
}) {
  useEffect(() => {
    announceLoadingState(isLoading, 'budget data');
  }, [isLoading]);

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <div aria-hidden="true">Loading...</div>
        <VisuallyHidden>Loading budget data, please wait</VisuallyHidden>
      </div>
    );
  }

  return (
    <div>
      <VisuallyHidden>
        Budget data loaded. Showing {data.length} items.
      </VisuallyHidden>
      {/* Render data */}
    </div>
  );
}

// ============================================================================
// Example 7: Error Handling with Announcements
// ============================================================================

/**
 * Error display that announces to screen readers
 */
export function ErrorMessage({
  error,
  onRetry
}: {
  error: string;
  onRetry: () => void
}) {
  useEffect(() => {
    announceError(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 p-4 rounded"
    >
      <p className="text-red-800">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}

// ============================================================================
// Example 8: Navigation with Announcements
// ============================================================================

/**
 * Breadcrumb navigation that announces changes
 */
export function BudgetBreadcrumb({
  items,
  onNavigate
}: {
  items: BudgetItem[];
  onNavigate: (item: BudgetItem) => void
}) {
  const handleNavigate = (item: BudgetItem, childCount: number) => {
    onNavigate(item);
    announceNavigationChange(item, childCount);
  };

  return (
    <nav aria-label={ARIA_LABELS.BREADCRUMB_NAV}>
      <ol className="flex gap-2">
        {items.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <span aria-hidden="true"> / </span>}
            <button
              onClick={() => handleNavigate(item, 0)}
              className="text-blue-600 hover:underline"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ============================================================================
// Example 9: Skip Navigation Link
// ============================================================================

/**
 * Skip link for keyboard users
 */
export function SkipNavigation() {
  return (
    <VisuallyHidden as="a" focusable>
      <a
        href="#main-content"
        className="skip-link"
        onClick={() => moveFocusTo('#main-content', 'Skipped to main content')}
      >
        Skip to main content
      </a>
    </VisuallyHidden>
  );
}

// ============================================================================
// Example 10: Data Table with Accessible Headers
// ============================================================================

/**
 * Budget table with proper structure
 */
export function BudgetTable({ items }: { items: BudgetItem[] }) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        Budget items for fiscal year {items[0]?.fiscalYear}
      </caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Amount</th>
          <th scope="col">Percentage</th>
          <th scope="col">Change</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <th scope="row">{item.name}</th>
            <td>
              <span aria-hidden="true">
                ${(item.amount / 1_000_000_000).toFixed(1)}B
              </span>
              <VisuallyHidden>
                {formatAmountForScreenReader(item.amount)}
              </VisuallyHidden>
            </td>
            <td>
              {item.percentOfParent !== null && (
                <>
                  <span aria-hidden="true">
                    {item.percentOfParent.toFixed(1)}%
                  </span>
                  <VisuallyHidden>
                    {formatPercentageForScreenReader(item.percentOfParent)}
                  </VisuallyHidden>
                </>
              )}
            </td>
            <td>
              {item.yearOverYearChange !== null && (
                <>
                  <span aria-hidden="true">
                    {item.yearOverYearChange > 0 ? '+' : ''}
                    {item.yearOverYearChange}%
                  </span>
                  <VisuallyHidden>
                    {formatYearOverYearChange(item.yearOverYearChange)}
                  </VisuallyHidden>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

// Mock icon component for examples
function TrashIcon({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  return <span aria-hidden={ariaHidden}>🗑️</span>;
}
