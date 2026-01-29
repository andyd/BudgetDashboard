# Share Utils API Reference

Complete API documentation for the share utilities module.

## Location

`src/lib/share-utils.ts`

## Functions

### `encodeComparison(budgetItemId: string, unitId: string): string`

Encodes a budget item ID and unit ID into a URL-safe comparison identifier.

**Parameters:**

- `budgetItemId` - ID of the budget item
- `unitId` - ID of the comparison unit

**Returns:** URL-safe encoded comparison ID in format `{budgetItemId}:{unitId}`

**Example:**

```typescript
encodeComparison("defense-2025", "starbucks-latte");
// Returns: 'defense-2025:starbucks-latte'
```

---

### `parseComparisonId(id: string): { budgetItemId: string; unitId: string } | null`

Parses an encoded comparison ID back into its component parts.

**Parameters:**

- `id` - Encoded comparison ID

**Returns:** Object with `budgetItemId` and `unitId`, or `null` if invalid

**Example:**

```typescript
parseComparisonId("defense-2025:starbucks-latte");
// Returns: { budgetItemId: 'defense-2025', unitId: 'starbucks-latte' }

parseComparisonId("invalid");
// Returns: null
```

---

### `generateComparisonUrl(comparisonId: string): string`

Generates a complete shareable URL for a comparison.

**Parameters:**

- `comparisonId` - Encoded comparison ID (from `encodeComparison`)

**Returns:** Full URL to the comparison page

**Example:**

```typescript
generateComparisonUrl("defense-2025:starbucks-latte");
// Returns: 'https://example.com/compare/defense-2025:starbucks-latte'
```

---

### `generateBudgetUrl(path: string[]): string`

Generates a shareable URL for a budget drill-down path.

**Parameters:**

- `path` - Array of budget item IDs representing the drill-down hierarchy

**Returns:** Full URL to the budget path

**Example:**

```typescript
generateBudgetUrl(["defense", "military", "navy"]);
// Returns: 'https://example.com/budget/defense/military/navy'
```

---

### `getShareText(comparison: ComparisonResult): string`

Generates engaging, human-readable share text for social media.

**Parameters:**

- `comparison` - Comparison result object with formatted string

**Returns:** Share text with appropriate emoji

**Example:**

```typescript
getShareText({
  budgetItemName: "Defense Budget",
  budgetAmount: 800000000000,
  unitName: "Starbucks Latte",
  unitCount: 160000000000,
  formattedString: "The Defense Budget equals 160 billion lattes",
});
// Returns: 'The Defense Budget equals 160 billion lattes 🤯'
```

---

### `getTwitterShareUrl(url: string, text: string): string`

Generates a Twitter/X share URL.

**Parameters:**

- `url` - URL to share
- `text` - Text to include in the tweet

**Returns:** Twitter share URL

**Example:**

```typescript
getTwitterShareUrl("https://example.com/compare/abc", "Check this out!");
// Returns: 'https://twitter.com/intent/tweet?url=...&text=...'
```

---

### `getFacebookShareUrl(url: string): string`

Generates a Facebook share URL.

**Parameters:**

- `url` - URL to share

**Returns:** Facebook share URL

**Example:**

```typescript
getFacebookShareUrl("https://example.com/compare/abc");
// Returns: 'https://www.facebook.com/sharer/sharer.php?u=...'
```

---

### `getLinkedInShareUrl(url: string, title?: string): string`

Generates a LinkedIn share URL.

**Parameters:**

- `url` - URL to share
- `title` - Optional title for the share

**Returns:** LinkedIn share URL

**Example:**

```typescript
getLinkedInShareUrl("https://example.com/compare/abc", "Budget Comparison");
// Returns: 'https://www.linkedin.com/sharing/share-offsite/?url=...'
```

---

### `copyToClipboard(text: string): Promise<boolean>`

Copies text to clipboard using the modern Clipboard API with legacy fallback.

**Parameters:**

- `text` - Text to copy to clipboard

**Returns:** Promise that resolves to `true` if successful, `false` otherwise

**Example:**

```typescript
const success = await copyToClipboard("https://example.com/compare/abc");
if (success) {
  console.log("Link copied!");
}
```

---

### `getAllShareUrls(comparisonId: string, comparison: ComparisonResult): object`

Generates all share URLs at once. Convenience function that returns all social media share links.

**Parameters:**

- `comparisonId` - Encoded comparison ID
- `comparison` - Comparison result data for share text

**Returns:** Object with all share URLs:

```typescript
{
  url: string; // Comparison page URL
  text: string; // Share text with emoji
  twitter: string; // Twitter share URL
  facebook: string; // Facebook share URL
  linkedin: string; // LinkedIn share URL
}
```

**Example:**

```typescript
const shareUrls = getAllShareUrls(
  "defense-2025:starbucks-latte",
  comparisonResult,
);
// Returns:
// {
//   url: 'https://example.com/compare/defense-2025:starbucks-latte',
//   text: 'The Defense Budget equals 160 billion lattes 🤯',
//   twitter: 'https://twitter.com/intent/tweet?...',
//   facebook: 'https://www.facebook.com/sharer/...',
//   linkedin: 'https://www.linkedin.com/sharing/...'
// }
```

## Types

### `ComparisonResult`

```typescript
interface ComparisonResult {
  budgetItemName: string;
  budgetAmount: number;
  unitName: string;
  unitCount: number;
  formattedString: string;
  category?: string;
}
```

## URL Formats

### Comparison URLs

- **Format:** `/compare/{budgetItemId}:{unitId}`
- **Example:** `/compare/defense-2025:starbucks-latte`

### Budget Drill-Down URLs

- **Format:** `/budget/{segment1}/{segment2}/{segment3}/...`
- **Example:** `/budget/defense/military/navy`

## Environment Variables

The utilities use the following environment variable:

- `NEXT_PUBLIC_APP_URL` - Base URL for the application (e.g., `https://example.com`)
  - Falls back to `http://localhost:3000` in development
  - Client-side uses `window.location.origin`

## Browser Compatibility

- **Clipboard API:** Modern browsers with secure context (HTTPS)
- **Fallback:** Uses `document.execCommand('copy')` for older browsers
- **URL Encoding:** Standard `encodeURIComponent` / `decodeURIComponent`

## Error Handling

All functions handle errors gracefully:

- `parseComparisonId()` - Returns `null` for invalid input
- `copyToClipboard()` - Returns `false` on failure, logs error to console
- URL encoding/decoding - Wrapped in try-catch blocks

## Testing

Test file: `src/lib/__tests__/share-utils.test.ts`

Run tests:

```bash
pnpm test:unit
```

## Usage Examples

See `docs/examples/share-utils-usage.md` for comprehensive usage examples including React components.
