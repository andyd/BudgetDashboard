/**
 * Example usage of BudgetTreemap component
 * This demonstrates how to use the treemap visualization
 */

'use client';

import { BudgetTreemap } from './BudgetTreemap';
import type { BudgetHierarchy } from '@/types/budget';

// Example budget data
const exampleData: BudgetHierarchy = {
  root: {
    id: 'root',
    name: 'Federal Budget FY2024',
    amount: 6800000000000, // $6.8T
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: null,
  },
  departments: [
    {
      id: 'dept-defense',
      name: 'Defense',
      amount: 850000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 12.5,
      yearOverYearChange: 3.2,
      agencies: [],
    },
    {
      id: 'dept-hhs',
      name: 'Health and Human Services',
      amount: 1600000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 23.5,
      yearOverYearChange: 5.1,
      agencies: [],
    },
    {
      id: 'dept-ss',
      name: 'Social Security',
      amount: 1200000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 17.6,
      yearOverYearChange: 2.8,
      agencies: [],
    },
    {
      id: 'dept-treasury',
      name: 'Treasury',
      amount: 700000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 10.3,
      yearOverYearChange: -1.2,
      agencies: [],
    },
    {
      id: 'dept-edu',
      name: 'Education',
      amount: 240000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 3.5,
      yearOverYearChange: 4.2,
      agencies: [],
    },
    {
      id: 'dept-va',
      name: 'Veterans Affairs',
      amount: 300000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 4.4,
      yearOverYearChange: 6.7,
      agencies: [],
    },
    {
      id: 'dept-transport',
      name: 'Transportation',
      amount: 120000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 1.8,
      yearOverYearChange: 2.1,
      agencies: [],
    },
    {
      id: 'dept-other',
      name: 'Other',
      amount: 1790000000000,
      parentId: 'root',
      fiscalYear: 2024,
      percentOfParent: 26.3,
      yearOverYearChange: 1.5,
      agencies: [],
    },
  ],
  totalAmount: 6800000000000,
  fiscalYear: 2024,
};

export function BudgetTreemapExample() {
  const handleItemClick = (itemId: string) => {
    console.log('Clicked item:', itemId);
  };

  const handleItemHover = (itemId: string | null) => {
    console.log('Hovered item:', itemId);
  };

  return (
    <div className="w-full h-[600px] p-4">
      <h2 className="mb-4 text-2xl font-bold">
        Federal Budget Treemap Visualization
      </h2>
      <BudgetTreemap
        data={exampleData}
        onItemClick={handleItemClick}
        onItemHover={handleItemHover}
        selectedItemId={null}
        className="border border-gray-200 dark:border-gray-700"
      />
    </div>
  );
}
