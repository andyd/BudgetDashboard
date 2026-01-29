/**
 * Accessibility Utilities for Federal Budget Dashboard
 *
 * Provides screen reader friendly formatting, ARIA labels, and live region announcements
 * to ensure the budget data visualizations are accessible to all users.
 */

import type { BudgetItem } from '@/types/budget';

// ============================================================================
// Constants
// ============================================================================

/**
 * Standard ARIA labels for common budget dashboard actions
 */
export const ARIA_LABELS = {
  // Navigation
  BREADCRUMB_NAV: 'Budget hierarchy navigation',
  BACK_TO_PARENT: 'Navigate back to parent budget category',
  DRILL_DOWN: 'View detailed breakdown',

  // Visualization
  TREEMAP: 'Budget allocation treemap visualization',
  TREEMAP_ITEM: (name: string) => `Budget item: ${name}`,
  PERCENTAGE_BAR: (percent: number) => `${percent}% of total budget`,

  // Comparison
  COMPARISON_CARD: 'Budget comparison card',
  FEATURED_CAROUSEL: 'Featured budget comparisons',
  SHARE_BUTTON: 'Share this comparison',

  // Data display
  AMOUNT_VALUE: 'Budget amount',
  PERCENT_VALUE: 'Percentage of parent budget',
  YEAR_OVER_YEAR: 'Year-over-year change',

  // Forms
  SEARCH_BUDGET: 'Search budget items',
  FILTER_BUDGET: 'Filter budget data',
  COMPARISON_BUILDER: 'Build your own budget comparison',
} as const;

/**
 * Accessible labels for budget item types
 */
export const BUDGET_TYPE_LABELS = {
  department: 'Department',
  agency: 'Agency',
  program: 'Program',
  lineItem: 'Line Item',
  root: 'Total Federal Budget',
} as const;


// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format dollar amounts for screen reader accessibility
 *
 * Converts large numbers into human-friendly format:
 * - 1500000000 → "1.5 billion dollars"
 * - 25000000 → "25 million dollars"
 * - 500000 → "500 thousand dollars"
 *
 * @param amount - Dollar amount to format
 * @param options - Formatting options
 * @returns Screen reader friendly string
 *
 * @example
 * formatAmountForScreenReader(1500000000)
 * // Returns: "1.5 billion dollars"
 */
export function formatAmountForScreenReader(
  amount: number,
  options: {
    includeCents?: boolean;
    includeSign?: boolean;
    abbreviate?: boolean;
  } = {}
): string {
  const {
    includeCents = false,
    includeSign = true,
    abbreviate = true,
  } = options;

  // Handle negative amounts
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const prefix = isNegative ? 'negative ' : '';

  // For very small amounts, return full precision
  if (absAmount < 1000) {
    const formatted = includeCents
      ? absAmount.toFixed(2)
      : Math.round(absAmount).toString();
    return `${prefix}${formatted}${includeSign ? ' dollars' : ''}`;
  }

  // Abbreviate large numbers for better readability
  if (abbreviate) {
    let value: number;
    let unit: string;

    if (absAmount >= 1_000_000_000_000) {
      value = absAmount / 1_000_000_000_000;
      unit = 'trillion';
    } else if (absAmount >= 1_000_000_000) {
      value = absAmount / 1_000_000_000;
      unit = 'billion';
    } else if (absAmount >= 1_000_000) {
      value = absAmount / 1_000_000;
      unit = 'million';
    } else {
      value = absAmount / 1_000;
      unit = 'thousand';
    }

    // Round to 1 decimal place for readability
    const roundedValue = Math.round(value * 10) / 10;
    const formattedValue = roundedValue % 1 === 0
      ? roundedValue.toFixed(0)
      : roundedValue.toFixed(1);

    return `${prefix}${formattedValue} ${unit}${includeSign ? ' dollars' : ''}`;
  }

  // Non-abbreviated format with commas
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  });

  return `${prefix}${formatted}${includeSign ? ' dollars' : ''}`;
}

/**
 * Format percentages for screen reader accessibility
 *
 * Provides contextual percentage descriptions:
 * - 45.5 → "45.5 percent"
 * - 0.1 → "less than 1 percent"
 * - 99.9 → "nearly 100 percent"
 *
 * @param percentage - Percentage value (0-100)
 * @param options - Formatting options
 * @returns Screen reader friendly string
 *
 * @example
 * formatPercentageForScreenReader(45.5)
 * // Returns: "45.5 percent"
 *
 * formatPercentageForScreenReader(0.1)
 * // Returns: "less than 1 percent"
 */
