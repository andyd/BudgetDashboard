# Comparisons API

API endpoints for managing budget comparisons that translate federal spending into tangible, real-world equivalents.

## Endpoints

### GET /api/comparisons

Returns a list of comparisons, optionally filtered to featured only.

**Query Parameters:**

- `featured` (optional): Set to `"true"` to return only featured comparisons

**Response:** 200 OK

```typescript
{
  data: Comparison[];
  error: null;
  status: "success";
}
```

**Example Requests:**

```bash
# Get all comparisons
curl http://localhost:3000/api/comparisons

# Get only featured comparisons
curl http://localhost:3000/api/comparisons?featured=true
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "cmp-1",
      "budgetItemId": "defense",
      "budgetItemName": "Defense Budget",
      "budgetAmount": 842000000000,
      "unitId": "f35-fighter-jet",
      "unitName": "F-35 Fighter Jet",
      "unitCost": 80000000,
      "result": 10525,
      "formula": "$842,000,000,000 ÷ $80,000,000 = 10,525 jets",
      "isFeatured": true,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ],
  "error": null,
  "status": "success"
}
```

---

### GET /api/comparisons/[id]

Returns a specific comparison by ID.

**URL Parameters:**

- `id`: Comparison ID (e.g., "cmp-1")

**Response:** 200 OK

```typescript
{
  data: Comparison;
  error: null;
  status: "success";
}
```

**Response:** 404 Not Found

```typescript
{
  data: null;
  error: "Comparison not found";
  status: "error";
}
```

**Example Request:**

```bash
curl http://localhost:3000/api/comparisons/cmp-1
```

**Example Response:**

```json
{
  "data": {
    "id": "cmp-1",
    "budgetItemId": "defense",
    "budgetItemName": "Defense Budget",
    "budgetAmount": 842000000000,
    "unitId": "f35-fighter-jet",
    "unitName": "F-35 Fighter Jet",
    "unitCost": 80000000,
    "result": 10525,
    "formula": "$842,000,000,000 ÷ $80,000,000 = 10,525 jets",
    "isFeatured": true,
    "createdAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  },
  "error": null,
  "status": "success"
}
```

---

### POST /api/comparisons

Creates a new custom comparison (for sharing).

**Request Body:**

```typescript
{
  budgetItemId: string;
  budgetItemName: string;
  budgetAmount: number;
  unitId: string;
  unitName: string;
  unitCost: number;
  result: number;
  formula: string;
}
```

**Response:** 201 Created

```typescript
{
  data: Comparison;
  error: null;
  status: "success";
}
```

**Response:** 400 Bad Request

```typescript
{
  data: null;
  error: "Missing required fields" | "Invalid field types";
  status: "error";
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/comparisons \
  -H "Content-Type: application/json" \
  -d '{
    "budgetItemId": "space-exploration",
    "budgetItemName": "Space Exploration",
    "budgetAmount": 50000000000,
    "unitId": "mars-rover",
    "unitName": "Mars Rover",
    "unitCost": 2500000000,
    "result": 20,
    "formula": "$50,000,000,000 ÷ $2,500,000,000 = 20 rovers"
  }'
```

**Example Response:**

```json
{
  "data": {
    "id": "cmp-1738278400000",
    "budgetItemId": "space-exploration",
    "budgetItemName": "Space Exploration",
    "budgetAmount": 50000000000,
    "unitId": "mars-rover",
    "unitName": "Mars Rover",
    "unitCost": 2500000000,
    "result": 20,
    "formula": "$50,000,000,000 ÷ $2,500,000,000 = 20 rovers",
    "isFeatured": false,
    "createdAt": "2026-01-29T...",
    "updatedAt": "2026-01-29T..."
  },
  "error": null,
  "status": "success"
}
```

---

## Type Definitions

### Comparison

```typescript
interface Comparison {
  id: string;
  budgetItemId: string;
  budgetItemName: string;
  budgetAmount: number;
  unitId: string;
  unitName: string;
  unitCost: number;
  result: number; // How many units the budget amount can buy
  formula: string; // Human-readable formula
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Mock Data

The API currently uses mock data with 7 pre-defined comparisons:

1. **Defense Budget** → F-35 Fighter Jets (10,525 jets)
2. **Medicare** → Hospital Bed Years (2.8M bed-years)
3. **Education** → Teacher Salaries (1.1M teachers)
4. **Infrastructure** → Miles of Highway (12,000 miles)
5. **NASA** → James Webb Telescopes (2.5 telescopes)
6. **Veterans Affairs** → Nursing Home Years (3.3M years)
7. **Homeland Security** → Border Patrol Agents (750k agents)

Comparisons 1-5 are featured (`isFeatured: true`), while 6-7 are custom comparisons.

## Implementation Notes

- Mock data is stored in-memory and will reset on server restart
- POST requests append to the in-memory array (not persisted)
- ID generation uses timestamps: `cmp-${Date.now()}`
- Dates are serialized as ISO 8601 strings in JSON responses
- Response format follows the project's API response pattern using `successResponse()` and `errorResponse()` helpers from `@/types/api`

## Future Implementation

When connecting to a real database:

1. Replace `MOCK_COMPARISONS` array with database queries
2. Implement proper ID generation (UUID or database auto-increment)
3. Add authentication/authorization for POST endpoint
4. Add pagination for GET endpoint
5. Add PATCH/DELETE endpoints for updating/removing comparisons
6. Add validation for budget item and unit IDs (check if they exist)
7. Implement rate limiting for POST endpoint
