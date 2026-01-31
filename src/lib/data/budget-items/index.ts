import { DEPARTMENT_ITEMS, BudgetSpendingItem } from "./departments";

// Re-export interface
export type { BudgetSpendingItem };

// Combined array of all budget items
export const ALL_BUDGET_ITEMS: BudgetSpendingItem[] = [...DEPARTMENT_ITEMS];

// Get items filtered by tier
export function getItemsByTier(
  tier: BudgetSpendingItem["tier"],
): BudgetSpendingItem[] {
  return ALL_BUDGET_ITEMS.filter((item) => item.tier === tier);
}

// Get a single item by ID
export function getItemById(id: string): BudgetSpendingItem | undefined {
  return ALL_BUDGET_ITEMS.find((item) => item.id === id);
}

// Get child items by parent ID
export function getItemsByParent(parentId: string): BudgetSpendingItem[] {
  return ALL_BUDGET_ITEMS.filter((item) => item.parentId === parentId);
}
