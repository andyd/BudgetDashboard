# Header Visual Guide

Visual reference for header behavior across different screen sizes.

## Desktop View (≥768px)

```
┌────────────────────────────────────────────────────────────────┐
│  USA Government Budget    Home  Budget  Compare  Sources  About │
│                            ──                                    │
└────────────────────────────────────────────────────────────────┘
```

**Features:**

- Full logo text: "USA Government Budget"
- Horizontal navigation with 5 links
- Active link has bottom border underline
- Hover states on all links
- No mobile menu button visible

**Height:** 64px (h-16)

---

## Tablet View (640px - 768px)

```
┌─────────────────────────────────────────────┐
│  USA Government Budget               ☰      │
└─────────────────────────────────────────────┘
```

**Features:**

- Full logo text: "USA Government Budget"
- Mobile menu button (hamburger icon)
- Desktop nav hidden
- Menu button size: 44x44px

**Height:** 64px (h-16)

---

## Mobile View (<640px)

```
┌──────────────────────────────┐
│  Budget Dashboard      ☰     │
└──────────────────────────────┘
```

**Features:**

- Shorter logo text: "Budget Dashboard"
- Mobile menu button (hamburger icon)
- Compact layout
- Menu button size: 40x40px

**Height:** 56px (h-14)

---

## Mobile Menu (Open State)

```
┌──────────────────────────────┐
│  Budget Dashboard      ✕     │  ← Header
└──────────────────────────────┘
                  ┌──────────────────────────┐
                  │                          │
                  │  Home                    │ ← Active (bg tint)
                  │  ───────────────────     │
                  │  Budget                  │
                  │  ───────────────────     │
                  │  Compare                 │
                  │  ───────────────────     │
                  │  Sources                 │
                  │  ───────────────────     │
                  │  About                   │
                  │                          │
                  │                          │
                  │                          │
                  │  ───────────────────     │
                  │  Visualizing federal     │
                  │  spending data           │
                  │                          │
                  │  Privacy    Terms        │
                  └──────────────────────────┘
```

**Features:**

- Slides in from right
- Width: 280px (mobile) or 320px (tablet)
- Close button (X) replaces hamburger
- Each link has 44px minimum height
- Separators between items
- Footer with tagline and legal links
- Active page has background tint

---

## State Indicators

### Desktop Navigation - Active Link

```
Budget
──────
```

- Text: `text-foreground` (full opacity)
- Underline: 2px solid line
- Position: Absolute, bottom 0

### Desktop Navigation - Inactive Link

```
Compare
```

- Text: `text-muted-foreground` (reduced opacity)
- Hover: Changes to `text-foreground`

### Mobile Menu - Active Link

```
┌────────────────────┐
│ ✓ Budget          │  ← Light background tint
└────────────────────┘
```

- Text: `text-foreground`
- Background: `bg-accent/50` (50% opacity accent color)

### Mobile Menu - Inactive Link

```
┌────────────────────┐
│ Compare            │
└────────────────────┘
```

- Text: `text-muted-foreground`
- Hover: Background changes to `bg-accent`

---

## Responsive Breakpoints

| Breakpoint | Width  | Logo Text             | Navigation           | Menu Button | Header Height |
| ---------- | ------ | --------------------- | -------------------- | ----------- | ------------- |
| Mobile S   | 320px  | Budget Dashboard      | Hidden               | 40x40px     | 56px          |
| Mobile M   | 375px  | Budget Dashboard      | Hidden               | 40x40px     | 56px          |
| Mobile L   | 425px  | Budget Dashboard      | Hidden               | 40x40px     | 56px          |
| Tablet     | 640px  | USA Government Budget | Hidden               | 44x44px     | 64px          |
| Desktop    | 768px  | USA Government Budget | Visible              | Hidden      | 64px          |
| Desktop L  | 1024px | USA Government Budget | Visible (wider gaps) | Hidden      | 64px          |

---

## Touch Target Analysis

### Mobile Menu Button

**Required:** 44x44px (WCAG AAA)
**Actual:**

- Mobile (<640px): 40x40px ⚠️ (AA compliant, but below AAA)
- Tablet (≥640px): 44x44px ✓ (AAA compliant)

**Justification:** 40px is acceptable on very small screens where 44px would be too large. Meets WCAG AA (36x36px minimum).

### Mobile Menu Links

**Required:** 44x44px (WCAG AAA)
**Actual:** 44px height ✓ (AAA compliant)

### Desktop Navigation Links

**Required:** No minimum (mouse precision)
**Actual:** Comfortable click targets with padding

---

