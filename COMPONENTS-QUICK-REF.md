# ⚡ shadcn/ui Quick Reference

Quick reference guide for the 22 installed shadcn/ui components.

**Full Documentation:** See [docs/UI-COMPONENTS.md](./docs/UI-COMPONENTS.md) for detailed examples and patterns.

## 📦 Installed Components (22)

### ✅ Forms & Input

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

// Button
<Button variant="default|destructive|outline|secondary|ghost|link">Click</Button>
<Button size="default|sm|lg|icon">Click</Button>

// Input
<Input type="text" placeholder="Enter text..." />

// Textarea
<Textarea placeholder="Enter long text..." rows={4} />

// Label
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// Checkbox
<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms</Label>

// Switch
<Switch id="notifications" />
<Label htmlFor="notifications">Enable notifications</Label>
```

### 📦 Layout

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>

// Tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// Separator
<div>Section 1</div>
<Separator className="my-4" />
<div>Section 2</div>

// Table
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 🪟 Overlays

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

// Dialog (Modal)
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content goes here</div>
  </DialogContent>
</Dialog>

// Sheet (Drawer)
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right|left|top|bottom">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    <div>Sheet content</div>
  </SheetContent>
</Sheet>

// Popover
<Popover>
  <PopoverTrigger asChild>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div>Popover content</div>
  </PopoverContent>
</Popover>

// Tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Dropdown Menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 🎨 Display

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Avatar
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Badge
<Badge variant="default|secondary|destructive|outline">New</Badge>

// Skeleton (Loading state)
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-[250px]" />
```

### 🔔 Navigation & Feedback

```tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { toast } from "sonner";

// Navigation Menu
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <a href="/">Home</a>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>;

// Toast (Sonner) - Use in client components
("use client");

function MyComponent() {
  return <Button onClick={() => toast("Message sent!")}>Send Message</Button>;
}

// Toast variants
toast.success("Success message");
toast.error("Error message");
toast.warning("Warning message");
toast.info("Info message");
toast.promise(promise, {
  loading: "Loading...",
  success: "Success!",
  error: "Error!",
});
```

## 🚀 Adding More Components

```bash
# Browse all components at ui.shadcn.com/docs/components

# Add single component
npx shadcn@latest add [component-name]

# Popular components to add:
npx shadcn@latest add form          # Advanced form handling
npx shadcn@latest add alert-dialog  # Confirmation dialogs
npx shadcn@latest add radio-group   # Radio button groups
npx shadcn@latest add slider        # Range slider
npx shadcn@latest add progress      # Progress bar
npx shadcn@latest add calendar      # Date picker calendar
npx shadcn@latest add command       # Command palette
npx shadcn@latest add combobox      # Searchable select
```

## 🎨 Common Patterns

### Form with Validation

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
```

### Data Table

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" },
];

export function UsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
              >
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Confirmation Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the item.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 💡 Tips

1. **Import from aliases** - Use `@/components/ui/*` for clean imports
2. **Use variants** - Most components support variant props for different styles
3. **Client components** - Add `'use client'` for interactive components
4. **Combine components** - Mix and match to create complex UIs
5. **Check docs** - Visit [ui.shadcn.com](https://ui.shadcn.com) for detailed examples
6. **Customize freely** - All components are in `src/components/ui/` - modify as needed

## 📚 Resources

- **Official Docs:** [ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- **All Components:** [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- **Themes:** [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
- **Examples:** [ui.shadcn.com/examples](https://ui.shadcn.com/examples)

---

**📖 For detailed examples and patterns, see [docs/UI-COMPONENTS.md](./docs/UI-COMPONENTS.md)**