export function formatPercentageForScreenReader(
  percentage: number,
  options: {
    includeSign?: boolean;
    decimalPlaces?: number;
    contextual?: boolean;
  } = {}
): string {
  const {
    includeSign = false,
    decimalPlaces = 1,
    contextual = true,
  } = options;

  // Handle invalid percentages
  if (!Number.isFinite(percentage)) {
    return 'percentage not available';
  }

  const absPercentage = Math.abs(percentage);
  const isNegative = percentage < 0;

  // Contextual descriptions for very small/large percentages
  if (contextual) {
    if (absPercentage < 0.1) {
      return isNegative
        ? 'negligible decrease'
        : 'less than 0.1 percent';
    }
    if (absPercentage < 1 && absPercentage >= 0.1) {
      const formatted = absPercentage.toFixed(1);
      return isNegative
        ? `${formatted} percent decrease`
        : `less than 1 percent`;
    }
    if (absPercentage > 99 && absPercentage < 100) {
      return 'nearly 100 percent';
    }
    if (absPercentage >= 100) {
      return isNegative
        ? `${absPercentage.toFixed(0)} percent decrease`
        : 'all of budget';
    }
  }

  // Standard formatting
  const rounded = Number(absPercentage.toFixed(decimalPlaces));
  const formatted = rounded % 1 === 0
    ? rounded.toFixed(0)
    : rounded.toFixed(decimalPlaces);

  const prefix = isNegative && includeSign ? 'negative ' : '';
  return `${prefix}${formatted} percent`;
}

/**
 * Format year-over-year change for screen readers
 *
 * @param change - Percentage change value (positive = increase, negative = decrease)
 * @returns Descriptive change string
 *
 * @example
 * formatYearOverYearChange(5.5)
 * // Returns: "increased by 5.5 percent from previous year"
 *
 * formatYearOverYearChange(-2.3)
 * // Returns: "decreased by 2.3 percent from previous year"
 */
export function formatYearOverYearChange(change: number | null): string {
  if (change === null || !Number.isFinite(change)) {
    return 'no prior year data available';
  }

  if (change === 0) {
    return 'unchanged from previous year';
  }

  const absChange = Math.abs(change);
  const direction = change > 0 ? 'increased' : 'decreased';
  const formattedChange = formatPercentageForScreenReader(absChange, {
    contextual: false,
    decimalPlaces: 1,
  });

  return `${direction} by ${formattedChange} from previous year`;
}

/**
 * Determine the type of a budget item
 */
function getBudgetItemType(item: BudgetItem): keyof typeof BUDGET_TYPE_LABELS {
  if ('agencies' in item) return 'department';
  if ('programs' in item) return 'agency';
  if ('lineItems' in item) return 'program';
  if ('description' in item) return 'lineItem';
  return 'root';
}

/**
 * Generate comprehensive ARIA label for a budget item
 *
 * Creates a complete description suitable for screen readers that includes:
 * - Item type and name
 * - Budget amount
 * - Percentage of parent (if applicable)
 * - Year-over-year change (if applicable)
 *
 * @param budgetItem - Any budget item from the hierarchy
 * @returns Comprehensive ARIA label string
 *
 * @example
 * getAriaLabel(departmentItem)
 * // Returns: "Department: Defense. Budget: 800 billion dollars.
 * //           15 percent of total budget. Increased by 3.2 percent
 * //           from previous year."
 */
export function getAriaLabel(budgetItem: BudgetItem): string {
  const type = getBudgetItemType(budgetItem);
  const typeLabel = BUDGET_TYPE_LABELS[type];

  // Base description
  const parts: string[] = [
    `${typeLabel}: ${budgetItem.name}`,
    `Budget: ${formatAmountForScreenReader(budgetItem.amount)}`,
  ];

  // Add percentage of parent if available
  if (budgetItem.percentOfParent !== null && budgetItem.percentOfParent !== undefined) {
    parts.push(
      `${formatPercentageForScreenReader(budgetItem.percentOfParent)} of ${
        type === 'department' ? 'total budget' : 'parent category'
      }`
    );
  }

  // Add year-over-year change if available
  if (budgetItem.yearOverYearChange !== null && budgetItem.yearOverYearChange !== undefined) {
    parts.push(formatYearOverYearChange(budgetItem.yearOverYearChange));
  }

  return parts.join('. ') + '.';
}

