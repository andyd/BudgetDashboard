'use client';

import { Button } from '@/components/ui/button';

/**
 * Configuration for a preset comparison
 * Pre-fills the ComparisonBuilder with specific budget items or unit selections
 */
export interface PresetConfig {
  /** Display name for the preset button */
  name: string;
  /** Optional icon or emoji to display with the preset name */
  icon?: string;
  /** Left side budget item ID (null if user should select) */
  leftItemId: string | null;
  /** Right side budget item ID (null if user should select) */
  rightItemId: string | null;
  /** Selected comparison unit ID (null if user should select) */
  selectedUnitId: string | null;
}

/**
 * Props for ComparisonPresets component
 */
interface ComparisonPresetsProps {
  /** Callback invoked when a preset is selected */
  onSelect: (config: PresetConfig) => void;
  /** Optional class name for styling */
  className?: string;
}

/**
 * Predefined comparison presets for common use cases
 * Note: The IDs used here are placeholders and should be replaced with actual
 * budget item IDs from your data source
 */
const PRESETS: PresetConfig[] = [
  {
    name: 'ICE vs Healthcare',
    icon: '🏥',
    leftItemId: 'ice-detention-operations', // Immigration and Customs Enforcement
    rightItemId: 'health-insurance-premium', // Healthcare comparison unit
    selectedUnitId: 'health-insurance-premium',
  },
  {
    name: 'Defense vs Education',
    icon: '🎓',
    leftItemId: 'defense-procurement', // Defense spending
    rightItemId: 'teacher-salary', // Education comparison unit
    selectedUnitId: 'teacher-salary',
  },
  {
    name: 'What could $1B buy?',
    icon: '💰',
    leftItemId: null, // User will select a budget item
    rightItemId: null,
    selectedUnitId: null, // Opens with $1B as the amount
  },
  {
    name: 'Daily spending',
    icon: '📅',
    leftItemId: null, // User will select a budget item
    rightItemId: 'daily-spending', // Divides by 365 to show per-day cost
    selectedUnitId: 'daily-spending',
  },
];

/**
 * ComparisonPresets Component
 *
 * Displays a row of quick-select buttons for common budget comparison scenarios.
 * Each preset pre-fills the ComparisonBuilder with specific configurations.
 *
 * @example
 * ```tsx
 * <ComparisonPresets
 *   onSelect={(config) => {
 *     // Update ComparisonBuilder state
 *     setBuilderState(config);
 *   }}
 * />
 * ```
 */
export function ComparisonPresets({
  onSelect,
  className,
}: ComparisonPresetsProps) {
  return (
    <div
      className={className}
      role="group"
      aria-label="Quick comparison presets"
    >
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onSelect(preset)}
            className="gap-1.5"
            aria-label={`Load ${preset.name} comparison preset`}
          >
            {preset.icon && (
              <span aria-hidden="true" className="text-base">
                {preset.icon}
              </span>
            )}
            <span>{preset.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
