# Accessibility Quick Reference

Fast reference for common accessibility patterns in the Budget Dashboard.

## Import Statement

```tsx
import {
  formatAmountForScreenReader,
  formatPercentageForScreenReader,
  getAriaLabel,
  announceToScreenReader,
  ARIA_LABELS,
} from "@/lib/a11y";
import { VisuallyHidden } from "@/components/common/VisuallyHidden";
```

---

## Common Patterns

### Currency Display

```tsx
// Shows "$800B" visually, announces "800 billion dollars"
<div>
  <span aria-hidden="true">$800B</span>
  <VisuallyHidden>{formatAmountForScreenReader(800000000000)}</VisuallyHidden>
</div>
```

### Percentage Display

```tsx
// Shows "15%" visually, announces "15 percent"
<div>
  <span aria-hidden="true">15%</span>
  <VisuallyHidden>{formatPercentageForScreenReader(15)}</VisuallyHidden>
</div>
```

### Icon Button

```tsx
<button aria-label="Delete budget item">
  <TrashIcon aria-hidden="true" />
  <VisuallyHidden>Delete budget item</VisuallyHidden>
</button>
```

### Clickable Card

```tsx
<div
  role="button"
  tabIndex={0}
  aria-label={getAriaLabel(budgetItem)}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {/* Content */}
</div>
```

### Progress Bar

```tsx
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`${name}: ${percentage}%`}
>
  <div style={{ width: `${percentage}%` }} aria-hidden="true" />
</div>
```

### Loading State

```tsx
useEffect(() => {
  announceToScreenReader(
    isLoading ? "Loading budget data" : "Budget data loaded",
  );
}, [isLoading]);
```

### Error Message

```tsx
<div role="alert" className="error">
  {errorMessage}
</div>;

// OR with announcement
useEffect(() => {
  if (error) {
    announceToScreenReader(`Error: ${error}`, "assertive");
  }
}, [error]);
```

---

## ARIA Labels Constants

```tsx
import { ARIA_LABELS } from "@/lib/a11y";

ARIA_LABELS.BREADCRUMB_NAV; // "Budget hierarchy navigation"
ARIA_LABELS.DRILL_DOWN; // "View detailed breakdown"
ARIA_LABELS.TREEMAP; // "Budget allocation treemap visualization"
ARIA_LABELS.SEARCH_BUDGET; // "Search budget items"
ARIA_LABELS.COMPARISON_BUILDER; // "Build your own budget comparison"
```

---

## CSS Classes

```css
.sr-only              /* Hide visually, keep for screen readers */
.sr-only-focusable    /* Reveal on focus (skip links) */
.focus-visible-only   /* Show focus for keyboard only */
.skip-link            /* Skip navigation link */
```

---

## Testing Checklist

### Quick Checks

- [ ] All images have `alt` text or `aria-label`
- [ ] All buttons/links reachable via Tab
- [ ] Focus indicators visible (not `outline: none`)
- [ ] Color not sole indicator of information
- [ ] Forms have associated `<label>` elements
- [ ] Dynamic content announced via `announceToScreenReader()`

### Keyboard Tests

- Tab through entire page
- Enter/Space activates buttons
- Escape closes modals
- Arrow keys work in grouped items

### Screen Reader Tests

```bash
# macOS - VoiceOver
Cmd + F5              # Toggle VoiceOver
VO + A                # Read summary
VO + Right Arrow      # Next item
VO + Space            # Activate

# Windows - NVDA
Ctrl + Alt + N        # Start NVDA
Insert + Down         # Read all
Down Arrow            # Next item
Enter / Space         # Activate
```

---

## Common Mistakes to Avoid

### ❌ Don't

```tsx
// Missing label
<button><Icon /></button>

// Color only
<span style={{ color: 'red' }}>Error</span>

// Div as button
<div onClick={handleClick}>Click</div>

// Missing keyboard support
<div onClick={handleClick}>Click</div>

// Hiding interactive content
<button aria-hidden="true">Click</button>
```

### ✅ Do

```tsx
// Proper label
<button aria-label="Delete">
  <Icon aria-hidden="true" />
</button>

// Text + icon + SR
<span className="text-red-600">
  <AlertIcon aria-hidden="true" />
  Error
  <VisuallyHidden>Error occurred</VisuallyHidden>
</span>

// Semantic button
<button onClick={handleClick}>Click</button>

// Full keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click
</div>

// Icon decorative, text accessible
<button>
  <Icon aria-hidden="true" />
  <VisuallyHidden>Click me</VisuallyHidden>
</button>
```

---

## Format Reference

### Numbers

```tsx
formatAmountForScreenReader(1500000000);
// "1.5 billion dollars"

formatAmountForScreenReader(25000000);
// "25 million dollars"

formatAmountForScreenReader(500000);
// "500 thousand dollars"
```

### Percentages

```tsx
formatPercentageForScreenReader(45.5);
// "45.5 percent"

formatPercentageForScreenReader(0.1);
// "less than 0.1 percent"

formatPercentageForScreenReader(99.9);
// "nearly 100 percent"
```

### Changes

```tsx
formatYearOverYearChange(5.5);
// "increased by 5.5 percent from previous year"

formatYearOverYearChange(-2.3);
// "decreased by 2.3 percent from previous year"

formatYearOverYearChange(null);
// "no prior year data available"
```

---

## Live Regions

### Politeness Levels

```tsx
// Polite (default) - announces when convenient
announceToScreenReader("Data loaded");

// Assertive - announces immediately (errors only)
announceToScreenReader("Error occurred", "assertive");
```

### Common Announcements

```tsx
// Navigation
announceNavigationChange(budgetItem, childCount);

// Loading
announceLoadingState(true, "budget data");
announceLoadingState(false, "budget data");

// Errors
announceError("Failed to load data");
```

---

## Resources

**Full Documentation:**

- `/docs/ACCESSIBILITY.md` - Complete guide
- `/docs/examples/accessibility-usage.tsx` - 10 examples
- `/docs/ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md` - Implementation details

**Testing Tools:**

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- Chrome Lighthouse (built-in)

**Guidelines:**

- [WCAG 2.1 Quick Ref](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Need Help?

1. Check `/docs/ACCESSIBILITY.md` for detailed examples
2. Run `npm run audit:a11y` for automated checks
3. Open issue with `[a11y]` prefix
4. Test with actual screen reader (VoiceOver, NVDA)

**Remember:** If in doubt, test with a screen reader!