/**
 * Generate ARIA label for a budget comparison
 *
 * @param budgetAmount - Budget amount being compared
 * @param comparisonUnit - What it's being compared to
 * @param unitAmount - Amount of the comparison unit
 * @returns Descriptive comparison label
 *
 * @example
 * getComparisonAriaLabel(800000000000, "NASA annual budget", 25000000000)
 * // Returns: "800 billion dollars equals 32 times the NASA annual budget"
 */
export function getComparisonAriaLabel(
  budgetAmount: number,
  comparisonUnit: string,
  unitAmount: number
): string {
  const formattedBudget = formatAmountForScreenReader(budgetAmount);
  const multiple = budgetAmount / unitAmount;

  if (multiple < 1) {
    const inverse = 1 / multiple;
    const formattedInverse = inverse.toFixed(1);
    return `${formattedBudget} equals ${formattedInverse} times less than ${comparisonUnit}`;
  }

  const formattedMultiple = multiple.toFixed(1);
  return `${formattedBudget} equals ${formattedMultiple} times the ${comparisonUnit}`;
}

// ============================================================================
// Live Region Announcements
// ============================================================================

/**
 * ARIA live region element (created once and reused)
 */
let liveRegion: HTMLElement | null = null;

/**
 * Create the ARIA live region if it doesn't exist
 */
function ensureLiveRegion(): HTMLElement {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Use CSS class for screen-reader-only positioning
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}

/**
 * Announce a message to screen readers via ARIA live region
 *
 * Uses a polite live region to announce dynamic content changes
 * without interrupting the user's current screen reader output.
 *
 * @param message - Message to announce
 * @param priority - Announcement priority ('polite' or 'assertive')
 *
 * @example
 * // Announce when user drills down into a budget category
 * announceToScreenReader("Loaded Department of Defense budget details")
 *
 * // Announce urgent error
 * announceToScreenReader("Error loading budget data", "assertive")
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') {
    return; // Skip on server-side rendering
  }

  const region = ensureLiveRegion();

  // Update aria-live attribute based on priority
  region.setAttribute('aria-live', priority);

  // Clear existing content first to ensure announcement fires
  region.textContent = '';

  // Use setTimeout to ensure the clear happens before the new message
  setTimeout(() => {
    region.textContent = message;

    // Clear after 5 seconds to prevent stale announcements
    setTimeout(() => {
      if (region.textContent === message) {
        region.textContent = '';
      }
    }, 5000);
  }, 100);
}

/**
 * Announce navigation changes in the budget hierarchy
 *
 * @param item - Budget item that was navigated to
 * @param childCount - Number of child items
 */
export function announceNavigationChange(item: BudgetItem, childCount: number): void {
  const type = getBudgetItemType(item);
  const typeLabel = BUDGET_TYPE_LABELS[type];
  const amount = formatAmountForScreenReader(item.amount);

  const childLabel = childCount === 1 ? 'sub-item' : 'sub-items';
  const message = `Viewing ${typeLabel}: ${item.name}. Budget: ${amount}. Contains ${childCount} ${childLabel}.`;

  announceToScreenReader(message);
}

/**
 * Announce data loading states
 */
export function announceLoadingState(isLoading: boolean, context: string): void {
  if (isLoading) {
    announceToScreenReader(`Loading ${context}`);
  } else {
    announceToScreenReader(`${context} loaded`);
  }
}

/**
 * Announce errors to screen readers
 */
export function announceError(error: string): void {
  announceToScreenReader(`Error: ${error}`, 'assertive');
}

// ============================================================================
// Keyboard Navigation Helpers
// ============================================================================

/**
 * Check if a keyboard event is an activation key (Enter or Space)
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

/**
 * Check if a keyboard event is an arrow key
 */
export function isArrowKey(event: React.KeyboardEvent): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key);
}

/**
 * Get the direction from an arrow key event
 */
export function getArrowDirection(event: React.KeyboardEvent): 'up' | 'down' | 'left' | 'right' | null {
  switch (event.key) {
    case 'ArrowUp': return 'up';
    case 'ArrowDown': return 'down';
    case 'ArrowLeft': return 'left';
    case 'ArrowRight': return 'right';
    default: return null;
  }
}

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Move focus to an element and announce it to screen readers
 *
 * @param selector - CSS selector or element reference
 * @param announcement - Optional message to announce
 */
export function moveFocusTo(
  selector: string | HTMLElement,
  announcement?: string
): void {
  const element = typeof selector === 'string'
    ? document.querySelector<HTMLElement>(selector)
    : selector;

  if (element) {
    element.focus();
    if (announcement) {
      announceToScreenReader(announcement);
    }
  }
}

/**
 * Trap focus within a container (for modals, dialogs)
 * Returns a cleanup function to remove event listeners
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}
