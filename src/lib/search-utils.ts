/**
 * Search and filter utilities for budget items
 */

/**
 * Base interface for searchable items
 */
interface Searchable {
  name: string;
  amount?: number;
  category?: string;
  tier?: string | number;
}

/**
 * Fuzzy search items by name
 * Matches substrings and handles case-insensitivity
 * @param items - Array of items to search
 * @param query - Search query string
 * @returns Filtered array of items matching the query
 */
export function searchItems<T extends Searchable>(
  items: T[],
  query: string,
): T[] {
  if (!query || !query.trim()) {
    return items;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  return items.filter((item) => {
    const normalizedName = item.name.toLowerCase();

    // Check if all query words appear in the name (fuzzy matching)
    return queryWords.every((word) => normalizedName.includes(word));
  });
}

/**
 * Filter items by category
 * @param items - Array of items to filter
 * @param category - Category to filter by (case-insensitive)
 * @returns Filtered array of items in the specified category
 */
export function filterByCategory<T extends Searchable>(
  items: T[],
  category: string,
): T[] {
  if (!category || !category.trim()) {
    return items;
  }

  const normalizedCategory = category.toLowerCase().trim();

  return items.filter(
    (item) => item.category?.toLowerCase() === normalizedCategory,
  );
}

/**
 * Filter items by tier
 * @param items - Array of items to filter
 * @param tier - Tier to filter by (string or number)
 * @returns Filtered array of items in the specified tier
 */
export function filterByTier<T extends Searchable>(
  items: T[],
  tier: string | number,
): T[] {
  const normalizedTier =
    typeof tier === "string" ? tier.toLowerCase().trim() : tier;

  return items.filter((item) => {
    if (item.tier === undefined || item.tier === null) {
      return false;
    }

    if (typeof item.tier === "number" && typeof normalizedTier === "number") {
      return item.tier === normalizedTier;
    }

    return (
      String(item.tier).toLowerCase() === String(normalizedTier).toLowerCase()
    );
  });
}

/**
 * Sort direction type
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort items by amount
 * @param items - Array of items to sort
 * @param direction - Sort direction ('asc' for ascending, 'desc' for descending)
 * @returns Sorted array of items
 */
export function sortByAmount<T extends Searchable>(
  items: T[],
  direction: SortDirection = "desc",
): T[] {
  return [...items].sort((a, b) => {
    const amountA = a.amount ?? 0;
    const amountB = b.amount ?? 0;

    return direction === "asc" ? amountA - amountB : amountB - amountA;
  });
}

/**
 * Sort items by name alphabetically
 * @param items - Array of items to sort
 * @returns Sorted array of items (ascending alphabetical order)
 */
export function sortByName<T extends Searchable>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

/**
 * Group items by category
 * @param items - Array of items to group
 * @returns Record mapping category names to arrays of items
 */
export function groupByCategory<T extends Searchable>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const category = item.category ?? "uncategorized";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(item);

    return groups;
  }, {});
}

/**
 * Group items by tier
 * @param items - Array of items to group
 * @returns Record mapping tier values to arrays of items
 */
export function groupByTier<T extends Searchable>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const tier =
      item.tier !== undefined && item.tier !== null
        ? String(item.tier)
        : "unassigned";

    if (!groups[tier]) {
      groups[tier] = [];
    }

    groups[tier].push(item);

    return groups;
  }, {});
}