## Color Contrast

Using theme colors ensures automatic contrast compliance:

| Element       | Light Theme     | Dark Theme       | Contrast Ratio |
| ------------- | --------------- | ---------------- | -------------- |
| Logo          | `hsl(0 0% 0%)`  | `hsl(0 0% 100%)` | 21:1 ✓         |
| Active Link   | `hsl(0 0% 0%)`  | `hsl(0 0% 100%)` | 21:1 ✓         |
| Inactive Link | `hsl(0 0% 45%)` | `hsl(0 0% 65%)`  | 4.6:1 ✓        |
| Border        | Auto-calculated | Auto-calculated  | ≥3:1 ✓         |

All meet WCAG AA requirements (4.5:1 for normal text, 3:1 for UI components).

---

## Animation Timing

### Mobile Menu

**Open:**

- Duration: 500ms
- Easing: ease-in-out
- Direction: Slide from right

**Close:**

- Duration: 300ms
- Easing: ease-in-out
- Direction: Slide to right

**Overlay:**

- Fade in: Synchronized with slide
- Fade out: Synchronized with slide

---

## Focus States

### Desktop Links

```
┌─────────────────────┐
│ Budget              │  ← 2px ring, 2px offset
└─────────────────────┘
```

**Keyboard focus:**

- Ring: 2px solid
- Color: `ring` theme color
- Offset: 2px
- Border radius: 2px (sm)

### Mobile Menu Button

```
┌──────┐
│  ☰   │  ← 2px ring, 2px offset
└──────┘
```

**Same styling as desktop links**

### Mobile Menu Links

```
┌────────────────────┐
│ Budget            │  ← 2px ring, 2px offset
└────────────────────┘
```

**Same styling, works with rounded corners**

---

## Z-Index Layers

```
Sheet Overlay:      z-50 (Dark overlay)
Sheet Content:      z-50 (Menu panel)
Header:             z-50 (Sticky header)
Page Content:       z-0  (Below header)
```

All header-related components use `z-50` to ensure they stay above page content when scrolling.

---

## Accessibility Features Summary

✓ Semantic HTML (`<header>`, `<nav>`)
✓ ARIA landmarks (`aria-label` on nav elements)
✓ ARIA states (`aria-current="page"` for active links)
✓ Screen reader support (visually hidden SheetTitle)
✓ Keyboard navigation (focus visible states)
✓ Sufficient touch targets (≥40px, aim for 44px)
✓ Color contrast (≥4.5:1 for text)
✓ Proper heading hierarchy
✓ Focus trap in modal (handled by Sheet component)
✓ Escape key support (handled by Sheet component)

---

## Implementation Notes

**Tailwind Classes Used:**

- Spacing: `px-4`, `sm:px-6`, `lg:px-8`, `gap-4`, `gap-6`, `gap-8`
- Typography: `text-base`, `text-lg`, `text-xl`, `font-bold`, `font-medium`
- Colors: `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-accent`
- Layout: `flex`, `items-center`, `justify-between`, `min-w-0`, `flex-shrink`
- Responsive: `sm:`, `md:`, `lg:` prefixes
- States: `hover:`, `focus-visible:`, `after:` pseudo-elements
- Sizing: `h-14`, `h-16`, `w-10`, `w-11`, `min-h-[44px]`

**Custom Utilities:**

- `cn()` - Merges Tailwind classes with clsx + tailwind-merge
- `truncate` - Prevents logo text overflow
- `sr-only` - Screen reader only content
- `backdrop-blur` - Modern blur effect on header
- `sticky top-0` - Header stays at top when scrolling

---

## Browser Testing Checklist

### Chrome (Latest)

- [ ] Desktop navigation works
- [ ] Mobile menu opens/closes
- [ ] Active states show correctly
- [ ] Focus states visible
- [ ] Animations smooth

### Safari (Latest)

- [ ] Backdrop blur renders
- [ ] Touch interactions work
- [ ] Sheet animations smooth
- [ ] iOS safe area respected

### Firefox (Latest)

- [ ] All features functional
- [ ] CSS Grid support verified
- [ ] Focus outlines visible

### Edge (Latest)

- [ ] Identical to Chrome behavior
- [ ] No rendering issues

### Mobile Safari (iOS)

- [ ] Touch targets comfortable
- [ ] Menu slides smoothly
- [ ] No zoom on button tap
- [ ] Safe area padding correct

### Chrome Mobile (Android)

- [ ] Touch targets comfortable
- [ ] Menu slides smoothly
- [ ] Material ripple effects
- [ ] Back button closes menu
