# Stores

Zustand state management stores for the Budget Dashboard.

## Comparison Store

Manages comparison units, featured comparisons, and custom user comparisons.

### Usage Example

```typescript
import { useComparisonStore } from '@/stores/comparison-store';

function ComparisonExample() {
  const {
    units,
    featuredComparisons,
    customComparison,
    setUnits,
    setCustomComparison,
    calculateComparison,
    clearCustom,
  } = useComparisonStore();

  // Load comparison units on mount
  useEffect(() => {
    const mockUnits = [
      {
        id: 'eiffel-tower',
        name: 'Eiffel Towers',
        nameSingular: 'Eiffel Tower',
        costPerUnit: 1_500_000_000, // $1.5 billion
        category: 'infrastructure' as const,
        icon: '🗼',
      },
      {
        id: 'coffee',
        name: 'Cups of Coffee',
        nameSingular: 'Cup of Coffee',
        costPerUnit: 5,
        category: 'everyday' as const,
        icon: '☕',
      },
    ];
    setUnits(mockUnits);
  }, [setUnits]);

  // Create a custom comparison
  const handleCreateComparison = () => {
    setCustomComparison(
      'defense-budget',
      'education-budget',
      'eiffel-tower'
    );

    // Calculate the comparison for a $10 billion budget item
    calculateComparison(10_000_000_000, 'eiffel-tower');
  };

  return (
    <div>
      <h2>Available Units: {units.length}</h2>
      {customComparison?.result && (
        <p>{customComparison.result.formatted}</p>
      )}
      <button onClick={handleCreateComparison}>
        Create Comparison
      </button>
      <button onClick={clearCustom}>
        Clear
      </button>
    </div>
  );
}
```

### State Structure

```typescript
{
  units: ComparisonUnit[];              // Available units for comparisons
  featuredComparisons: FeaturedComparison[];  // Editor-curated comparisons
  customComparison: CustomComparison | null;  // User's custom comparison
  isLoading: boolean;                   // Loading state
  error: string | null;                 // Error message
}
```

### Actions

- `setUnits(units)` - Set available comparison units
- `setFeatured(comparisons)` - Set featured comparisons
- `setCustomComparison(leftItemId, rightItemId, selectedUnitId)` - Create custom comparison
- `calculateComparison(dollarAmount, unitId)` - Calculate and format comparison result
- `clearCustom()` - Clear custom comparison
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error message

### Number Formatting

The store automatically formats large numbers:

- Numbers >= 1,000,000: "2.5 million"
- Numbers >= 1,000: "5.25 thousand"
- Numbers < 1,000: "123.45"

### Example Results

```typescript
// $10 billion divided by $1.5 billion per Eiffel Tower
{
  unitCount: 6.67,
  formatted: "6.67 Eiffel Towers",
  unit: { id: 'eiffel-tower', name: 'Eiffel Towers', ... },
  dollarAmount: 10_000_000_000
}

// $500,000 divided by $5 per coffee
{
  unitCount: 100000,
  formatted: "100.00 thousand Cups of Coffee",
  unit: { id: 'coffee', name: 'Cups of Coffee', ... },
  dollarAmount: 500_000
}
```
