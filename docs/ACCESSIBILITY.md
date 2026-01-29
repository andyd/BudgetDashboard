# Accessibility Guidelines

Comprehensive accessibility utilities and best practices for the Federal Budget Dashboard.

## Table of Contents

1. [Overview](#overview)
2. [Utilities Reference](#utilities-reference)
3. [Component Examples](#component-examples)
4. [Testing Guidelines](#testing-guidelines)
5. [WCAG Compliance](#wcag-compliance)

---

## Overview

The Budget Dashboard includes comprehensive accessibility utilities in `/src/lib/a11y.ts` to ensure the application is usable by everyone, including users of assistive technologies.

### Key Features

- Screen reader friendly number formatting
- ARIA label generators for budget items
- Live region announcements for dynamic content
- Keyboard navigation helpers
- Focus management utilities
- VisuallyHidden component for screen-reader-only content

---

## Utilities Reference

### Number Formatting

#### `formatAmountForScreenReader()`

Converts large dollar amounts into screen reader friendly format.

```typescript
import { formatAmountForScreenReader } from "@/lib/a11y";

// Basic usage
formatAmountForScreenReader(1500000000);
// Returns: "1.5 billion dollars"

formatAmountForScreenReader(25000000);
// Returns: "25 million dollars"

// With options
formatAmountForScreenReader(1234.56, { includeCents: true });
// Returns: "1,234.56 dollars"

formatAmountForScreenReader(-500000, { includeSign: false });
// Returns: "negative 500 thousand"
```

**Options:**

- `includeCents: boolean` - Include cents in output (default: false)
- `includeSign: boolean` - Include "dollars" suffix (default: true)
- `abbreviate: boolean` - Use billion/million/thousand (default: true)

---

#### `formatPercentageForScreenReader()`

Formats percentages with contextual descriptions.

```typescript
import { formatPercentageForScreenReader } from "@/lib/a11y";

formatPercentageForScreenReader(45.5);
// Returns: "45.5 percent"

formatPercentageForScreenReader(0.1);
// Returns: "less than 0.1 percent"

formatPercentageForScreenReader(99.9);
// Returns: "nearly 100 percent"

// With options
formatPercentageForScreenReader(45.5, { decimalPlaces: 0 });
// Returns: "46 percent"
```

**Options:**

- `includeSign: boolean` - Include sign for negative (default: false)
- `decimalPlaces: number` - Decimal precision (default: 1)
- `contextual: boolean` - Use contextual descriptions (default: true)

---

#### `formatYearOverYearChange()`

Describes budget changes in accessible format.

```typescript
import { formatYearOverYearChange } from "@/lib/a11y";

formatYearOverYearChange(5.5);
// Returns: "increased by 5.5 percent from previous year"

formatYearOverYearChange(-2.3);
// Returns: "decreased by 2.3 percent from previous year"

formatYearOverYearChange(null);
// Returns: "no prior year data available"
```

---

### ARIA Labels

#### `getAriaLabel()`

Generates comprehensive ARIA label for any budget item.

```typescript
import { getAriaLabel } from "@/lib/a11y";

const departmentItem: BudgetItem = {
  id: "dod",
  name: "Department of Defense",
  amount: 800000000000,
  parentId: null,
  fiscalYear: 2024,
  percentOfParent: 15,
  yearOverYearChange: 3.2,
};

getAriaLabel(departmentItem);
// Returns: "Department: Department of Defense. Budget: 800 billion dollars.
//           15 percent of total budget. Increased by 3.2 percent from
//           previous year."
```

---

#### `getComparisonAriaLabel()`

Creates labels for budget comparisons.

```typescript
import { getComparisonAriaLabel } from "@/lib/a11y";

getComparisonAriaLabel(
  800000000000, // Budget amount
  "NASA annual budget",
  25000000000, // NASA budget
);
// Returns: "800 billion dollars equals 32 times the NASA annual budget"
```

---

#### `ARIA_LABELS` Constants

Pre-defined labels for common UI elements.

```typescript
import { ARIA_LABELS } from "@/lib/a11y";

// Navigation
ARIA_LABELS.BREADCRUMB_NAV; // "Budget hierarchy navigation"
ARIA_LABELS.BACK_TO_PARENT; // "Navigate back to parent budget category"
ARIA_LABELS.DRILL_DOWN; // "View detailed breakdown"

// Visualization
ARIA_LABELS.TREEMAP; // "Budget allocation treemap visualization"
ARIA_LABELS.TREEMAP_ITEM("Defense"); // "Budget item: Defense"
ARIA_LABELS.PERCENTAGE_BAR(45); // "45% of total budget"

// Actions
ARIA_LABELS.SEARCH_BUDGET; // "Search budget items"
ARIA_LABELS.COMPARISON_BUILDER; // "Build your own budget comparison"
```

---

### Live Region Announcements

#### `announceToScreenReader()`

Announce dynamic content changes to screen readers.

```typescript
import { announceToScreenReader } from "@/lib/a11y";

// Polite announcement (default)
announceToScreenReader("Loaded Department of Defense budget details");

// Assertive announcement for errors
announceToScreenReader("Error loading budget data", "assertive");
```

**Priority Levels:**

- `polite` - Announce when convenient (default)
- `assertive` - Announce immediately

---

#### `announceNavigationChange()`

Announce when user navigates to a new budget item.

```typescript
import { announceNavigationChange } from "@/lib/a11y";

// Automatically formats announcement
announceNavigationChange(departmentItem, 5);
// Announces: "Viewing Department: Defense. Budget: 800 billion dollars.
//             Contains 5 sub-items."
```

---

#### `announceLoadingState()`

Announce loading states.

```typescript
import { announceLoadingState } from "@/lib/a11y";

announceLoadingState(true, "budget data");
// Announces: "Loading budget data"

announceLoadingState(false, "budget data");
// Announces: "budget data loaded"
```

---

#### `announceError()`

Announce errors with assertive priority.

```typescript
import { announceError } from "@/lib/a11y";

announceError("Failed to load budget data. Please try again.");
// Announces immediately: "Error: Failed to load budget data. Please try again."
```

---

### Keyboard Navigation

#### `isActivationKey()`

Check if a key event is Enter or Space.

```typescript
import { isActivationKey } from "@/lib/a11y";

function handleKeyDown(event: React.KeyboardEvent) {
  if (isActivationKey(event)) {
    event.preventDefault();
    handleClick();
  }
}
```

---

#### `isArrowKey()` and `getArrowDirection()`

Handle arrow key navigation.

```typescript
import { isArrowKey, getArrowDirection } from "@/lib/a11y";

function handleKeyDown(event: React.KeyboardEvent) {
  if (isArrowKey(event)) {
    const direction = getArrowDirection(event);
    // direction: 'up' | 'down' | 'left' | 'right'
    navigateInDirection(direction);
  }
}
```

---

### Focus Management

#### `moveFocusTo()`

Move focus to an element and optionally announce it.

```typescript
import { moveFocusTo } from "@/lib/a11y";

// Using selector
moveFocusTo("#main-content", "Showing main content");

// Using element reference
const element = document.querySelector(".budget-card");
moveFocusTo(element);
```

---

#### `trapFocus()`

Trap focus within a container (for modals/dialogs).

```typescript
import { trapFocus } from '@/lib/a11y';
import { useEffect, useRef } from 'react';

function Modal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Returns cleanup function
      const cleanup = trapFocus(containerRef.current);
      return cleanup;
    }
  }, []);

  return <div ref={containerRef}>...</div>;
}
```

---

## Component Examples

### VisuallyHidden Component

Renders content accessible to screen readers but visually hidden.

```tsx
import { VisuallyHidden } from '@/components/common/VisuallyHidden';

// Basic usage - hide descriptive text
<button>
  <TrashIcon />
  <VisuallyHidden>Delete budget item</VisuallyHidden>
</button>

// Screen reader only heading
<VisuallyHidden as="h2">
  Budget Allocation Details
</VisuallyHidden>

// Focusable skip link
<VisuallyHidden as="a" focusable>
  <a href="#main-content">Skip to main content</a>
</VisuallyHidden>
```

---

### Accessible Data Visualization

Example showing proper accessibility for data visualizations.

```tsx
import { BudgetItem } from "@/types/budget";
import { getAriaLabel, formatAmountForScreenReader } from "@/lib/a11y";
import { VisuallyHidden } from "@/components/common/VisuallyHidden";

function BudgetBar({ item }: { item: BudgetItem }) {
  return (
    <div
      className="budget-bar"
      role="progressbar"
      aria-valuenow={item.percentOfParent || 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={getAriaLabel(item)}
    >
      {/* Visual representation (hidden from screen readers) */}
      <div aria-hidden="true" className="bar-fill" />

      {/* Screen reader description */}
      <VisuallyHidden>
        {item.name}: {formatAmountForScreenReader(item.amount)}, which is{" "}
        {item.percentOfParent}% of the total budget
      </VisuallyHidden>
    </div>
  );
}
```

---

### Accessible Interactive Card

Full example with keyboard support and ARIA labels.

```tsx
import { BudgetItem } from "@/types/budget";
import { getAriaLabel, announceToScreenReader } from "@/lib/a11y";

function BudgetCard({
  item,
  onClick,
}: {
  item: BudgetItem;
  onClick: () => void;
}) {
  const handleActivate = () => {
    onClick();
    announceToScreenReader(`Viewing ${item.name} details`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel(item)}
      className="budget-card focus-visible-only"
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      {/* Card content */}
    </div>
  );
}
```

---

### Accessible Form

Example with proper labels and error announcements.

```tsx
import { useState } from "react";
import { announceError } from "@/lib/a11y";

function BudgetSearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      const errorMsg = "Please enter a search term";
      setError(errorMsg);
      announceError(errorMsg);
      return;
    }

    // Perform search...
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="budget-search">Search budget items</label>
      <input
        id="budget-search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? "search-error" : undefined}
      />
      {error && (
        <div id="search-error" role="alert" className="text-destructive">
          {error}
        </div>
      )}
      <button type="submit">Search</button>
    </form>
  );
}
```

---

## Testing Guidelines

### Manual Testing Checklist

#### Keyboard Navigation

- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order is logical and follows visual layout
- [ ] Enter/Space activate buttons and links
- [ ] Escape closes modals and dialogs
- [ ] Arrow keys navigate within grouped elements
- [ ] Focus indicators are clearly visible

#### Screen Reader Testing

- [ ] Page has proper heading hierarchy (h1 → h2 → h3)
- [ ] All images have alt text or aria-label
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Data visualizations have text alternatives

#### Visual Testing

- [ ] Focus indicators have 3:1 contrast ratio
- [ ] Text has 4.5:1 contrast ratio (normal text)
- [ ] Text has 3:1 contrast ratio (large text)
- [ ] UI works at 200% zoom
- [ ] Content reflows properly at mobile sizes

---

### Automated Testing

```bash
# Run Playwright accessibility tests
npm run test:a11y

# Lighthouse accessibility audit
npm run audit:a11y
```

---

### Screen Reader Testing

**Recommended screen readers:**

- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca (free)

**Quick VoiceOver shortcuts (macOS):**

- `Cmd + F5` - Toggle VoiceOver
- `VO + A` - Read page summary
- `VO + Right Arrow` - Next item
- `VO + Space` - Activate item

---

## WCAG Compliance

The Budget Dashboard aims for **WCAG 2.1 Level AA** compliance.

### Key Requirements Met

#### Perceivable

- ✅ Text alternatives for non-text content
- ✅ Captions and alternatives for media
- ✅ Adaptable content (can be presented differently)
- ✅ Distinguishable content (sufficient contrast)

#### Operable

- ✅ Keyboard accessible
- ✅ Enough time to interact
- ✅ No content causes seizures
- ✅ Navigable (clear navigation, skip links)

#### Understandable

- ✅ Readable text
- ✅ Predictable behavior
- ✅ Input assistance (labels, error prevention)

#### Robust

- ✅ Compatible with assistive technologies
- ✅ Valid HTML
- ✅ Proper ARIA usage

---

## CSS Utilities

### Screen Reader Only Classes

```css
/* Hide visually, keep for screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Reveal on focus (skip links) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Focus Indicators

```css
/* Enhanced focus visible */
.focus-visible-only:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Focus within container */
.focus-within-ring:focus-within {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Motion Preferences

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Best Practices

### Do's ✅

1. **Use semantic HTML**

   ```tsx
   // Good
   <button onClick={handleClick}>Click me</button>

   // Bad
   <div onClick={handleClick}>Click me</div>
   ```

2. **Provide text alternatives**

   ```tsx
   // Good
   <img src="chart.png" alt="Budget allocation pie chart showing Defense at 15%" />

   // Bad
   <img src="chart.png" alt="chart" />
   ```

3. **Use proper ARIA roles**

   ```tsx
   // Good
   <div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>

   // Bad
   <div className="progress-bar" />
   ```

4. **Announce dynamic changes**
   ```tsx
   // Good
   useEffect(() => {
     announceToScreenReader(`Loaded ${items.length} budget items`);
   }, [items]);
   ```

---

### Don'ts ❌

1. **Don't use color alone to convey information**

   ```tsx
   // Bad
   <span style={{ color: 'red' }}>Decreased</span>

   // Good
   <span className="text-destructive">
     <ArrowDownIcon aria-hidden="true" />
     Decreased by 5%
     <VisuallyHidden>Decreased by 5 percent from previous year</VisuallyHidden>
   </span>
   ```

2. **Don't create keyboard traps**

   ```tsx
   // Bad - no way to exit
   onKeyDown={(e) => e.preventDefault()}

   // Good - allow Escape
   onKeyDown={(e) => {
     if (e.key === 'Escape') closeModal();
   }}
   ```

3. **Don't hide interactive content from screen readers**

   ```tsx
   // Bad
   <button aria-hidden="true">Click me</button>

   // Good
   <button>
     <Icon aria-hidden="true" />
     <VisuallyHidden>Click me</VisuallyHidden>
   </button>
   ```

---

## Resources

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluator
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome
- [Pa11y](https://pa11y.org/) - Automated testing CLI

### Testing

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

---

## Support

For accessibility questions or issues, please:

1. Check this documentation
2. Review the WCAG 2.1 guidelines
3. Open an issue with `[a11y]` prefix
4. Contact the accessibility team

Remember: Accessibility is not optional — it's a fundamental requirement for all users.
