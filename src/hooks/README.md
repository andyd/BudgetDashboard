# Budget Data Hooks

This directory contains React hooks for fetching budget data from the API.

## Available Hooks

### `useBudgetData(path?: string[])`

Fetches the budget hierarchy or a specific budget item by path.

**Parameters:**

- `path` (optional): Array of IDs to drill down into hierarchy (e.g., `['dept-defense', 'army']`)

**Returns:**

```typescript
{
  data: BudgetHierarchy | AnyBudgetItem | null;
  loading: boolean;
  error: Error | null;
}
```

**Examples:**

```tsx
// Fetch entire budget hierarchy
function BudgetOverview() {
  const { data, loading, error } = useBudgetData();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return <BudgetTreemap data={data} />;
}

// Fetch specific department
function DepartmentView({ deptId }: { deptId: string }) {
  const { data, loading, error } = useBudgetData([deptId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return <DepartmentDetails department={data} />;
}

// Drill down to program level
function ProgramView({ deptId, agencyId, programId }: Props) {
  const { data, loading, error } = useBudgetData([deptId, agencyId, programId]);

  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {data && <ProgramDetails program={data} />}
    </div>
  );
}
```

---

### `useComparisons(featured?: boolean)`

Fetches budget comparisons with optional filter for featured only.

**Parameters:**

- `featured` (optional): If `true`, only returns featured comparisons

**Returns:**

```typescript
{
  data: Comparison[] | null;
  loading: boolean;
  error: Error | null;
}
```

**Examples:**

```tsx
// Fetch all comparisons
function ComparisonsList() {
  const { data: comparisons, loading, error } = useComparisons();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {comparisons?.map((comp) => (
        <ComparisonCard key={comp.id} comparison={comp} />
      ))}
    </div>
  );
}

// Fetch only featured comparisons
function FeaturedSection() {
  const { data: featured, loading, error } = useComparisons(true);

  return (
    <section>
      <h2>Featured Comparisons</h2>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {featured && <ComparisonCarousel items={featured} />}
    </section>
  );
}
```

---

### `useUnits()`

Fetches all available comparison units.

**Returns:**

```typescript
{
  data: Unit[] | null;
  loading: boolean;
  error: Error | null;
}
```

**Examples:**

```tsx
// Unit selector dropdown
function UnitSelector({ onSelect }: { onSelect: (unitId: string) => void }) {
  const { data: units, loading, error } = useUnits();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a unit...</option>
      {units?.map((unit) => (
        <option key={unit.id} value={unit.id}>
          {unit.name} (${unit.cost} per {unit.period})
        </option>
      ))}
    </select>
  );
}

// Unit categories list
function UnitCategories() {
  const { data: units, loading, error } = useUnits();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  const categories = units?.reduce(
    (acc, unit) => {
      if (!acc[unit.category]) acc[unit.category] = [];
      acc[unit.category].push(unit);
      return acc;
    },
    {} as Record<string, Unit[]>,
  );

  return (
    <div>
      {Object.entries(categories || {}).map(([category, categoryUnits]) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {categoryUnits.map((unit) => (
              <li key={unit.id}>{unit.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

---

### `useFeatured()`

Convenience hook that fetches only featured comparisons. Equivalent to `useComparisons(true)`.

**Returns:**

```typescript
{
  data: Comparison[] | null;
  loading: boolean;
  error: Error | null;
}
```

**Examples:**

```tsx
// Featured carousel
function FeaturedCarousel() {
  const { data: featured, loading, error } = useFeatured();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!featured || featured.length === 0) return null;

  return (
    <Carousel>
      {featured.map((comparison) => (
        <ComparisonCard key={comparison.id} comparison={comparison} />
      ))}
    </Carousel>
  );
}

// Featured count badge
function FeaturedBadge() {
  const { data: featured, loading } = useFeatured();

  if (loading || !featured) return null;

  return <Badge>{featured.length} Featured</Badge>;
}
```

## Caching Strategy

- **`useBudgetData`**: Uses `cache: 'force-cache'` for better performance as budget data changes infrequently
- **`useComparisons`**: Uses `cache: 'no-store'` to ensure fresh comparison data
- **`useUnits`**: Uses `cache: 'force-cache'` as unit definitions are static

## Error Handling

All hooks follow the same error handling pattern:

```tsx
function MyComponent() {
  const { data, loading, error } = useBudgetData();

  // Handle loading state
  if (loading) {
    return <Spinner />;
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  // Handle no data
  if (!data) {
    return <EmptyState message="No data available" />;
  }

  // Render with data
  return <YourComponent data={data} />;
}
```

## React 19 Compatibility

These hooks are compatible with React 19 and follow modern React patterns:

- Use `useState` and `useEffect` for data fetching
- Implement proper cleanup with cancellation flags
- Provide strongly typed return values
- Can be integrated with React 19's `use()` hook in Suspense boundaries if needed

## TypeScript Support

All hooks are fully typed with TypeScript strict mode:

```typescript
import {
  useBudgetData,
  useComparisons,
  useUnits,
  useFeatured,
} from "@/hooks/useBudgetData";
import type { BudgetItem, Comparison, Unit } from "@/types";

// TypeScript will infer correct types for data
const { data, loading, error } = useBudgetData();
// data: BudgetHierarchy | AnyBudgetItem | null

const { data: comparisons } = useComparisons();
// comparisons: Comparison[] | null

const { data: units } = useUnits();
// units: Unit[] | null
```
