# Common Components

Reusable UI components used throughout the Budget Dashboard application.

## EmptyState Component

A flexible, reusable component for displaying empty states throughout the application.

### Features

- **Centered Layout**: Content is vertically and horizontally centered
- **Icon Display**: Lucide icon displayed in a muted circular background
- **Muted Colors**: Uses theme-aware muted color palette
- **Optional CTA**: Can include an action button
- **Customizable**: Supports custom icons, sizes, and actions

### Props

```typescript
interface EmptyStateProps {
  title: string; // Main heading text
  description?: string; // Optional descriptive text
  icon: LucideIcon; // Lucide icon component
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string; // Additional CSS classes
  iconSize?: "sm" | "md" | "lg"; // Icon size variant
}
```

### Usage

```tsx
import { EmptyState } from "@/components";
import { Inbox } from "lucide-react";

function MyComponent() {
  return (
    <EmptyState
      icon={Inbox}
      title="No data available"
      description="There is no budget data available for the selected time period."
      action={{
        label: "Reset Filters",
        onClick: handleReset,
        variant: "outline",
      }}
      iconSize="md"
    />
  );
}
```

## Specific Empty States

Pre-configured empty state components for common scenarios.

### NoComparisonsEmpty

Displays when no featured comparisons are available.

```tsx
import { NoComparisonsEmpty } from "@/components";

<NoComparisonsEmpty onCreateComparison={() => router.push("/create")} />;
```

**Props:**

- `onCreateComparison?: () => void` - Optional callback for create action

**Displays:**

- Icon: TrendingUp
- Title: "No featured comparisons yet"
- Description: Help text about comparisons
- Action: "Create Comparison" button (if callback provided)

### NoSearchResults

Displays when search returns no matching items.

```tsx
import { NoSearchResults } from "@/components";

<NoSearchResults
  searchQuery="defense spending"
  onClearSearch={() => setSearch("")}
/>;
```

**Props:**

- `searchQuery?: string` - The search query that returned no results
- `onClearSearch?: () => void` - Optional callback to clear search

**Displays:**

- Icon: Search
- Title: "No budget items match your search"
- Description: Context-aware message with search query
- Action: "Clear Search" button (if callback provided)

### NoSpotlight

Displays when spotlight panel has no additional information.

```tsx
import { NoSpotlight } from "@/components";

<NoSpotlight itemName="Department of Defense" />;
```

**Props:**

- `itemName?: string` - Name of the item with no spotlight data

**Displays:**

- Icon: Info
- Title: "No additional information available"
- Description: Context-aware message with item name
- Size: Smaller variant (py-8 vs py-12)

## Design Guidelines

All empty state components follow these design principles:

1. **Muted Colors**: Use `text-muted-foreground` for non-critical information
2. **Icon Background**: Icons sit in `bg-muted/50` circular containers
3. **Typography**:
   - Title: `text-lg font-semibold text-foreground`
   - Description: `text-sm text-muted-foreground`
4. **Spacing**:
   - Default padding: `py-12 px-4`
   - Icon margin: `mb-4`
   - Description max width: `max-w-sm`
   - Action margin: `mb-6`
5. **Centered Layout**: All content centered both horizontally and vertically

## Other Common Components

### Loading

Animated loading indicator with multiple variants.

### ThemeToggle

Toggle between light and dark modes.

### ErrorBoundary

Catches and displays React errors gracefully.

### SourceCitation

Displays data source citations with proper formatting.
