/**
 * Example usage of UnitSelector component
 * This file demonstrates how to use the UnitSelector in your application
 */

'use client';

import { useState } from 'react';
import { UnitSelector } from './UnitSelector';
import type { ComparisonUnit } from '@/types/comparison';

// Example comparison units data
const exampleUnits: ComparisonUnit[] = [
  {
    id: '1',
    name: 'Teacher Salaries',
    nameSingular: 'Teacher Salary',
    costPerUnit: 65000,
    category: 'everyday',
    description: 'Average teacher salary per year',
    icon: '👨‍🏫',
  },
  {
    id: '2',
    name: 'Health Insurance Premiums',
    nameSingular: 'Health Insurance Premium',
    costPerUnit: 8500,
    category: 'everyday',
    description: 'Individual health insurance premium per year',
    icon: '🏥',
  },
  {
    id: '3',
    name: 'F-35 Fighter Jets',
    nameSingular: 'F-35 Fighter Jet',
    costPerUnit: 80000000,
    category: 'vehicles',
    description: 'Cost of one F-35 fighter jet',
    icon: '✈️',
  },
  {
    id: '4',
    name: 'Miles of Highway',
    nameSingular: 'Mile of Highway',
    costPerUnit: 10000000,
    category: 'infrastructure',
    description: 'Cost to build one mile of highway',
    icon: '🛣️',
  },
  {
    id: '5',
    name: 'School Lunches',
    nameSingular: 'School Lunch',
    costPerUnit: 3.5,
    category: 'everyday',
    description: 'Cost of one school lunch',
    icon: '🍱',
  },
];

export function UnitSelectorExample() {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Find the selected unit
  const selectedUnit = exampleUnits.find((unit) => unit.id === selectedUnitId);

  return (
    <div className="space-y-6 p-6 max-w-md">
      <div>
        <h2 className="text-2xl font-bold mb-2">UnitSelector Example</h2>
        <p className="text-muted-foreground">
          Select a comparison unit from the dropdown below.
        </p>
      </div>

      <UnitSelector
        units={exampleUnits}
        selectedId={selectedUnitId}
        onSelect={setSelectedUnitId}
        label="Select Comparison Unit"
        placeholder="Choose a unit to compare against"
      />

      {selectedUnit && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Selected Unit:</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Name:</span> {selectedUnit.name}
            </p>
            <p>
              <span className="font-medium">Cost:</span> $
              {selectedUnit.costPerUnit.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Category:</span>{' '}
              {selectedUnit.category}
            </p>
            {selectedUnit.description && (
              <p>
                <span className="font-medium">Description:</span>{' '}
                {selectedUnit.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
