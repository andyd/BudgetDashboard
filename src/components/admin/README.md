# Admin Components

Components for the admin dashboard interface.

## Components

### AdminDataTable

A generic, reusable data table for admin pages with full TypeScript support.

**Key Features:**

- TypeScript generics for type-safe data handling
- Sortable columns (ascending/descending/none)
- Built-in pagination with smart page controls
- Row actions (Edit, Delete) via dropdown menu
- Loading skeleton state
- Empty state with custom messages
- Fully responsive with horizontal scroll

**Files:**

- `AdminDataTable.tsx` - Main component
- `AdminDataTable.md` - Comprehensive documentation
- `AdminDataTable.example.tsx` - Usage examples
- `index.ts` - Exports

**Quick Start:**

```tsx
import { AdminDataTable, type ColumnConfig } from "@/components/admin"

interface Item {
  id: string
  name: string
  value: number
}

const columns: ColumnConfig<Item>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
]

<AdminDataTable
  columns={columns}
  data={items}
  onEdit={(item) => console.log("Edit:", item)}
  onDelete={(item) => console.log("Delete:", item)}
  pageSize={10}
/>
```

See [AdminDataTable.md](./AdminDataTable.md) for full documentation.

### AdminSidebar

Navigation sidebar for admin pages.

### AdminAuthForm

Authentication form for admin login.

## Usage

Import components from the admin module:

```tsx
import { AdminDataTable, AdminSidebar } from "@/components/admin";
```

## Type Safety

All components use TypeScript strict mode and provide full type inference. The AdminDataTable uses generics to ensure type safety across your data model:

```tsx
// TypeScript knows the type throughout
<AdminDataTable<User>
  columns={columns}
  data={users}
  onEdit={(user) => {
    // user is typed as User
  }}
/>
```

## Styling

Components use:

- Tailwind CSS for styling
- shadcn/ui components as base
- Design tokens for consistency
- Dark mode support

## Testing

Test your admin components with Playwright:

```bash
npm run test:e2e
```

## Contributing

When adding new admin components:

1. Create the component in `src/components/admin/`
2. Export it from `index.ts`
3. Add documentation
4. Add usage examples
5. Ensure type safety with strict TypeScript
