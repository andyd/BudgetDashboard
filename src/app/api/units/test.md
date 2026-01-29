# Units API Endpoint

## Overview

The `/api/units` endpoint provides access to comparison units for translating budget amounts into tangible comparisons.

## Endpoints

### GET /api/units

Returns all comparison units, optionally filtered by category.

#### Query Parameters

- `category` (optional): Filter by category
  - Valid values: `infrastructure`, `everyday`, `vehicles`, `buildings`, `misc`

#### Response Format

```typescript
ComparisonUnit[] | { error: string }
```

Each ComparisonUnit contains:

```typescript
{
  id: string;
  name: string;                    // Plural form
  nameSingular: string;             // Singular form
  costPerUnit: number;              // Cost in dollars
  category: string;                 // Category type
  description?: string;             // Short description
  icon?: string;                    // Icon or emoji
}
```

## Examples

### Get all units

```bash
curl http://localhost:3000/api/units
```

Returns all 17 comparison units across 5 categories.

### Get infrastructure units only

```bash
curl http://localhost:3000/api/units?category=infrastructure
```

Returns units like Eiffel Towers, Golden Gate Bridges, Olympic Pools, Football Fields.

### Get everyday items

```bash
curl http://localhost:3000/api/units?category=everyday
```

Returns units like Cups of Coffee, Big Macs, Movie Tickets, iPhones.

### Error handling - invalid category

```bash
curl http://localhost:3000/api/units?category=invalid
```

Returns 400 with error message.

## Available Units

### Infrastructure (4 units)

- Eiffel Towers ($1.5B each)
- Golden Gate Bridges ($1.9B each)
- Olympic Swimming Pools ($50M each)
- Football Fields ($5M each)

### Vehicles (3 units)

- F-35 Fighter Jets ($100M each)
- M1 Abrams Tanks ($9M each)
- Tesla Model 3s ($40k each)

### Buildings (3 units)

- New Public Schools ($50M each)
- Public Libraries ($15M each)
- Community Health Centers ($25M each)

### Everyday Items (4 units)

- Cups of Coffee ($5 each)
- Big Macs ($5.50 each)
- Movie Tickets ($15 each)
- iPhones ($1,000 each)

### Miscellaneous (3 units)

- Teacher Salaries (annual) ($65k/year)
- Nurse Salaries (annual) ($85k/year)
- Median US Household Income (annual) ($75k/year)

## Caching

The endpoint includes cache headers:

- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`
- Cached for 1 hour, stale content served for up to 2 additional hours

## Error Responses

### 400 Bad Request

Invalid category parameter:

```json
{
  "error": "Invalid category. Must be one of: infrastructure, everyday, vehicles, buildings, misc"
}
```

### 500 Internal Server Error

Server error:

```json
{
  "error": "Failed to fetch comparison units"
}
```
