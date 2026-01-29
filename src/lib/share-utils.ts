/**
 * Share Utilities
 *
 * Utilities for generating shareable URLs and social media share links
 * for budget comparisons and budget drill-down paths.
 */

import type { ComparisonResult } from '@/types/comparison';

/**
 * Get the base URL for the application
 * Uses NEXT_PUBLIC_APP_URL in production, falls back to localhost in development
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use window.location.origin
    return window.location.origin;
  }

  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Encode comparison data into a URL-safe string
 * Format: {budgetItemId}:{unitId}
 *
 * @param budgetItemId - ID of the budget item
 * @param unitId - ID of the comparison unit
 * @returns URL-safe encoded comparison ID
 *
 * @example
 * encodeComparison('defense-2025', 'starbucks-latte')
 * // Returns: 'defense-2025:starbucks-latte'
 */
export function encodeComparison(budgetItemId: string, unitId: string): string {
  // Use encodeURIComponent to handle special characters
  const encodedBudgetId = encodeURIComponent(budgetItemId);
  const encodedUnitId = encodeURIComponent(unitId);
  return `${encodedBudgetId}:${encodedUnitId}`;
}

/**
 * Parse a comparison ID into its component parts
 *
 * @param id - Encoded comparison ID
 * @returns Object with budgetItemId and unitId, or null if invalid
 *
 * @example
 * parseComparisonId('defense-2025:starbucks-latte')
 * // Returns: { budgetItemId: 'defense-2025', unitId: 'starbucks-latte' }
 */
export function parseComparisonId(id: string): { budgetItemId: string; unitId: string } | null {
  try {
    const parts = id.split(':');
    if (parts.length !== 2) {
      return null;
    }

    const budgetItemId = decodeURIComponent(parts[0] || '');
    const unitId = decodeURIComponent(parts[1] || '');

    if (!budgetItemId || !unitId) {
      return null;
    }

    return { budgetItemId, unitId };
  } catch (error) {
    console.error('Error parsing comparison ID:', error);
    return null;
  }
}

/**
 * Generate a shareable URL for a comparison
 *
 * @param comparisonId - Encoded comparison ID (from encodeComparison)
 * @returns Full URL to the comparison page
 *
 * @example
 * generateComparisonUrl('defense-2025:starbucks-latte')
 * // Returns: 'https://example.com/compare/defense-2025:starbucks-latte'
 */
export function generateComparisonUrl(comparisonId: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/compare/${comparisonId}`;
}

/**
 * Generate a shareable URL for a budget drill-down path
 *
 * @param path - Array of budget item IDs representing the drill-down path
 * @returns Full URL to the budget path
 *
 * @example
 * generateBudgetUrl(['defense', 'military', 'navy'])
 * // Returns: 'https://example.com/budget/defense/military/navy'
 */
export function generateBudgetUrl(path: string[]): string {
  const baseUrl = getBaseUrl();
  const encodedPath = path.map(segment => encodeURIComponent(segment)).join('/');
  return `${baseUrl}/budget/${encodedPath}`;
}

/**
 * Generate share text for a comparison
 * Creates engaging, human-readable text suitable for social media
 *
 * @param comparison - Comparison result object
 * @returns Formatted share text
 *
 * @example
 * getShareText({
 *   unitCount: 160000000000,
 *   formatted: 'The Defense Budget equals 160 billion lattes',
 *   unit: { name: 'Starbucks Latte', ... },
 *   dollarAmount: 800000000000
 * })
 * // Returns: 'The Defense Budget equals 160 billion lattes 🤯'
 */
export function getShareText(comparison: ComparisonResult): string {
  const { formatted, unitCount } = comparison;

  // Add emoji based on the magnitude
  const emoji = unitCount > 1000000 ? ' 🤯' : ' 💡';

  return `${formatted}${emoji}`;
}

/**
 * Generate a Twitter/X share URL
 *
 * @param url - URL to share
 * @param text - Text to include in the tweet
 * @returns Twitter share URL
 *
 * @example
 * getTwitterShareUrl('https://example.com/compare/abc', 'Check this out!')
 * // Returns: 'https://twitter.com/intent/tweet?url=...&text=...'
 */
export function getTwitterShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({
    url: url,
    text: text,
    // Optional: add via parameter for attribution
    // via: 'YourTwitterHandle',
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate a Facebook share URL
 *
 * @param url - URL to share
 * @returns Facebook share URL
 *
 * @example
 * getFacebookShareUrl('https://example.com/compare/abc')
 * // Returns: 'https://www.facebook.com/sharer/sharer.php?u=...'
 */
export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({
    u: url,
  });

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate a LinkedIn share URL
 *
 * @param url - URL to share
 * @param title - Title for the share (optional)
 * @returns LinkedIn share URL
 *
 * @example
 * getLinkedInShareUrl('https://example.com/compare/abc', 'Budget Comparison')
 * // Returns: 'https://www.linkedin.com/sharing/share-offsite/?url=...'
 */
export function getLinkedInShareUrl(url: string, title?: string): string {
  const params = new URLSearchParams({
    url: url,
  });

  // Note: LinkedIn deprecated the title parameter, but we keep it for compatibility
  if (title) {
    params.set('title', title);
  }

  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Copy text to clipboard using the modern Clipboard API
 * Falls back to legacy execCommand for older browsers
 *
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 *
 * @example
 * await copyToClipboard('https://example.com/compare/abc')
 * // Returns: true (if successful)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Server-side or non-browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined') {
    console.warn('Clipboard API not available in this environment');
    return false;
  }

  try {
    // Modern Clipboard API (preferred)
    if (typeof navigator.clipboard !== 'undefined' && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea invisible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);

    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate all share URLs for a comparison at once
 * Convenience function that returns all social media share links
 *
 * @param comparisonId - Encoded comparison ID
 * @param comparison - Comparison result data for share text
 * @returns Object with all share URLs
 *
 * @example
 * getAllShareUrls('abc:def', comparisonResult)
 * // Returns: {
 * //   url: 'https://example.com/compare/abc:def',
 * //   text: 'The Defense Budget equals 160 billion lattes 🤯',
 * //   twitter: 'https://twitter.com/intent/tweet?...',
 * //   facebook: 'https://www.facebook.com/sharer/...',
 * //   linkedin: 'https://www.linkedin.com/sharing/...'
 * // }
 */
export function getAllShareUrls(
  comparisonId: string,
  comparison: ComparisonResult
): {
  url: string;
  text: string;
  twitter: string;
  facebook: string;
  linkedin: string;
} {
  const url = generateComparisonUrl(comparisonId);
  const text = getShareText(comparison);

  return {
    url,
    text,
    twitter: getTwitterShareUrl(url, text),
    facebook: getFacebookShareUrl(url),
    linkedin: getLinkedInShareUrl(url, comparison.unit.name),
  };
}
