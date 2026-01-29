# Admin Spotlights Management

## Overview

The Admin Spotlights page provides a comprehensive interface for managing editorial spotlight content that explains budget items in detail. This feature allows administrators to create, edit, and delete spotlight content with markdown support.

## Location

**Page**: `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/app/admin/spotlights/page.tsx`

**Route**: `/admin/spotlights`

## Features

### 1. List View

- Displays all spotlight content in a sortable table
- Columns:
  - **Budget Item**: Badge showing the associated budget item name
  - **Title**: Spotlight headline
  - **Description Preview**: Truncated first 100 characters
  - **Created**: Creation date
  - **Actions**: Edit and delete buttons

### 2. Create/Edit Form

- Modal dialog with comprehensive form fields
- Fields:
  - **Budget Item** (required): Dropdown selector for budget items
  - **Title** (required): Headline text input
  - **Description** (required): Textarea with markdown support
  - **Sources**: Optional textarea for citations and URLs

### 3. Markdown Support

- Description field supports basic markdown:
  - Bold: `**text**`
  - Italic: `*text*`
  - Links: `[text](url)`
  - Lists, headings, etc.
- Live preview would be a future enhancement

### 4. Delete Confirmation

- Separate confirmation dialog prevents accidental deletions
- Shows spotlight title and budget item before deletion

### 5. Empty State

- Friendly empty state when no spotlights exist
- Call-to-action button to create first spotlight

## API Endpoints

### GET /api/spotlights

Fetch all spotlight content with budget item details.

**Response**:

```json
[
  {
    "id": "uuid",
    "budgetItemId": "uuid",
    "title": "What does Medicare do?",
    "description": "Medicare provides health insurance...",
    "createdAt": "2026-01-29T00:00:00Z",
    "budgetItem": {
      "id": "uuid",
      "name": "Medicare",
      "slug": "medicare",
      "amount": "1234567890.00"
    }
  }
]
```

### POST /api/spotlights

Create new spotlight content.

**Request Body**:

```json
{
  "budgetItemId": "uuid",
  "title": "What does Medicare do?",
  "description": "Medicare provides health insurance..."
}
```

**Response**: Created spotlight object (201)

### GET /api/spotlights/[id]

Fetch a single spotlight by ID.

### PUT /api/spotlights/[id]

Update an existing spotlight.

**Request Body**: Same as POST

### DELETE /api/spotlights/[id]

Delete a spotlight by ID.

**Response**: `{ "success": true }`

## Database Schema

From `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/lib/schema.ts`:

```typescript
export const spotlightContent = pgTable("spotlight_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  budgetItemId: uuid("budget_item_id")
    .notNull()
    .references(() => budgetItems.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Components Used

All components from shadcn/ui:

- `Button` - Primary actions and icon buttons
- `Dialog` - Modal dialogs for create/edit/delete
- `Table` - Main data table
- `Input` - Text input fields
- `Textarea` - Multi-line text fields with markdown support
- `Select` - Budget item dropdown
- `Card` - Container components
- `Badge` - Budget item tags
- `Label` - Form field labels

Icons from `lucide-react`:

- `Plus` - Add new button
- `Pencil` - Edit action
- `Trash2` - Delete action
- `AlertTriangle` - Delete warning

## State Management

Uses React hooks for local state:

```typescript
const [spotlights, setSpotlights] = useState<SpotlightContent[]>([]);
const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [editingSpotlight, setEditingSpotlight] = useState<SpotlightContent | null>(null);
const [deletingSpotlight, setDeletingSpotlight] = useState<SpotlightContent | null>(null);
const [formData, setFormData] = useState<SpotlightFormData>({...});
```

## User Interactions

### Creating a Spotlight

1. Click "Add New" button
2. Fill in form fields (budget item, title, description)
3. Optionally add sources
4. Click "Create"
5. Success toast notification
6. Dialog closes and table refreshes

### Editing a Spotlight

1. Click pencil icon in Actions column
2. Form pre-fills with existing data
3. Modify fields
4. Click "Update"
5. Success toast notification
6. Dialog closes and table refreshes

### Deleting a Spotlight

1. Click trash icon in Actions column
2. Confirmation dialog appears showing details
3. Click "Delete" to confirm or "Cancel" to abort
4. Success toast notification
5. Table refreshes

## Error Handling

- Form validation for required fields
- Network error handling with toast notifications
- 404 handling for missing spotlights
- Database error handling in API routes

## Future Enhancements

1. **Markdown Preview**: Split-pane editor with live preview
2. **Rich Text Editor**: Consider TipTap or similar for WYSIWYG editing
3. **Source Management**: Dedicated source table with validation
4. **Bulk Operations**: Multi-select for batch delete
5. **Search/Filter**: Search by title or budget item
6. **Pagination**: For large datasets
7. **Sorting**: Column-based sorting
8. **Draft Status**: Save drafts before publishing
9. **Version History**: Track changes over time
10. **Image Upload**: Support images in descriptions

## Testing Checklist

- [ ] Create new spotlight
- [ ] Edit existing spotlight
- [ ] Delete spotlight with confirmation
- [ ] Cancel delete operation
- [ ] Validate required fields
- [ ] Test markdown rendering (when implemented)
- [ ] Test with empty state
- [ ] Test with many spotlights
- [ ] Verify budget item dropdown loads
- [ ] Test error states (network failure)

## Dependencies

```json
{
  "react": "^19.1.0",
  "next": "^15.x",
  "@radix-ui/react-*": "Latest",
  "lucide-react": "Latest",
  "sonner": "Latest",
  "drizzle-orm": "Latest"
}
```

## Related Files

- Schema: `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/lib/schema.ts`
- Database: `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/lib/db.ts`
- API Routes:
  - `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/app/api/spotlights/route.ts`
  - `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/app/api/spotlights/[id]/route.ts`
