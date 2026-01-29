'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ComparisonUnit } from '@/types/comparison';

interface UnitSelectorProps {
  /** Available comparison units to display */
  units: ComparisonUnit[];
  /** Currently selected unit ID */
  selectedId: string | null;
  /** Callback when a unit is selected */
  onSelect: (unitId: string) => void;
  /** Label for the selector */
  label?: string;
  /** Placeholder text when no unit is selected */
  placeholder?: string;
}

/**
 * Dropdown selector for comparison units
 * Groups units by category and displays their cost per unit
 */
export function UnitSelector({
  units,
  selectedId,
  onSelect,
  label = 'Compare to',
  placeholder = 'Select a comparison unit',
}: UnitSelectorProps) {
  // Group units by category
  const groupedUnits = units.reduce(
    (acc, unit) => {
      const category = unit.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(unit);
      return acc;
    },
    {} as Record<string, ComparisonUnit[]>
  );

  // Define category order and display names
  const categoryConfig: Record<
    string,
    { order: number; displayName: string }
  > = {
    infrastructure: { order: 1, displayName: 'Infrastructure' },
    everyday: { order: 2, displayName: 'Everyday Items' },
    vehicles: { order: 3, displayName: 'Vehicles' },
    buildings: { order: 4, displayName: 'Buildings' },
    misc: { order: 5, displayName: 'Miscellaneous' },
  };

  // Sort categories by defined order
  const sortedCategories = Object.keys(groupedUnits).sort(
    (a, b) => (categoryConfig[a]?.order ?? 99) - (categoryConfig[b]?.order ?? 99)
  );

  // Format cost for display
  const formatCost = (cost: number): string => {
    if (cost < 1) {
      return `$${cost.toFixed(2)}`;
    }
    if (cost >= 1000000) {
      return `$${(cost / 1000000).toFixed(1)}M`;
    }
    if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(1)}K`;
    }
    return `$${cost.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <Select
        value={selectedId ?? ''}
        onValueChange={onSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {sortedCategories.map((category) => (
            <SelectGroup key={category}>
              <SelectLabel>
                {categoryConfig[category]?.displayName ?? category}
              </SelectLabel>
              {groupedUnits[category]?.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span className="flex items-center gap-2 truncate">
                      {unit.icon && <span>{unit.icon}</span>}
                      {unit.name}
                    </span>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatCost(unit.costPerUnit)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
