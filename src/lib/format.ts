/**
 * Formatting utilities for consistent data presentation across the app
 */

interface CurrencyOptions {
  /** Show cents/decimals (default: false for large numbers, true for small) */
  showCents?: boolean;
  /** Compact notation for large numbers (default: false) */
  compact?: boolean;
  /** Currency symbol (default: '$') */
  symbol?: string;
  /** Show + sign for positive numbers (default: false) */
  showSign?: boolean;
}

/**
 * Format a number as currency with smart handling of large values
 * @example
 * formatCurrency(1234567890) // "$1,234,567,890"
 * formatCurrency(1234567890, { compact: true }) // "$1.23B"
 * formatCurrency(99.99, { showCents: true }) // "$99.99"
 * formatCurrency(50, { showSign: true }) // "+$50"
 */
export function formatCurrency(
  amount: number,
  options: CurrencyOptions = {}
): string {
  const {
    showCents = Math.abs(amount) < 1000,
    compact = false,
    symbol = '$',
    showSign = false,
  } = options;

  const sign = showSign && amount > 0 ? '+' : '';
  const absAmount = Math.abs(amount);

  if (compact) {
    return `${sign}${symbol}${formatCompact(amount)}`;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(absAmount);

  const negativeSign = amount < 0 ? '-' : '';
  return `${negativeSign}${sign}${symbol}${formatted}`;
}

/**
 * Format a number with thousands separators
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(99.99) // "99.99"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Format a number as a percentage
 * @example
 * formatPercent(0.1234) // "12.34%"
 * formatPercent(0.1234, 0) // "12%"
 * formatPercent(1.5, 1) // "150.0%"
 */
export function formatPercent(n: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Format large numbers in compact notation (B, M, K)
 * @example
 * formatCompact(1234567890) // "1.23B"
 * formatCompact(456789) // "457K"
 * formatCompact(1234) // "1.23K"
 * formatCompact(999) // "999"
 */
export function formatCompact(n: number): string {
  const absN = Math.abs(n);
  const sign = n < 0 ? '-' : '';

  if (absN >= 1_000_000_000) {
    return `${sign}${(absN / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (absN >= 1_000_000) {
    return `${sign}${(absN / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (absN >= 1_000) {
    return `${sign}${(absN / 1_000).toFixed(2).replace(/\.00$/, '')}K`;
  }
  return `${sign}${absN}`;
}

/**
 * Format a date in a readable format
 * @example
 * formatDate(new Date('2024-01-15')) // "Jan 15, 2024"
 * formatDate('2024-01-15') // "Jan 15, 2024"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a date as relative time
 * @example
 * formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)) // "2 days ago"
 * formatRelativeTime(new Date(Date.now() + 1000 * 60 * 60 * 3)) // "in 3 hours"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  const units: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (absSeconds >= secondsInUnit) {
      const value = Math.floor(absSeconds / secondsInUnit);
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(
        diffInSeconds < 0 ? value : -value,
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }

  return 'just now';
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
  plural?: string
): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

/**
 * Format a number with ordinal suffix
 * @example
 * formatOrdinal(1) // "1st"
 * formatOrdinal(2) // "2nd"
 * formatOrdinal(3) // "3rd"
 * formatOrdinal(21) // "21st"
 */
export function formatOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = n % 100;
  return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0] || 'th');
}

/**
 * Format bytes to human-readable size
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1234567) // "1.18 MB"
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 * @example
 * truncate('Hello World', 8) // "Hello..."
 * truncate('Short', 10) // "Short"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
