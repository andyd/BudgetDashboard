# SpotlightPanel Component

An editorial information card component that provides contextual explanations for budget items. Displays "What is this?" content in a collapsible format with source citations.

## Features

- Collapsible/expandable accordion interface
- Editorial-style content explaining budget line items
- Source citation support with external links
- Subtle background color to distinguish from main content
- Fully accessible with keyboard navigation
- Dark mode support
- TypeScript typed

## Usage

```tsx
import { SpotlightPanel } from "@/components/budget";

<SpotlightPanel
  budgetItemId="f35-program"
  title="F-35 Lightning II Joint Strike Fighter"
  description="The F-35 is a family of single-seat, single-engine, all-weather stealth multirole combat aircraft..."
  sources={[
    {
      label: "Department of Defense F-35 Program Overview",
      url: "https://www.defense.gov/f35",
    },
    {
      label: "GAO Report: F-35 Joint Strike Fighter",
      url: "https://www.gao.gov/products/gao-23-106217",
    },
  ]}
  defaultOpen={true}
/>;
```

## Props

| Prop           | Type                | Required | Description                                                      |
| -------------- | ------------------- | -------- | ---------------------------------------------------------------- |
| `budgetItemId` | `string`            | Yes      | Unique identifier for the budget item (used for accordion state) |
| `title`        | `string`            | Yes      | Short title/name of the budget item                              |
| `description`  | `string`            | Yes      | Editorial explanation of what the money funds                    |
| `sources`      | `SpotlightSource[]` | Yes      | Array of source citations                                        |
| `className`    | `string`            | No       | Additional CSS classes                                           |
| `defaultOpen`  | `boolean`           | No       | Whether the panel starts expanded (default: `false`)             |

## Types

### SpotlightSource

```typescript
interface SpotlightSource {
  label: string; // Display text for the source link
  url: string; // URL to the source document
}
```

## Design Guidelines

### Colors

The component uses a subtle blue tinted background to distinguish editorial content:

- **Light mode**: `bg-blue-50/50` with `border-blue-200/60`
- **Dark mode**: `bg-blue-950/20` with `border-blue-900/40`

### Spacing

- Header padding: `pb-0` (accordion trigger handles spacing)
- Content padding: `pt-4` with `space-y-4` for internal elements
- Source citations separated by `pt-2` border-top

### Typography

- Title: `text-base font-semibold`
- Subtitle (CardDescription): `text-sm font-normal`
- Description text: `text-sm text-muted-foreground leading-relaxed`
- Source labels: `text-xs`

## Examples

### Basic Usage

```tsx
<SpotlightPanel
  budgetItemId="medicare-admin"
  title="Medicare Administration"
  description="Funds required to operate Medicare..."
  sources={[{ label: "CMS Budget", url: "https://cms.gov/budget" }]}
/>
```

### With Multiple Sources

```tsx
<SpotlightPanel
  budgetItemId="nasa-artemis"
  title="NASA Artemis Program"
  description="The Artemis program aims to return humans to the Moon..."
  sources={[
    { label: "NASA Budget Request", url: "https://nasa.gov/budget" },
    { label: "GAO Artemis Report", url: "https://gao.gov/artemis" },
    { label: "Congressional Testimony", url: "https://congress.gov/..." },
  ]}
/>
```

### Default Open

```tsx
<SpotlightPanel
  budgetItemId="irs-modernization"
  title="IRS IT Modernization"
  description="Funds to upgrade legacy IRS systems..."
  sources={[...]}
  defaultOpen={true}
/>
```

### Custom Styling

```tsx
<SpotlightPanel
  budgetItemId="custom"
  title="Custom Item"
  description="..."
  sources={[...]}
  className="max-w-xl mx-auto mt-6"
/>
```

## Accessibility

- Uses semantic HTML with proper heading hierarchy
- Keyboard navigable (Space/Enter to toggle)
- Screen reader friendly with ARIA attributes from Radix UI
- External link icons indicate links open in new tabs
- Focus visible states on interactive elements

## Implementation Notes

### Accordion State

The component uses Radix UI's Accordion with:

- `type="single"` - only one item can be open (though typically used alone)
- `collapsible` - can toggle the same item closed
- `defaultValue` - controlled by `defaultOpen` prop and `budgetItemId`

### Icon Usage

- **InfoIcon**: Indicates informational content
- **ExternalLinkIcon**: Indicates external source links

Both from `lucide-react` for consistency with the design system.

### Styling Architecture

Built with shadcn/ui components:

- `Card` - Container structure
- `CardHeader`, `CardContent`, `CardTitle`, `CardDescription` - Layout
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` - Interaction

## When to Use

Use SpotlightPanel when you need to:

- Explain complex budget items in plain language
- Provide context for unfamiliar programs or agencies
- Show what taxpayer money actually pays for
- Cite authoritative sources for budget information
- Present editorial/explainer content separate from raw data

## When NOT to Use

Don't use SpotlightPanel for:

- Budget comparisons (use ComparisonCard instead)
- Navigation/filtering (use BudgetBreadcrumb instead)
- Raw budget data display (use BudgetTreemap instead)
- Interactive drill-downs (use DrillDownPanel instead)

## Related Components

- `BudgetTreemap` - Visual budget hierarchy
- `ComparisonCard` - Dollar amount comparisons
- `BudgetBreadcrumb` - Navigation breadcrumb
- `DrillDownPanel` - Interactive drill-down UI
