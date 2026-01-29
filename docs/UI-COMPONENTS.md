# 🎨 shadcn/ui Component System

This project uses **[shadcn/ui](https://ui.shadcn.com)** as the primary UI component library. shadcn/ui is not a traditional component library - instead, it's a collection of reusable components that you can copy and paste into your apps.

## 🌟 Why shadcn/ui?

- **Own Your Components** - Copy source code directly into your project
- **Fully Customizable** - Modify any component to fit your needs
- **Accessible by Default** - Built on Radix UI primitives
- **TypeScript Native** - Complete type safety out of the box
- **Tailwind Styled** - Easy to customize with utility classes
- **No Package Lock-in** - No dependency on a specific package version

## 📦 Installed Components

The following components are pre-installed and ready to use:

### Form Components

| Component    | Description                      | Docs                                                   |
| ------------ | -------------------------------- | ------------------------------------------------------ |
| **Button**   | Interactive button with variants | [Docs](https://ui.shadcn.com/docs/components/button)   |
| **Input**    | Text input field                 | [Docs](https://ui.shadcn.com/docs/components/input)    |
| **Textarea** | Multi-line text input            | [Docs](https://ui.shadcn.com/docs/components/textarea) |
| **Label**    | Accessible form label            | [Docs](https://ui.shadcn.com/docs/components/label)    |
| **Select**   | Dropdown select menu             | [Docs](https://ui.shadcn.com/docs/components/select)   |

### Layout Components

| Component     | Description                            | Docs                                                    |
| ------------- | -------------------------------------- | ------------------------------------------------------- |
| **Card**      | Container with header, content, footer | [Docs](https://ui.shadcn.com/docs/components/card)      |
| **Accordion** | Collapsible content sections           | [Docs](https://ui.shadcn.com/docs/components/accordion) |
| **Sheet**     | Side panel/drawer component            | [Docs](https://ui.shadcn.com/docs/components/sheet)     |

### Overlay Components

| Component         | Description              | Docs                                                        |
| ----------------- | ------------------------ | ----------------------------------------------------------- |
| **Dialog**        | Modal dialog overlay     | [Docs](https://ui.shadcn.com/docs/components/dialog)        |
| **Dropdown Menu** | Contextual dropdown menu | [Docs](https://ui.shadcn.com/docs/components/dropdown-menu) |

### Display Components

| Component  | Description         | Docs                                                 |
| ---------- | ------------------- | ---------------------------------------------------- |
| **Avatar** | User profile avatar | [Docs](https://ui.shadcn.com/docs/components/avatar) |
| **Badge**  | Status badge/tag    | [Docs](https://ui.shadcn.com/docs/components/badge)  |

### Navigation Components

| Component           | Description                     | Docs                                                          |
| ------------------- | ------------------------------- | ------------------------------------------------------------- |
| **Navigation Menu** | Accessible navigation component | [Docs](https://ui.shadcn.com/docs/components/navigation-menu) |

### Feedback Components

| Component  | Description         | Docs                                                 |
| ---------- | ------------------- | ---------------------------------------------------- |
| **Sonner** | Toast notifications | [Docs](https://ui.shadcn.com/docs/components/sonner) |

## 🚀 Quick Start

### Using Components

Import and use components directly in your files:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Component Variants

Most components support variants for different styles:

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔥</Button>
```

## ➕ Adding New Components

### Install a Component

Use the shadcn CLI to add any component:

```bash
# Add a single component
npx shadcn@latest add [component-name]

# Add multiple components at once
npx shadcn@latest add table form checkbox
```

### Commonly Used Components

Here are some frequently needed components you might want to add:

**Forms & Input:**

```bash
npx shadcn@latest add form checkbox radio-group switch slider
```

**Data Display:**

```bash
npx shadcn@latest add table separator skeleton tabs
```

**Overlays:**

```bash
npx shadcn@latest add popover tooltip alert-dialog hover-card
```

**Feedback:**

```bash
npx shadcn@latest add toast progress alert
```

**Utilities:**

```bash
npx shadcn@latest add calendar date-picker command combobox
```

### Browse All Components

Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components) to see all available components.

## 🎨 Customization

### Modifying Components

All component source code is in `src/components/ui/`. You can:

1. **Edit component styles** - Modify Tailwind classes
2. **Change behavior** - Update component logic
3. **Add features** - Extend functionality
4. **Remove features** - Strip down to essentials

Example - Customizing Button:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Add your custom variant
        custom: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      },
    },
  },
);
```

### Theming

Components use CSS variables for theming. Customize in `src/app/globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* Add more custom colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* Dark theme colors */
  }
}
```

## 📚 Component Patterns

### Form with Validation

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Dialog with Form

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddItemDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Item name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Item description" />
          </div>
          <Button className="w-full">Add Item</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">My Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Toast Notifications

```tsx
"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  return (
    <div className="space-x-2">
      <Button onClick={() => toast("This is a toast message")}>
        Show Toast
      </Button>
      <Button onClick={() => toast.success("Successfully saved!")}>
        Success
      </Button>
      <Button onClick={() => toast.error("Something went wrong!")}>
        Error
      </Button>
      <Button
        onClick={() =>
          toast("Event created", {
            description: "Your event has been created successfully.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        With Action
      </Button>
    </div>
  );
}
```

## 🔧 Configuration

### Components Configuration

The `components.json` file contains the configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Available Styles

shadcn/ui offers two built-in styles:

- **default** - Original style with borders
- **new-york** - Modern style (currently configured)

To switch styles, update `components.json` and re-add components.

## 📖 Resources

### Official Documentation

- **Main Site:** [ui.shadcn.com](https://ui.shadcn.com)
- **Components:** [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
- **Themes:** [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
- **Examples:** [ui.shadcn.com/examples](https://ui.shadcn.com/examples)

### Related Projects

- **Radix UI:** [radix-ui.com](https://www.radix-ui.com) - Accessible primitives
- **Lucide Icons:** [lucide.dev](https://lucide.dev) - Icon library
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com) - Utility CSS

### Community

- **GitHub:** [github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- **Discord:** Join the shadcn/ui Discord community
- **Twitter:** [@shadcn](https://twitter.com/shadcn)

## 💡 Tips & Best Practices

1. **Keep Components Customized** - Don't treat them as external dependencies
2. **Use Composition** - Combine small components to build complex UIs
3. **Leverage Variants** - Use the `cva` pattern for flexible components
4. **Type Everything** - Maintain TypeScript strictness
5. **Test Accessibility** - Components are accessible by default, keep it that way
6. **Document Changes** - Note any customizations you make
7. **Stay Updated** - Check shadcn/ui regularly for component updates

## 🆘 Troubleshooting

### Component Not Found

If you get import errors:

```bash
# Re-add the component
npx shadcn@latest add [component-name]
```

### Style Issues

Check that your `tailwind.config.ts` includes the components path:

```typescript
content: [
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  // other paths...
],
```

### TypeScript Errors

Ensure `tsconfig.json` has the correct paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

**Built with ❤️ using [shadcn/ui](https://ui.shadcn.com)**
