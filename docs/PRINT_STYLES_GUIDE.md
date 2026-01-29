# Print Styles Guide

## Overview

Comprehensive print styles have been added to `src/app/globals.css` to ensure professional, black-and-white-friendly printed output for budget comparisons, treemaps, and other dashboard content.

## Key Features

### 1. Automatic Element Hiding

The following elements are automatically hidden when printing:

- Navigation (`nav`, `aside`, `[data-sidebar]`)
- Interactive controls (buttons, inputs, search bars)
- Carousel controls and dots
- Share buttons
- Tooltips and popovers
- Admin-only elements

### 2. URL Attribution

External links automatically show their URLs in printed output:

```tsx
<a href="https://usaspending.gov/data">Source</a>
// Prints as: Source (https://usaspending.gov/data)
```

Internal links (`href="#"` or `href="/"`) do not show URLs.

### 3. Treemap Print Alternative

Treemaps are hidden and replaced with a tabular view:

```tsx
// Screen version (hidden in print)
<div className="treemap-container" data-treemap>
  {/* D3.js treemap */}
</div>

// Print version (hidden on screen, shown in print)
<table className="treemap-print-table hidden print:table" data-treemap-print>
  <thead>
    <tr>
      <th>Department</th>
      <th>Budget</th>
      <th>% of Total</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{formatCurrency(item.amount)}</td>
        <td>{item.percentage}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

### 4. Comparison Cards

Comparison cards have built-in print optimization:

```tsx
<div className="comparison-card" data-comparison-card>
  <h3>{comparison.title}</h3>
  <div className="comparison-sidebyside">
    <div className="comparison-left">
      <p className="print-highlight">{comparison.budgetAmount}</p>
    </div>
    <div className="comparison-vs" />
    <div className="comparison-right">
      <p>{comparison.comparisonAmount}</p>
    </div>
  </div>
  <a href={comparison.sourceUrl} className="comparison-source">
    Source
  </a>
</div>
```

### 5. Page Breaks

Control pagination with utility classes:

```tsx
// Force page break before element
<section className="page-break-before">

// Force page break after element
<section className="page-break-after">

// Prevent breaking inside element
<div className="page-break-avoid">

// Section with automatic page break
<div className="section-break">
```

### 6. Budget Hierarchy Indentation

Budget drill-down levels automatically indent:

```tsx
<div className="budget-hierarchy">
  <div className="budget-level-1">Department of Defense</div>
  <div className="budget-level-2">Army</div>
  <div className="budget-level-3">Operations</div>
  <div className="budget-level-4">Training Programs</div>
</div>
```

### 7. Print-Only & Screen-Only Content

Show/hide elements based on medium:

```tsx
// Only visible on screen
<div className="screen-only">
  <button>Interactive features</button>
</div>

// Only visible when printing
<div className="print-only hidden print:block">
  <p>Additional context for printed version</p>
</div>
```

### 8. Data Attribution

Add source attribution that appears at the bottom of printed pages:

```tsx
<footer className="data-source">USAspending.gov, accessed {date}</footer>
```

## Typography in Print

### Heading Sizes

- `h1`: 20pt, bold
- `h2`: 16pt, semibold
- `h3`: 13pt, semibold

### Body Text

- Default: 11pt, 1.5 line-height
- Tables: 10pt
- Footnotes: 9pt
- Captions: 8pt

## Color Handling

Print styles automatically convert to black and white:

- Primary colors → Black with bold weight
- Destructive/red → Black with bold weight
- Muted text → Gray (#555)
- Borders → Gray (#ccc)

## Financial Data

Currency and large numbers use tabular figures:

```tsx
<span className="currency" data-currency>
  $1,234,567,890
</span>
```

## Page Setup

- **Margins**: 0.75in top/bottom, 0.5in left/right
- **Size**: Letter portrait (8.5" × 11")
- **Orphans/Widows**: Minimum 3 lines

## Testing Print Output

### In Development

```bash
# Start dev server
pnpm dev

# Open browser and navigate to page
# Use browser's print preview (Cmd+P or Ctrl+P)
```

### Print Preview Tips

1. Check "Background graphics" if using shaded elements
2. Verify URL attribution appears correctly
3. Test page breaks at logical content boundaries
4. Ensure comparison cards don't split across pages
5. Verify treemap shows as table, not blank space

## Common Patterns

### Featured Comparisons Section

```tsx
<section className="page-break-avoid" data-comparison-grid>
  <h2>Featured Comparisons</h2>
  {comparisons.map((comp) => (
    <div key={comp.id} className="comparison-card" data-comparison-card>
      {/* Comparison content */}
    </div>
  ))}
</section>
```

### Budget Detail Page

```tsx
<main>
  <div className="print-header hidden print:block">
    U.S. Federal Budget Dashboard
  </div>

  <h1>{department.name} Budget</h1>

  {/* Treemap for screen */}
  <div className="treemap-container print:hidden" data-treemap>
    {/* D3 visualization */}
  </div>

  {/* Table for print */}
  <table className="hidden print:table" data-treemap-print>
    {/* Tabular data */}
  </table>

  <div className="section-break">
    <h2>Budget Breakdown</h2>
    {/* Budget hierarchy */}
  </div>

  <footer className="data-source">USAspending.gov</footer>
</main>
```

### Comparison Detail Page

```tsx
<article className="page-break-avoid">
  <h1 className="print-highlight">{comparison.title}</h1>

  <div className="comparison-sidebyside">
    <div className="comparison-left">
      <h3>Federal Budget</h3>
      <p className="currency">{comparison.budgetAmount}</p>
    </div>
    <div className="comparison-vs" />
    <div className="comparison-right">
      <h3>Real-world Equivalent</h3>
      <p>{comparison.equivalentAmount}</p>
    </div>
  </div>

  <div className="print-compact">
    <p>{comparison.explanation}</p>
  </div>

  <a href={comparison.sourceUrl} className="comparison-source">
    Source
  </a>
</article>
```

## Accessibility Notes

- Print styles maintain semantic HTML structure
- Tabular data uses proper `<table>` elements with `<thead>` and `<tbody>`
- Headings maintain hierarchy (h1 → h2 → h3)
- Links include visible URLs for reference

## Performance Considerations

- Print styles add ~2KB to CSS bundle (minified)
- No JavaScript required for print functionality
- Pure CSS @media print rules ensure broad browser compatibility

## Browser Compatibility

Tested and working in:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Print features like `page-break-inside: avoid` may vary slightly across browsers but maintain readability in all cases.

## Additional Resources

- [MDN: CSS Paged Media](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
- [W3C: CSS Print Profile](https://www.w3.org/TR/css-print/)
