# OpenGraph Image Generation

The `/api/og` endpoint generates dynamic OpenGraph images for social media sharing.

## Endpoint

```
GET /api/og
```

## Query Parameters

| Parameter  | Type                         | Required | Description                        |
| ---------- | ---------------------------- | -------- | ---------------------------------- |
| `title`    | string                       | Yes      | Main headline text                 |
| `subtitle` | string                       | No       | Secondary text below title         |
| `type`     | `"comparison"` \| `"budget"` | No       | Image type (default: "comparison") |

## Usage Examples

### 1. Budget Item

```html
<meta
  property="og:image"
  content="/api/og?title=NASA%20Budget&subtitle=$25.4%20Billion&type=budget"
/>
```

**Preview:**

- Large title: "NASA Budget"
- Blue accent subtitle: "$25.4 Billion"
- Badge: "BUDGET ITEM"

### 2. Comparison

```html
<meta
  property="og:image"
  content="/api/og?title=NASA%20could%20fund%20500,000%20median%20US%20homes&type=comparison"
/>
```

**Preview:**

- Large title: "NASA could fund 500,000 median US homes"
- Badge: "COMPARISON"

### 3. Generic Share

```html
<meta
  property="og:image"
  content="/api/og?title=Federal%20Budget%20Dashboard"
/>
```

## Integration in Next.js Metadata

### Static Page

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: "Federal Budget Dashboard",
  openGraph: {
    title: "Federal Budget Dashboard",
    description: "Explore US federal spending with tangible comparisons",
    images: [
      {
        url: "/api/og?title=Federal%20Budget%20Dashboard",
        width: 1200,
        height: 630,
        alt: "Federal Budget Dashboard",
      },
    ],
  },
};
```

### Dynamic Comparison Page

```typescript
// app/compare/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = await getComparison(params.id);

  const ogUrl = new URL("/api/og", process.env.NEXT_PUBLIC_URL);
  ogUrl.searchParams.set("title", comparison.headline);
  ogUrl.searchParams.set("type", "comparison");

  return {
    title: comparison.headline,
    openGraph: {
      title: comparison.headline,
      description: comparison.description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
```

### Dynamic Budget Item Page

```typescript
// app/budget/[...path]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getBudgetItem(params.path);

  const ogUrl = new URL("/api/og", process.env.NEXT_PUBLIC_URL);
  ogUrl.searchParams.set("title", item.name);
  ogUrl.searchParams.set("subtitle", formatCurrency(item.amount));
  ogUrl.searchParams.set("type", "budget");

  return {
    title: item.name,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
```

## Design Specifications

- **Size:** 1200 × 630px (recommended by Facebook/Twitter)
- **Format:** PNG (via @vercel/og ImageResponse)
- **Background:** `#0f172a` (slate-900)
- **Primary Text:** `#f8fafc` (slate-50)
- **Accent:** `#3b82f6` (blue-500) to `#60a5fa` (blue-400) gradient
- **Font:** System UI stack (sans-serif)

## Brand Elements

1. **Logo Badge**: 💰 emoji in gradient blue rounded square
2. **Header**: "Federal Budget Dashboard" in secondary text
3. **Type Badge**: Rounded pill showing "BUDGET ITEM" or "COMPARISON"
4. **Decorative Bar**: Gradient line in bottom-right

## Testing

Test the image generation locally:

```bash
# Start dev server
pnpm dev

# Visit in browser
http://localhost:3000/api/og?title=Test%20Title&subtitle=Test%20Subtitle&type=comparison
```

Or use curl to save the image:

```bash
curl "http://localhost:3000/api/og?title=NASA%20Budget&subtitle=$25.4B&type=budget" > og-test.png
```

## Error Handling

If image generation fails, a fallback image is returned with:

- Dark background
- Centered text: "Federal Budget Dashboard"
- Same 1200×630 dimensions

## Performance

- **Runtime:** Edge (fast, globally distributed)
- **Caching:** Automatic via Vercel CDN (configurable)
- **Generation Time:** ~100-200ms on edge

## Social Media Validation

Validate generated images using:

- **Twitter:** https://cards-dev.twitter.com/validator
- **Facebook:** https://developers.facebook.com/tools/debug/
- **LinkedIn:** https://www.linkedin.com/post-inspector/
