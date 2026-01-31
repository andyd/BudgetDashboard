// Comparison Builder Types

export type UnitCategory =
  | "food"
  | "entertainment"
  | "transportation"
  | "household"
  | "technology"
  | "subscription"
  | "experience"
  | "luxury";

export type SpendingTier = "low" | "medium" | "high" | "very-high";

export interface ComparisonUnit {
  id: string;
  name: string;
  namePlural: string;
  category: UnitCategory;
  averageCost: number;
  icon?: string;
  description?: string;
}

export interface BudgetSpendingItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  tier: SpendingTier;
  date?: Date;
  recurring?: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
}

export interface ComparisonResult {
  spendingItem: BudgetSpendingItem;
  comparisonUnit: ComparisonUnit;
  quantity: number;
  remainder: number;
  percentageOfUnit: number;
}

export interface FormattedComparison {
  result: ComparisonResult;
  shortText: string;
  longText: string;
  impactStatement: string;
  emoji?: string;
}
