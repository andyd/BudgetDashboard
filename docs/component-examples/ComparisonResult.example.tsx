/**
 * Example usage of ComparisonResult component
 *
 * This file demonstrates how to use the ComparisonResult component
 * with sample data.
 */

import { ComparisonResult } from "./ComparisonResult";
import type { ComparisonResult as ComparisonResultType } from "@/types/comparison";

// Example comparison result data
const exampleResult: ComparisonResultType = {
  unitCount: 15384.6,
  formatted: "$1,000,000,000 = 15,384.6 Tesla Model 3s",
  unit: {
    id: "tesla-model-3",
    name: "Tesla Model 3s",
    nameSingular: "Tesla Model 3",
    costPerUnit: 65000,
    category: "vehicles",
    description: "Average price of a Tesla Model 3 electric vehicle",
    icon: "🚗",
  },
  dollarAmount: 1000000000, // $1 billion
};

// Example usage in a component
export function ComparisonResultExample() {
  return (
    <div className="container mx-auto py-12">
      <ComparisonResult
        result={exampleResult}
        budgetItemName="Department of Defense Budget (FY 2024)"
      />
    </div>
  );
}

// Example without budget item name
export function ComparisonResultMinimal() {
  return (
    <div className="container mx-auto py-12">
      <ComparisonResult result={exampleResult} />
    </div>
  );
}
