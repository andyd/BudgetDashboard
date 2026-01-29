# AdminDataTable Component

A generic, reusable data table component for admin pages with sorting, pagination, row actions, and comprehensive state handling.

## Features

- **TypeScript Generics**: Fully typed with TypeScript generics for any data type
- **Sortable Columns**: Click column headers to sort ascending/descending
- **Pagination**: Built-in pagination with configurable page size
- **Row Actions**: Edit and Delete actions via dropdown menu
- **Loading State**: Skeleton loading animation
- **Empty State**: Beautiful empty state with custom messages
- **Responsive**: Mobile-friendly with horizontal scroll
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Customizable**: Custom render functions, styling, and behavior

## Installation

The component uses these shadcn/ui components:

- `Table` and related components
- `Button`
- `DropdownMenu`
- `Skeleton`

All required components are already installed in this project.

## Basic Usage

```tsx
import { AdminDataTable, type ColumnConfig } from "@/components/admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UsersTable() {
  const users: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
  ];

  const columns: ColumnConfig<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={users}
      onEdit={(user) => console.log("Edit user:", user)}
      onDelete={(user) => console.log("Delete user:", user)}
    />
  );
}
```

## Props

### AdminDataTableProps<T>

| Prop               | Type                   | Default             | Description                                   |
| ------------------ | ---------------------- | ------------------- | --------------------------------------------- |
| `columns`          | `ColumnConfig<T>[]`    | Required            | Column configuration array                    |
| `data`             | `T[]`                  | Required            | Array of data items (must have `id` property) |
| `onEdit`           | `(item: T) => void`    | Optional            | Callback when Edit is clicked                 |
| `onDelete`         | `(item: T) => void`    | Optional            | Callback when Delete is clicked               |
| `onReorder`        | `(items: T[]) => void` | Optional            | Callback for drag-to-reorder (future feature) |
| `isLoading`        | `boolean`              | `false`             | Show loading skeleton                         |
| `emptyMessage`     | `string`               | "No data available" | Message when data is empty                    |
| `emptyDescription` | `string`               | Optional            | Description for empty state                   |
| `pageSize`         | `number`               | `10`                | Items per page                                |
| `enableActions`    | `boolean`              | `true`              | Show actions column                           |
| `className`        | `string`               | Optional            | Additional CSS classes                        |

### ColumnConfig<T>

| Property          | Type                           | Default  | Description                    |
| ----------------- | ------------------------------ | -------- | ------------------------------ |
| `key`             | `string`                       | Required | Key to access data property    |
| `label`           | `string`                       | Required | Column header label            |
| `sortable`        | `boolean`                      | `false`  | Enable sorting for this column |
| `render`          | `(item: T) => React.ReactNode` | Optional | Custom render function         |
| `className`       | `string`                       | Optional | Cell CSS classes               |
| `headerClassName` | `string`                       | Optional | Header cell CSS classes        |

## Advanced Examples

### Custom Rendering

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (user) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{user.name}</span>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (user) => (
      <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
        {user.role}
      </Badge>
    ),
  },
];
```

### Loading State

```tsx
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState<User[]>([]);

useEffect(() => {
  fetchUsers().then((users) => {
    setData(users);
    setIsLoading(false);
  });
}, []);

return <AdminDataTable columns={columns} data={data} isLoading={isLoading} />;
```

### Custom Empty State

```tsx
<AdminDataTable
  columns={columns}
  data={[]}
  emptyMessage="No users found"
  emptyDescription="Get started by inviting your first team member."
/>
```

### Read-Only Table

```tsx
<AdminDataTable columns={columns} data={users} enableActions={false} />
```

### Custom Styling

```tsx
const columns: ColumnConfig<User>[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    className: "font-mono text-muted-foreground w-[80px]",
    headerClassName: "bg-muted/50",
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    className: "text-sm",
  },
]

<AdminDataTable
  columns={columns}
  data={users}
  className="rounded-xl shadow-lg"
  pageSize={20}
/>
```

### Handling Actions

```tsx
function handleEdit(user: User) {
  setSelectedUser(user);
  setIsDialogOpen(true);
}

function handleDelete(user: User) {
  if (confirm(`Delete ${user.name}?`)) {
    deleteUser(user.id);
  }
}

<AdminDataTable
  columns={columns}
  data={users}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>;
```

## Sorting Behavior

- **First click**: Sort ascending (A → Z, 0 → 9)
- **Second click**: Sort descending (Z → A, 9 → 0)
- **Third click**: Remove sorting (back to original order)

Sort indicators:

- ↑ Ascending
- ↓ Descending
- ⇅ No sort (default)

## Pagination

- Automatically adds pagination when items exceed page size
- Shows current range (e.g., "Showing 1 to 10 of 50 entries")
- Smart page number display (first, last, current ± 1, with ellipsis)
- Previous/Next buttons with disabled states

## TypeScript Types

The component uses TypeScript generics to provide full type safety:

```tsx
// Your data type must extend this base interface
interface BaseItem {
  id: string | number
}

// Define your data type
interface Product extends BaseItem {
  id: string
  name: string
  price: number
  stock: number
}

// TypeScript will infer types throughout
const columns: ColumnConfig<Product>[] = [...]
const products: Product[] = [...]

// Fully typed callbacks
<AdminDataTable
  columns={columns}
  data={products}
  onEdit={(product) => {
    // product is typed as Product
    console.log(product.price) // TypeScript knows this exists
  }}
/>
```

## Performance Considerations

- Memoized sorting and pagination to prevent unnecessary re-renders
- Skeleton loading prevents layout shift
- Pagination reduces DOM nodes for large datasets
- Efficient sorting algorithm (native JavaScript Array.sort)

## Accessibility

- Proper table semantics (`<table>`, `<thead>`, `<tbody>`)
- Screen reader support via `sr-only` class
- Keyboard navigation for dropdown menus
- Disabled states for buttons
- ARIA labels on icon buttons

## Future Enhancements

Potential features to add:

- [ ] Drag-to-reorder rows (implement `onReorder` prop)
- [ ] Column visibility toggle
- [ ] Export to CSV/Excel
- [ ] Bulk selection with checkboxes
- [ ] Search/filter functionality
- [ ] Column resizing
- [ ] Sticky header

## See Also

- [Examples](./AdminDataTable.example.tsx) - Complete usage examples
- [shadcn/ui Table](https://ui.shadcn.com/docs/components/table) - Base table component
- [shadcn/ui Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) - Actions menu
