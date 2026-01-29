# Share Utils Usage Examples

This document demonstrates how to use the share utilities in the Budget Dashboard application.

## Table of Contents

- [Basic URL Generation](#basic-url-generation)
- [Social Media Sharing](#social-media-sharing)
- [Clipboard Operations](#clipboard-operations)
- [React Component Examples](#react-component-examples)

## Basic URL Generation

### Generate a Comparison URL

```typescript
import { encodeComparison, generateComparisonUrl } from "@/lib/share-utils";

// Create a shareable comparison URL
const comparisonId = encodeComparison("defense-2025", "starbucks-latte");
const url = generateComparisonUrl(comparisonId);
// Result: https://example.com/compare/defense-2025:starbucks-latte
```

### Generate a Budget Drill-Down URL

```typescript
import { generateBudgetUrl } from "@/lib/share-utils";

// Create a URL for a specific budget path
const url = generateBudgetUrl(["defense", "military", "navy"]);
// Result: https://example.com/budget/defense/military/navy
```

### Parse a Comparison ID

```typescript
import { parseComparisonId } from "@/lib/share-utils";

// Extract budget item and unit IDs from a comparison ID
const result = parseComparisonId("defense-2025:starbucks-latte");
// Result: { budgetItemId: 'defense-2025', unitId: 'starbucks-latte' }

// Handle invalid IDs
const invalid = parseComparisonId("invalid-format");
// Result: null
```

## Social Media Sharing

### Twitter/X Share

```typescript
import { getTwitterShareUrl, getShareText } from "@/lib/share-utils";

const comparison: ComparisonResult = {
  budgetItemName: "Defense Budget",
  budgetAmount: 800000000000,
  unitName: "Starbucks Latte",
  unitCount: 160000000000,
  formattedString: "The Defense Budget equals 160 billion lattes",
};

const shareUrl = "https://example.com/compare/defense-2025:starbucks-latte";
const shareText = getShareText(comparison);
const twitterUrl = getTwitterShareUrl(shareUrl, shareText);

// Open in new window
window.open(twitterUrl, "_blank");
```

### Facebook Share

```typescript
import { getFacebookShareUrl } from "@/lib/share-utils";

const shareUrl = "https://example.com/compare/defense-2025:starbucks-latte";
const facebookUrl = getFacebookShareUrl(shareUrl);

window.open(facebookUrl, "_blank");
```

### LinkedIn Share

```typescript
import { getLinkedInShareUrl } from "@/lib/share-utils";

const shareUrl = "https://example.com/compare/defense-2025:starbucks-latte";
const linkedInUrl = getLinkedInShareUrl(shareUrl, "Budget Comparison");

window.open(linkedInUrl, "_blank");
```

### Get All Share URLs at Once

```typescript
import { getAllShareUrls } from "@/lib/share-utils";

const comparison: ComparisonResult = {
  budgetItemName: "Defense Budget",
  budgetAmount: 800000000000,
  unitName: "Starbucks Latte",
  unitCount: 160000000000,
  formattedString: "The Defense Budget equals 160 billion lattes",
};

const comparisonId = "defense-2025:starbucks-latte";
const shareUrls = getAllShareUrls(comparisonId, comparison);

// Result:
// {
//   url: 'https://example.com/compare/defense-2025:starbucks-latte',
//   text: 'The Defense Budget equals 160 billion lattes 🤯',
//   twitter: 'https://twitter.com/intent/tweet?...',
//   facebook: 'https://www.facebook.com/sharer/...',
//   linkedin: 'https://www.linkedin.com/sharing/...'
// }
```

## Clipboard Operations

### Copy URL to Clipboard

```typescript
import { copyToClipboard } from "@/lib/share-utils";

async function handleCopyLink() {
  const url = "https://example.com/compare/defense-2025:starbucks-latte";
  const success = await copyToClipboard(url);

  if (success) {
    console.log("Link copied to clipboard!");
  } else {
    console.error("Failed to copy link");
  }
}
```

## React Component Examples

### ShareButton Component

```tsx
"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard, getAllShareUrls } from "@/lib/share-utils";
import type { ComparisonResult } from "@/types/comparison";

interface ShareButtonProps {
  comparisonId: string;
  comparison: ComparisonResult;
}

export function ShareButton({ comparisonId, comparison }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrls = getAllShareUrls(comparisonId, comparison);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrls.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: "twitter" | "facebook" | "linkedin") => {
    const url = shareUrls[platform];
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")}>
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Simple Copy Link Button

```tsx
"use client";

import { useState } from "react";
import { Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard, generateComparisonUrl } from "@/lib/share-utils";

interface CopyLinkButtonProps {
  comparisonId: string;
}

export function CopyLinkButton({ comparisonId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = generateComparisonUrl(comparisonId);
    const success = await copyToClipboard(url);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
```

### Social Share Buttons

```tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  getTwitterShareUrl,
  getFacebookShareUrl,
  getLinkedInShareUrl,
} from "@/lib/share-utils";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export function SocialShareButtons({
  url,
  title,
  description,
}: SocialShareButtonsProps) {
  const handleShare = (platform: "twitter" | "facebook" | "linkedin") => {
    let shareUrl: string;

    switch (platform) {
      case "twitter":
        shareUrl = getTwitterShareUrl(url, `${title} - ${description}`);
        break;
      case "facebook":
        shareUrl = getFacebookShareUrl(url);
        break;
      case "linkedin":
        shareUrl = getLinkedInShareUrl(url, title);
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
      >
        Share on Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
      >
        Share on Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
      >
        Share on LinkedIn
      </Button>
    </div>
  );
}
```

## URL Structure

### Comparison URLs

Format: `/compare/{budgetItemId}:{unitId}`

Example: `/compare/defense-2025:starbucks-latte`

### Budget Drill-Down URLs

Format: `/budget/{segment1}/{segment2}/{segment3}/...`

Example: `/budget/defense/military/navy`

## Error Handling

All utility functions handle errors gracefully:

- `parseComparisonId()` returns `null` for invalid IDs
- `copyToClipboard()` returns `false` on failure
- URL encoding/decoding is handled automatically

## Best Practices

1. **Always encode comparison IDs** using `encodeComparison()` before generating URLs
2. **Use `getAllShareUrls()`** when you need multiple share options to avoid redundant calls
3. **Provide user feedback** when copying to clipboard (show "Copied!" message)
4. **Open share URLs in new windows** with appropriate size constraints
5. **Handle clipboard failures** gracefully (show error message or fallback UI)

## Testing

See `src/lib/__tests__/share-utils.test.ts` for comprehensive test examples.
