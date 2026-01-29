'use client';

/**
 * Demo page for ComparisonBuilder component
 * Shows how to use the comparison builder with sample budget data
 */

import { ComparisonBuilder } from '@/components/comparison/ComparisonBuilder';
import type { BudgetItem } from '@/types';
import { toast } from 'sonner';

// Sample budget items for demonstration
const SAMPLE_BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'defense-department',
    name: 'Department of Defense',
    amount: 816_000_000_000, // $816 billion
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 3.2,
  },
  {
    id: 'ice-detention',
    name: 'ICE Detention',
    amount: 3_400_000_000, // $3.4 billion
    parentId: 'dhs',
    fiscalYear: 2024,
    percentOfParent: 5.2,
    yearOverYearChange: 8.1,
  },
  {
    id: 'f35-program',
    name: 'F-35 Aircraft Program',
    amount: 12_400_000_000, // $12.4 billion
    parentId: 'defense-department',
    fiscalYear: 2024,
    percentOfParent: 1.5,
    yearOverYearChange: 2.1,
  },
  {
    id: 'medicare',
    name: 'Medicare',
    amount: 874_000_000_000, // $874 billion
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 5.8,
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    amount: 616_000_000_000, // $616 billion
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 4.2,
  },
  {
    id: 'education-department',
    name: 'Department of Education',
    amount: 79_600_000_000, // $79.6 billion
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 1.9,
  },
  {
    id: 'epa',
    name: 'Environmental Protection Agency',
    amount: 9_100_000_000, // $9.1 billion
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: -2.3,
  },
  {
    id: 'billion-sample',
    name: 'One Billion Dollars',
    amount: 1_000_000_000, // $1 billion (for "What could $1B buy?" preset)
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: null,
  },
];

export default function DemoComparisonPage() {
  const handleShare = (budgetItemId: string, unitId: string) => {
    // In a real app, this would:
    // 1. Save the comparison to a database
    // 2. Generate a unique shareable URL
    // 3. Copy URL to clipboard or open share dialog

    const budgetItem = SAMPLE_BUDGET_ITEMS.find(
      (item) => item.id === budgetItemId
    );
    toast.success('Comparison ready to share!', {
      description: `Comparing ${budgetItem?.name} to ${unitId}`,
    });

    // Example: Copy to clipboard (you would copy the actual URL)
    const shareUrl = `${window.location.origin}/compare/${budgetItemId}-${unitId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Comparison Builder Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Create custom comparisons between federal budget items and real-world
            costs.
          </p>
        </div>

        {/* The ComparisonBuilder component */}
        <ComparisonBuilder
          budgetItems={SAMPLE_BUDGET_ITEMS}
          onShare={handleShare}
        />

        {/* Usage instructions */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">How to Use</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Quick Comparisons:</strong> Click any preset button to
              instantly compare popular budget items (e.g., "ICE vs Healthcare").
            </div>
            <div>
              <strong>2. Custom Comparisons:</strong> Use the dropdown menus to
              select any budget item and comparison unit.
            </div>
            <div>
              <strong>3. View Results:</strong> See the real-time calculation
              showing how many units the budget amount can fund.
            </div>
            <div>
              <strong>4. Share:</strong> Click the share button to generate a
              shareable link for your comparison.
            </div>
          </div>
        </div>

        {/* Example integrations */}
        <div className="bg-accent/10 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Integration Example</h2>
          <pre className="bg-background rounded p-4 overflow-x-auto text-xs">
            <code>{`import { ComparisonBuilder } from '@/components/comparison/ComparisonBuilder';
import type { BudgetItem } from '@/types';

export default function YourPage() {
  const budgetItems: BudgetItem[] = [
    // Your budget data...
  ];

  const handleShare = (budgetItemId: string, unitId: string) => {
    // Handle sharing logic
    console.log('Share:', budgetItemId, unitId);
  };

  return (
    <ComparisonBuilder
      budgetItems={budgetItems}
      onShare={handleShare}
    />
  );
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
