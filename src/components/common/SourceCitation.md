# SourceCitation Component

A small, unobtrusive component for displaying source attribution throughout the Budget Dashboard app. Provides consistent citation styling and enhances credibility by linking to authoritative sources.

## Props

```typescript
interface SourceCitationProps {
  source: string; // Name of the source (e.g., "USAspending.gov")
  url: string; // URL to the source
  date?: string; // Optional last updated date (e.g., "January 2025")
  className?: string; // Optional Tailwind classes for custom styling
}
```

## Features

- **Consistent Design**: Uses shadcn/ui design tokens for theme compatibility
- **External Link Icon**: Lucide `ExternalLink` icon indicates link opens in new tab
- **Date Display**: Optional "Last updated" timestamp with calendar icon
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper link attributes (`target="_blank"`, `rel="noopener noreferrer"`)
- **Theme Support**: Automatically adapts to light/dark mode

## Basic Usage

```tsx
import { SourceCitation } from "@/components";

<SourceCitation
  source="USAspending.gov"
  url="https://www.usaspending.gov/agency/department-of-defense"
/>;
```

## With Date

```tsx
<SourceCitation
  source="Treasury Department"
  url="https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/"
  date="January 2025"
/>
```

## Custom Styling

```tsx
<SourceCitation
  source="NASA Budget"
  url="https://www.nasa.gov/budget"
  date="March 2024"
  className="justify-end border-t border-border pt-4 mt-4"
/>
```

## In Card Components

```tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SourceCitation,
} from "@/components";

<Card>
  <CardHeader>
    <CardTitle>Defense Spending FY 2025</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Department of Defense received $842 billion in appropriations.
    </p>
    <SourceCitation
      source="USAspending.gov"
      url="https://www.usaspending.gov/agency/department-of-defense"
      date="December 2024"
    />
  </CardContent>
</Card>;
```

## Multiple Sources

When displaying multiple sources, stack them vertically:

```tsx
<div className="flex flex-col gap-2">
  <SourceCitation
    source="Source A"
    url="https://example.com/a"
    date="January 2025"
  />
  <SourceCitation
    source="Source B"
    url="https://example.com/b"
    date="December 2024"
  />
</div>
```

## Design Tokens Used

- Text: `text-xs text-muted-foreground`
- Links: `hover:text-foreground` with underline on hover
- Icons: `h-3 w-3` (ExternalLink, Calendar)
- Separator: `text-muted-foreground/50` bullet point
- Transitions: `transition-colors`

## Accessibility

- Links open in new tab with `target="_blank"`
- Security: `rel="noopener noreferrer"` prevents tab-napping
- Icons use `flex-shrink-0` to prevent squishing
- Proper semantic HTML with inline `<a>` tags

## Where to Use

1. **Budget visualization cards**: Cite data sources for spending figures
2. **Comparison cards**: Show where comparison values came from
3. **Spotlight panels**: Attribute editorial content and statistics
4. **Admin interface**: Display source metadata for content entries
5. **API responses**: Include source information in data displays

## Best Practices

1. **Always include dates** when showing time-sensitive data (budget figures, spending totals)
2. **Use descriptive source names**: "Treasury Department" not "treasury.gov"
3. **Link to specific pages**: Direct users to the exact data source, not homepage
4. **Keep sources current**: Update dates when data is refreshed
5. **Group related citations**: Stack multiple sources vertically for readability

## Example Integration Points

### BudgetTreemap.tsx

```tsx
<SourceCitation
  source="USAspending.gov"
  url="https://www.usaspending.gov/"
  date="January 2025"
  className="mt-4"
/>
```

### ComparisonCard.tsx

```tsx
<div className="mt-4 space-y-2">
  <SourceCitation
    source={comparison.budgetSource}
    url={comparison.budgetUrl}
    date={comparison.budgetDate}
  />
  <SourceCitation source={comparison.unitSource} url={comparison.unitUrl} />
</div>
```

### SpotlightPanel.tsx

```tsx
<CardFooter>
  <SourceCitation
    source={spotlight.source}
    url={spotlight.sourceUrl}
    date={spotlight.lastUpdated}
  />
</CardFooter>
```
