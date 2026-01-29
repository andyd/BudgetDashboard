import type { BudgetItem, BudgetHierarchy } from '@/types/budget';

/**
 * Budget item with children for hierarchical tree structure
 */
type BudgetItemWithChildren = BudgetItem & { children: BudgetItemWithChildren[] };

/**
 * Build a hierarchical tree structure from flat budget items
 * @param flatItems - Array of flat budget items with parentId references
 * @returns Hierarchical budget structure with nested children
 */
export function buildHierarchy(flatItems: BudgetItem[]): BudgetHierarchy {
  const itemMap = new Map<string, BudgetItemWithChildren>();
  const rootItems: BudgetItemWithChildren[] = [];

  // First pass: create map of all items with children arrays
  flatItems.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build parent-child relationships
  flatItems.forEach(item => {
    const itemWithChildren = itemMap.get(item.id);
    if (!itemWithChildren) return;

    if (item.parentId === null) {
      // Top-level item
      rootItems.push(itemWithChildren);
    } else {
      // Child item - add to parent's children
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(itemWithChildren);
      } else {
        // Parent not found, treat as root
        rootItems.push(itemWithChildren);
      }
    }
  });

  return {
    items: rootItems,
    totalAmount: rootItems.reduce((sum, item) => sum + item.amount, 0)
  };
}

/**
 * Find a budget item by its hierarchical path
 * @param hierarchy - Budget hierarchy to search
 * @param path - Array of item IDs representing the path from root to target
 * @returns The found budget item or null
 */
export function findItemByPath(
  hierarchy: BudgetHierarchy,
  path: string[]
): BudgetItem | null {
  if (path.length === 0) return null;

  let currentItems: BudgetItemWithChildren[] = hierarchy.items;
  let found: BudgetItemWithChildren | null = null;

  for (const id of path) {
    found = currentItems.find(item => item.id === id) || null;
    if (!found) return null;
    currentItems = found.children || [];
  }

  return found;
}

/**
 * Get all ancestor items for a given budget item
 * @param item - The budget item to find ancestors for
 * @param allItems - Complete flat array of all budget items
 * @returns Array of ancestor items from root to immediate parent
 */
export function getAncestors(
  item: BudgetItem,
  allItems: BudgetItem[]
): BudgetItem[] {
  const ancestors: BudgetItem[] = [];
  let currentParentId = item.parentId;

  while (currentParentId !== null) {
    const parent = allItems.find(i => i.id === currentParentId);
    if (!parent) break;
    ancestors.unshift(parent); // Add to beginning to maintain root->parent order
    currentParentId = parent.parentId;
  }

  return ancestors;
}

/**
 * Calculate percentage of parent amount for each item
 * @param items - Budget items to calculate percentages for
 * @param parentAmount - Total amount of the parent (or total budget)
 * @returns Items with updated percentage values
 */
export function calculatePercentages(
  items: BudgetItem[],
  parentAmount: number
): BudgetItem[] {
  if (parentAmount === 0) {
    return items.map(item => ({ ...item, percentage: 0 }));
  }

  return items.map(item => ({
    ...item,
    percentage: (item.amount / parentAmount) * 100
  }));
}

/**
 * Sort budget items by amount
 * @param items - Budget items to sort
 * @param desc - Sort in descending order (default: true)
 * @returns Sorted array of budget items
 */
export function sortByAmount(
  items: BudgetItem[],
  desc: boolean = true
): BudgetItem[] {
  return [...items].sort((a, b) => {
    return desc ? b.amount - a.amount : a.amount - b.amount;
  });
}

/**
 * Filter budget items by hierarchy level
 * @param items - Flat array of budget items
 * @param level - Hierarchy level to filter (0 = root, 1 = first children, etc.)
 * @returns Items at the specified level
 */
export function filterByLevel(
  items: BudgetItem[],
  level: number
): BudgetItem[] {
  return items.filter(item => item.level === level);
}

/**
 * Search budget items by name or code
 * @param items - Flat array of budget items to search
 * @param query - Search query string
 * @returns Items matching the search query
 */
export function searchItems(
  items: BudgetItem[],
  query: string
): BudgetItem[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase().trim();

  return items.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(lowerQuery);
    const codeMatch = item.code?.toLowerCase().includes(lowerQuery);
    return nameMatch || codeMatch;
  });
}

/**
 * Get all descendant items for a given budget item
 * @param itemId - ID of the parent item
 * @param allItems - Complete flat array of all budget items
 * @returns Array of all descendant items
 */
export function getDescendants(
  itemId: string,
  allItems: BudgetItem[]
): BudgetItem[] {
  const descendants: BudgetItem[] = [];
  const directChildren = allItems.filter(item => item.parentId === itemId);

  directChildren.forEach(child => {
    descendants.push(child);
    descendants.push(...getDescendants(child.id, allItems));
  });

  return descendants;
}

/**
 * Calculate the depth of the hierarchy tree
 * @param items - Flat array of budget items
 * @returns Maximum depth level in the hierarchy
 */
export function getMaxDepth(items: BudgetItem[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map(item => item.level)) + 1;
}

/**
 * Validate hierarchy consistency
 * @param items - Flat array of budget items
 * @returns Object with validation results and any errors found
 */
export function validateHierarchy(items: BudgetItem[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const itemIds = new Set(items.map(item => item.id));

  items.forEach(item => {
    // Check for orphaned items (parentId references non-existent parent)
    if (item.parentId !== null && !itemIds.has(item.parentId)) {
      errors.push(`Item "${item.name}" (${item.id}) references non-existent parent ${item.parentId}`);
    }

    // Check for circular references (simplified check)
    if (item.parentId === item.id) {
      errors.push(`Item "${item.name}" (${item.id}) references itself as parent`);
    }

    // Check level consistency
    if (item.parentId === null && item.level !== 0) {
      errors.push(`Root item "${item.name}" (${item.id}) has level ${item.level}, expected 0`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format currency amount for display
 * @param amount - Numeric amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 * @param percentage - Numeric percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  percentage: number,
  decimals: number = 1
): string {
  return `${percentage.toFixed(decimals)}%`;
}
