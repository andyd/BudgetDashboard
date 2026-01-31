import { DEPARTMENT_ITEMS, BudgetSpendingItem } from "./departments";
import { DEFENSE_PROGRAMS } from "./programs-defense";
import { SOCIAL_PROGRAMS } from "./programs-social";
import { HOMELAND_PROGRAMS } from "./programs-homeland";
import { SCIENCE_PROGRAMS } from "./programs-science";
import { INFRASTRUCTURE_PROGRAMS } from "./programs-infrastructure";
import { VETERANS_PROGRAMS } from "./programs-veterans";
import { EDUCATION_PROGRAMS } from "./programs-education";
import { CURRENT_EVENT_ITEMS } from "./current-events";

// Re-export interface
export type { BudgetSpendingItem };

// Combined array of all budget items
export const ALL_BUDGET_ITEMS: BudgetSpendingItem[] = [
  ...DEPARTMENT_ITEMS,
  ...DEFENSE_PROGRAMS,
  ...SOCIAL_PROGRAMS,
  ...HOMELAND_PROGRAMS,
  ...SCIENCE_PROGRAMS,
  ...INFRASTRUCTURE_PROGRAMS,
  ...VETERANS_PROGRAMS,
  ...EDUCATION_PROGRAMS,
  ...CURRENT_EVENT_ITEMS,
];

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
