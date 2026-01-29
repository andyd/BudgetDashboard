"use client";

import { DrillDownPanel } from "./DrillDownPanel";
import { BudgetItem } from "@/types/budget";

/**
 * Example usage of DrillDownPanel component
 *
 * This demonstrates how to use the DrillDownPanel to display
 * a list of child budget items with sorting, percentage bars,
 * and YoY change indicators.
 */

// Mock data: Department of Defense agencies
const mockParentItem: BudgetItem = {
  id: "dept-defense",
  name: "Department of Defense",
  amount: 842_000_000_000, // $842 billion
  parentId: null,
  fiscalYear: 2024,
  percentOfParent: null,
  yearOverYearChange: 3.2,
};

const mockItems: BudgetItem[] = [
  {
    id: "army",
    name: "Department of the Army",
    amount: 185_000_000_000,
    parentId: "dept-defense",
    fiscalYear: 2024,
    percentOfParent: 22.0,
    yearOverYearChange: 2.5,
  },
  {
    id: "navy",
    name: "Department of the Navy",
    amount: 255_800_000_000,
    parentId: "dept-defense",
    fiscalYear: 2024,
    percentOfParent: 30.4,
    yearOverYearChange: 4.1,
  },
  {
    id: "air-force",
    name: "Department of the Air Force",
    amount: 234_200_000_000,
    parentId: "dept-defense",
    fiscalYear: 2024,
    percentOfParent: 27.8,
    yearOverYearChange: 3.8,
  },
  {
    id: "defense-wide",
    name: "Defense-Wide",
    amount: 167_000_000_000,
    parentId: "dept-defense",
    fiscalYear: 2024,
    percentOfParent: 19.8,
    yearOverYearChange: 2.1,
  },
];

// Mock spotlight checker (would normally come from a store or API)
const mockHasSpotlights = (item: BudgetItem): boolean => {
  // Simulate that Navy and Air Force have spotlights
  return item.id === "navy" || item.id === "air-force";
};

export function DrillDownPanelExample() {
  const handleItemClick = (item: BudgetItem) => {
    console.log("Drill down into:", item.name);
    // In a real app, this would navigate to a deeper level
    // or update the application state to show child items
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">DrillDownPanel Example</h2>
        <p className="text-muted-foreground mb-6">
          Click on any row to drill deeper. Sort columns by clicking on headers.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <DrillDownPanel
          items={mockItems}
          parentItem={mockParentItem}
          onItemClick={handleItemClick}
          hasSpotlights={mockHasSpotlights}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Features Demonstrated</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Sortable columns (Name, Amount, YoY Change)</li>
          <li>Percentage bars showing relative size within parent</li>
          <li>Year-over-year change indicators with tooltips</li>
          <li>Spotlight icons for items with editorial content</li>
          <li>Formatted currency values with compact notation</li>
          <li>Click/keyboard navigation for drill-down</li>
          <li>Responsive table layout with proper accessibility</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Without Parent Item</h3>
        <p className="text-muted-foreground text-sm">
          Panel can also work without a parent item context
        </p>
        <div className="bg-card border rounded-lg p-6">
          <DrillDownPanel
            items={mockItems}
            onItemClick={handleItemClick}
            hasSpotlights={mockHasSpotlights}
          />
        </div>
      </div>
    </div>
  );
}
