'use client';

/**
 * ComparisonBuilder Component
 * "Build Your Own Comparison" interface for creating custom budget comparisons
 */

import { useState } from 'react';
import type { BudgetItem, ComparisonUnit } from '@/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

interface ComparisonBuilderProps {
  budgetItems: BudgetItem[];
  onShare: (budgetItemId: string, unitId: string) => void;
}

// Mock comparison units - these would come from your data source
const COMPARISON_UNITS: ComparisonUnit[] = [
  {
    id: 'teacher-salary',
    name: 'Teacher Salaries',
    nameSingular: 'Teacher Salary',
    costPerUnit: 65000,
    category: 'everyday',
    description: 'Average US teacher annual salary',
    icon: '👨‍🏫',
  },
  {
    id: 'health-insurance',
    name: 'Health Insurance Plans',
    nameSingular: 'Health Insurance Plan',
    costPerUnit: 8500,
    category: 'everyday',
    description: 'Annual individual health insurance premium',
    icon: '🏥',
  },
  {
    id: 'school-lunch',
    name: 'School Lunches',
    nameSingular: 'School Lunch',
    costPerUnit: 3.5,
    category: 'everyday',
    description: 'Cost per school lunch',
    icon: '🍎',
  },
  {
    id: 'highway-mile',
    name: 'Highway Miles',
    nameSingular: 'Highway Mile',
    costPerUnit: 5000000,
    category: 'infrastructure',
    description: 'Average cost to build one mile of highway',
    icon: '🛣️',
  },
  {
    id: 'college-tuition',
    name: 'College Tuitions',
    nameSingular: 'College Tuition',
    costPerUnit: 10560,
    category: 'everyday',
    description: 'Annual public college tuition',
    icon: '🎓',
  },
];

/**
 * Format currency with B/M/K suffixes
 */
function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function ComparisonBuilder({
  budgetItems,
  onShare,
}: ComparisonBuilderProps) {
  const [selectedBudgetItemId, setSelectedBudgetItemId] = useState<
    string | null
  >(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Get the selected budget item and unit
  const selectedBudgetItem = budgetItems.find(
    (item) => item.id === selectedBudgetItemId
  );
  const selectedUnit = COMPARISON_UNITS.find(
    (unit) => unit.id === selectedUnitId
  );

  // Calculate comparison if both selections are made
  const unitCount =
    selectedBudgetItem && selectedUnit
      ? Math.floor(selectedBudgetItem.amount / selectedUnit.costPerUnit)
      : null;

  // Handle share
  const handleShare = () => {
    if (selectedBudgetItemId && selectedUnitId) {
      onShare(selectedBudgetItemId, selectedUnitId);
    }
  };

  // Group units by category for organized dropdown
  const unitsByCategory = COMPARISON_UNITS.reduce(
    (acc, unit) => {
      if (!acc[unit.category]) {
        acc[unit.category] = [];
      }
      acc[unit.category].push(unit);
      return acc;
    },
    {} as Record<string, ComparisonUnit[]>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Build Your Own Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare any budget item to real-world costs
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comparison selector interface */}
        <div className="space-y-4">
          {/* Budget Item Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="budget-item">
              Budget Item
            </label>
            <Select
              value={selectedBudgetItemId || undefined}
              onValueChange={setSelectedBudgetItemId}
            >
              <SelectTrigger id="budget-item" className="w-full">
                <SelectValue placeholder="Select a budget item..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Budget Items</SelectLabel>
                  {budgetItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({formatCurrency(item.amount)})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              could fund
            </span>
          </div>

          {/* Unit Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="unit">
              Comparison Unit
            </label>
            <Select
              value={selectedUnitId || undefined}
              onValueChange={setSelectedUnitId}
            >
              <SelectTrigger id="unit" className="w-full">
                <SelectValue placeholder="Select a comparison unit..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitsByCategory).map(([category, units]) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="capitalize">
                      {category}
                    </SelectLabel>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.icon && `${unit.icon} `}
                        {unit.name} ({formatCurrency(unit.costPerUnit)} each)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Real-time result display */}
        {selectedBudgetItem && selectedUnit && unitCount !== null && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-3">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <p className="text-4xl font-bold text-primary mb-2">
                  {formatNumber(unitCount)}
                </p>
                <p className="text-lg text-muted-foreground">
                  {unitCount === 1
                    ? selectedUnit.nameSingular
                    : selectedUnit.name}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm leading-relaxed">
                  The{' '}
                  <span className="font-semibold">
                    {selectedBudgetItem.name}
                  </span>{' '}
                  budget of{' '}
                  <span className="font-semibold">
                    {formatCurrency(selectedBudgetItem.amount)}
                  </span>{' '}
                  could fund{' '}
                  <span className="font-semibold text-primary">
                    {formatNumber(unitCount)}{' '}
                    {unitCount === 1
                      ? selectedUnit.nameSingular.toLowerCase()
                      : selectedUnit.name.toLowerCase()}
                  </span>
                  .
                </p>
              </div>

              {/* Unit description */}
              {selectedUnit.description && (
                <div className="text-xs text-muted-foreground">
                  {selectedUnit.icon && `${selectedUnit.icon} `}
                  {selectedUnit.description}
                </div>
              )}
            </div>

            {/* Share button */}
            <Button
              onClick={handleShare}
              className="w-full"
              size="lg"
              disabled={!selectedBudgetItemId || !selectedUnitId}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share This Comparison
            </Button>
          </div>
        )}

        {/* Empty state */}
        {(!selectedBudgetItem || !selectedUnit) && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Select a budget item and a comparison unit to see the results
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
