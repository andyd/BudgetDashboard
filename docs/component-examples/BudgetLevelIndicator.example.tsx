import { BudgetLevelIndicator } from './BudgetLevelIndicator';

/**
 * Example usage of BudgetLevelIndicator component
 *
 * This component helps users understand their position in the budget hierarchy
 */

export function BudgetLevelIndicatorExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Budget Level Indicator Examples</h2>
        <p className="text-gray-600">Shows hierarchy depth in the budget structure</p>
      </div>

      {/* Level 0: Total Budget */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Level 0: Total Budget</h3>
        <BudgetLevelIndicator level={0} />
      </div>

      {/* Level 1: Department */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Level 1: Department</h3>
        <BudgetLevelIndicator level={1} />
      </div>

      {/* Level 2: Agency */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Level 2: Agency</h3>
        <BudgetLevelIndicator level={2} />
      </div>

      {/* Level 3: Program */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Level 3: Program</h3>
        <BudgetLevelIndicator level={3} />
      </div>

      {/* Level 4: Line Item */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Level 4: Line Item</h3>
        <BudgetLevelIndicator level={4} />
      </div>

      {/* Custom Labels */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Custom Labels (Level 2)</h3>
        <BudgetLevelIndicator
          level={2}
          labels={['Federal', 'State', 'County', 'City', 'District']}
        />
      </div>

      {/* In Context Example */}
      <div className="border rounded-lg p-4 space-y-3 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-700">In Context Example</h3>
        <BudgetLevelIndicator level={3} />
        <div className="space-y-2">
          <h4 className="text-lg font-bold">Medicare Prescription Drug Benefit</h4>
          <p className="text-sm text-gray-600">
            Health and Human Services → Centers for Medicare & Medicaid Services → Medicare
          </p>
          <div className="flex gap-4 text-sm">
            <span className="font-semibold">FY 2024:</span>
            <span>$120.3 billion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
