# Budget Components

Collection of components for displaying and interacting with budget data.

## ContextualComparison

Automatically shows the most striking comparison for a budget item by calculating an impact score across all available comparison units.

### Features

- **Automatic Selection**: Uses an impact scoring algorithm to pick the most relatable comparison
- **Multiple Variants**: Compact, default, and card layouts
- **Visual Icons**: Shows emoji icons from comparison units when available
- **Smart Formatting**: Handles whole numbers, decimals, percentages, and large numbers (K, M)
- **Optional Link**: Can link to full comparison page

### Impact Scoring Algorithm

The component scores comparisons based on:

1. **Number Format** (+20 points for whole numbers, +10 for simple decimals)
2. **Relatable Scale** (+30 for 1-10 units, +20 for 10-100, +10 for 100-1000)
3. **Magnitude Match** (+30 for similar amounts, +20 for same order of magnitude)
4. **Category Relevance** (+15 for everyday items, +10 for misc, +8 for vehicles)

### Usage

```tsx
import { ContextualComparison } from '@/components/budget';

// Default variant - inline with icon and description
<ContextualComparison budgetItem={budgetItem} />

// Compact variant - minimal inline text
<ContextualComparison
  budgetItem={budgetItem}
  variant="compact"
/>

// Card variant - full card with icon
<ContextualComparison
  budgetItem={budgetItem}
  variant="card"
  className="max-w-md"
/>

// Without comparison link
<ContextualComparison
  budgetItem={budgetItem}
  showLink={false}
/>
```

### Example Output

For a budget item of $650,000:

```
🍔 This equals 162,500 Big Macs
Standard McDonald's hamburger
See all comparisons →
```

For a budget item of $1,500,000,000:

```
🗼 This equals 1 Eiffel Tower
Iconic steel tower in Paris, France
See all comparisons →
```

### Props

| Prop             | Type                               | Default     | Description                                               |
| ---------------- | ---------------------------------- | ----------- | --------------------------------------------------------- |
| `budgetItem`     | `BudgetItem`                       | required    | The budget item to compare                                |
| `allBudgetItems` | `BudgetItem[]`                     | optional    | Other budget items for cross-comparisons (future feature) |
| `variant`        | `'default' \| 'compact' \| 'card'` | `'default'` | Display style                                             |
| `className`      | `string`                           | -           | Additional CSS classes                                    |
| `showLink`       | `boolean`                          | `true`      | Whether to show "See all comparisons" link                |

### Future Enhancements

- **Cross-Budget Comparisons**: Compare to other budget items in hierarchy
- **Custom Units**: Allow passing custom comparison units
- **Multiple Comparisons**: Show top N comparisons instead of just best
- **Animation**: Rotate through multiple striking comparisons
