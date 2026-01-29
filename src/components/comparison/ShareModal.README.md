# ShareModal Component

A comprehensive sharing modal for budget comparisons with multiple sharing options including social media, QR codes, and embed codes.

## Features

- **Copy Link**: One-click copy to clipboard with success feedback
- **Social Sharing**: Pre-configured share buttons for Twitter/X, Facebook, and LinkedIn
- **QR Code**: Generate and display QR code for mobile sharing
- **Embed Code**: Copyable iframe embed code for websites
- **Preview**: Shows what will be shared before sharing
- **Toast Notifications**: User feedback via sonner toast notifications
- **Responsive**: Works on mobile and desktop

## Installation

This component uses the following dependencies (already installed):

```json
{
  "lucide-react": "^0.542.0",
  "sonner": "^2.0.7",
  "@radix-ui/react-dialog": "^1.1.15"
}
```

## Usage

### Basic Example

```tsx
import { ShareModal } from "@/components/comparison/ShareModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function MyComponent() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsShareOpen(true)}>Share</Button>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        comparisonId="defense-budget-2024"
        title="Defense Budget vs. Education Spending"
      />
    </>
  );
}
```

### With Share Button Component

```tsx
import { ShareModal } from "@/components/comparison/ShareModal";
import { Share2Icon } from "lucide-react";
import { useState } from "react";

function ShareButton({
  comparisonId,
  title,
}: {
  comparisonId: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted"
      >
        <Share2Icon className="size-4" />
        Share
      </button>

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

### In a Comparison Detail Page

```tsx
"use client";

import { ShareModal } from "@/components/comparison/ShareModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ComparisonPage({ params }: { params: { id: string } }) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch your comparison data
  const comparison = {
    id: params.id,
    title: "Military Spending vs. Infrastructure Budget",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>{comparison.title}</h1>
        <Button onClick={() => setIsShareOpen(true)}>
          Share This Comparison
        </Button>
      </div>

      {/* Your comparison content */}

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

## Props

| Prop           | Type         | Required | Description                                        |
| -------------- | ------------ | -------- | -------------------------------------------------- |
| `isOpen`       | `boolean`    | Yes      | Controls whether the modal is visible              |
| `onClose`      | `() => void` | Yes      | Callback when modal should close                   |
| `comparisonId` | `string`     | Yes      | Unique identifier for the comparison (used in URL) |
| `title`        | `string`     | Yes      | Title of the comparison to share                   |

## Features in Detail

### 1. Copy Link

- Automatically generates shareable URL based on `comparisonId`
- One-click copy to clipboard
- Visual feedback with checkmark icon
- Toast notification on success/failure
- Format: `{origin}/compare/{comparisonId}`

### 2. Social Media Sharing

Opens sharing dialogs in popup windows for:

- **Twitter/X**: Pre-filled tweet with title and URL
- **Facebook**: Facebook share dialog
- **LinkedIn**: LinkedIn share dialog

### 3. QR Code

- Toggle show/hide for cleaner UI
- Generated via QR Server API
- 200x200px size
- Perfect for mobile device scanning
- White background for better scanning

### 4. Embed Code

- Pre-formatted iframe code
- Copyable with one click
- Visual feedback when copied
- Responsive (width: 100%, height: 600px)
- No frameborder, allows fullscreen

### 5. Preview Section

- Shows the title that will be shared
- Displays a preview description
- Helps users confirm what they're sharing

## Customization

### Changing QR Code Size

```tsx
// In ShareModal.tsx, modify the qrCodeUrl memo:
const qrCodeUrl = React.useMemo(() => {
  if (!shareUrl) return "";
  const encodedUrl = encodeURIComponent(shareUrl);
  // Change size parameter (e.g., 300x300)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
}, [shareUrl]);
```

### Custom Share URL

```tsx
// Override the share URL generation
const customShareUrl = `https://mycustomdomain.com/comparisons/${comparisonId}`;

<ShareModal
  isOpen={isOpen}
  onClose={onClose}
  comparisonId={comparisonId}
  title={title}
  // Note: Would need to modify component to accept custom URL
/>;
```

### Adding More Social Platforms

Add to the `socialUrls` memo and create corresponding buttons:

```tsx
const socialUrls = React.useMemo(() => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    // Add Reddit
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    // Add Email
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}, [shareUrl, title]);
```

## Accessibility

- Keyboard navigation supported via Dialog component
- Focus trap when modal is open
- ESC key closes modal
- Screen reader friendly labels
- High contrast mode compatible

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires `navigator.clipboard` API for copy functionality
  - Falls back to toast error if unavailable

## Dependencies

### UI Components

- `@/components/ui/button`
- `@/components/ui/dialog`
- `@/components/ui/input`

### Icons (Lucide React)

- `CheckIcon`
- `CopyIcon`
- `FacebookIcon`
- `LinkedinIcon`
- `LinkIcon`
- `QrCodeIcon`
- `Share2Icon`
- `XIcon`

### Toast Notifications

- `sonner` for success/error feedback

## Notes

- The QR code is generated using the free QR Server API (https://goqr.me/api/)
- Social share URLs open in popup windows (600x400px)
- All copy actions provide immediate feedback
- Modal state resets when closed
- Works with SSR (uses `window` checks for URL generation)

## Future Enhancements

Potential features to add:

1. **Download QR Code**: Add button to download QR code as PNG
2. **Custom QR Styling**: Add color/logo options to QR code
3. **Share Analytics**: Track which sharing methods are used
4. **Short URL**: Integrate URL shortener service
5. **Email Share**: Direct email composition with pre-filled content
6. **WhatsApp Share**: Mobile-friendly WhatsApp sharing
7. **Copy Image**: Generate and copy share card image
8. **Custom Share Text**: Allow customization of social share text

## Troubleshooting

### Copy not working

- Ensure HTTPS or localhost (clipboard API requirement)
- Check browser permissions
- Verify `navigator.clipboard` is available

### QR Code not loading

- Check network connectivity
- Verify QR Server API is accessible
- Check if URL is properly encoded

### Social share popup blocked

- Browser popup blocker may be active
- User needs to allow popups for this domain
- Alternatively, share links can open in new tab

## Related Components

- `ComparisonCard` - Display individual comparisons
- `ComparisonBuilder` - Create new comparisons
- `ShareButton` - Simplified share trigger button
