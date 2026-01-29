# ShareModal Integration Guide

Quick guide to integrate the ShareModal component into your comparison pages.

## Option 1: Add to Comparison Card

Update `/src/components/comparison/ComparisonCard.tsx`:

```tsx
import { ShareModal } from "./ShareModal";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

export function ComparisonCard({ comparison }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="card">
      {/* Existing card content */}

      <div className="flex gap-2 mt-4">
        {/* Existing buttons */}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsShareOpen(true)}
        >
          <Share2Icon className="size-4" />
          Share
        </Button>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        comparisonId={comparison.id}
        title={comparison.title}
      />
    </div>
  );
}
```

## Option 2: Add to Comparison Detail Page

Create or update `/src/app/compare/[id]/page.tsx`:

```tsx
"use client";

import { ShareModal } from "@/components/comparison/ShareModal";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

export default function ComparisonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch your comparison data
  // const comparison = await getComparison(params.id);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {/* comparison.title */}
            Defense Budget vs. Education
          </h1>
          <p className="text-muted-foreground">
            Compare federal spending in detail
          </p>
        </div>

        <Button onClick={() => setIsShareOpen(true)}>
          <Share2Icon className="size-4" />
          Share This Comparison
        </Button>
      </div>

      {/* Your comparison visualization and content */}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        comparisonId={params.id}
        title="Defense Budget vs. Education" // Use actual title
      />
    </div>
  );
}
```

## Option 3: Add to Featured Carousel

Update `/src/components/comparison/FeaturedCarousel.tsx`:

```tsx
import { ShareModal } from "./ShareModal";
import { useState } from "react";

export function FeaturedCarousel({ comparisons }) {
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    comparisonId: string;
    title: string;
  }>({ isOpen: false, comparisonId: "", title: "" });

  const handleShare = (comparisonId: string, title: string) => {
    setShareModal({ isOpen: true, comparisonId, title });
  };

  return (
    <div>
      {/* Carousel content */}
      {comparisons.map((comp) => (
        <div key={comp.id}>
          {/* Comparison card */}
          <Button onClick={() => handleShare(comp.id, comp.title)}>
            Share
          </Button>
        </div>
      ))}

      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ ...shareModal, isOpen: false })}
        comparisonId={shareModal.comparisonId}
        title={shareModal.title}
      />
    </div>
  );
}
```

## Option 4: Reusable Share Button Component

Create a small wrapper component:

```tsx
// /src/components/comparison/ComparisonShareButton.tsx
"use client";

import { ShareModal } from "./ShareModal";
import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

interface ComparisonShareButtonProps {
  comparisonId: string;
  title: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function ComparisonShareButton({
  comparisonId,
  title,
  variant = "outline",
  size = "default",
  showText = true,
}: ComparisonShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)}>
        <Share2Icon className="size-4" />
        {showText && "Share"}
      </Button>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        comparisonId={comparisonId}
        title={title}
      />
    </>
  );
}
```

Then use it anywhere:

```tsx
import { ComparisonShareButton } from "@/components/comparison/ComparisonShareButton";

<ComparisonShareButton
  comparisonId="defense-vs-education"
  title="Defense Budget vs. Education Spending"
  variant="outline"
  size="sm"
/>;
```

## Testing After Integration

1. **Open the page** where you added ShareModal
2. **Click the share button** - modal should open
3. **Test copy link** - should copy and show toast
4. **Test social buttons** - should open popups
5. **Toggle QR code** - should show/hide
6. **Copy embed code** - should copy and show success
7. **Press ESC** - modal should close
8. **Click outside** - modal should close

## Troubleshooting

### Modal doesn't open

- Check that `isOpen` state is being updated
- Verify `onClick` handler is connected
- Check browser console for errors

### Copy doesn't work

- Ensure page is served over HTTPS (or localhost)
- Check browser console for clipboard API errors
- Verify toast provider is mounted in your app

### Social share popups blocked

- Browser popup blocker may be active
- User needs to allow popups for the domain
- Check browser console for blocked popup warnings

### Styles look broken

- Verify Tailwind CSS is configured correctly
- Check that shadcn/ui dialog styles are imported
- Ensure CSS is being loaded

## Required Setup

Make sure you have:

1. **Toast Provider** in your app layout:

```tsx
// /src/app/layout.tsx
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

2. **Comparison Route** configured:

```
/src/app/compare/[id]/page.tsx
```

This route should accept the comparison ID and display the full comparison.

## Next Steps

After integrating:

1. Test all sharing methods work correctly
2. Verify URLs are correct for your domain
3. Consider adding analytics tracking
4. Test on mobile devices
5. Test QR code scanning works
6. Test embed code on external site

## Support

For issues or questions:

- Check ShareModal.README.md for detailed documentation
- Review docs/component-examples/ShareModal.example.tsx for usage patterns
- Check component source in ShareModal.tsx
