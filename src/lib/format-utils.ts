/**
 * Formatting utilities for currency, counts, and number display
 */

/**
 * Format currency with smart compact notation
 * @example
 * formatCurrency(1_200_000_000) // "$1.2B"
 * formatCurrency(45_000_000) // "$45M"
 * formatCurrency(8500) // "$8,500"
 * formatCurrency(1234.56) // "$1,235"
 * formatCurrency(-500_000) // "-$500K"
 */
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (absAmount >= 1_000_000_000) {
    const value = absAmount / 1_000_000_000;
    return `${sign}$${formatCompactValue(value)}B`;
  }
  if (absAmount >= 1_000_000) {
    const value = absAmount / 1_000_000;
    return `${sign}$${formatCompactValue(value)}M`;
  }
  if (absAmount >= 10_000) {
    const value = absAmount / 1_000;
    return `${sign}$${formatCompactValue(value)}K`;
  }

  return `${sign}$${formatWithCommas(Math.round(absAmount))}`;
}

/**
 * Format count with smart compact notation
 * @example
 * formatCount(1_120_000) // "1.12M"
 * formatCount(194_000) // "194K"
 * formatCount(2941) // "2,941"
 * formatCount(500) // "500"
 * formatCount(-50_000) // "-50K"
 */
export function formatCount(count: number): string {
  const absCount = Math.abs(count);
  const sign = count < 0 ? "-" : "";

  if (absCount >= 1_000_000_000) {
    const value = absCount / 1_000_000_000;
    return `${sign}${formatCompactValue(value)}B`;
  }
  if (absCount >= 1_000_000) {
    const value = absCount / 1_000_000;
    return `${sign}${formatCompactValue(value)}M`;
  }
  if (absCount >= 10_000) {
    const value = absCount / 1_000;
    return `${sign}${formatCompactValue(value)}K`;
  }

  return `${sign}${formatWithCommas(Math.round(absCount))}`;
}

/**
 * Smart compact formatting for any number
 * @example
 * formatCompact(1_500_000_000) // "1.5B"
 * formatCompact(750_000) // "750K"
 * formatCompact(1234) // "1,234"
 * formatCompact(50) // "50"
 */
export function formatCompact(n: number): string {
  const absN = Math.abs(n);
  const sign = n < 0 ? "-" : "";

  if (absN >= 1_000_000_000) {
    const value = absN / 1_000_000_000;
    return `${sign}${formatCompactValue(value)}B`;
  }
  if (absN >= 1_000_000) {
    const value = absN / 1_000_000;
    return `${sign}${formatCompactValue(value)}M`;
  }
  if (absN >= 1_000) {
    const value = absN / 1_000;
    return `${sign}${formatCompactValue(value)}K`;
  }

  return `${sign}${Math.round(absN)}`;
}

/**
 * Format a number with comma separators
 * @example
 * formatWithCommas(1120000) // "1,120,000"
 * formatWithCommas(1234.56) // "1,234.56"
 * formatWithCommas(500) // "500"
 * formatWithCommas(-9999) // "-9,999"
 */
export function formatWithCommas(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Pluralize a word based on count
 * @example
 * pluralize(1, 'item') // "item"
 * pluralize(5, 'item') // "items"
 * pluralize(2, 'category', 'categories') // "categories"
 * pluralize(0, 'match', 'matches') // "matches"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  if (count === 1) {
    return singular;
  }
  return plural ?? `${singular}s`;
}

/**
 * Helper to format compact values (removes trailing zeros)
 * @example
 * formatCompactValue(1.20) // "1.2"
 * formatCompactValue(45.00) // "45"
 * formatCompactValue(1.23) // "1.23"
 */
function formatCompactValue(value: number): string {
  // Use up to 2 decimal places, but remove trailing zeros
  const formatted = value.toFixed(2);
  return formatted.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
