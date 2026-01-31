import { NextRequest, NextResponse } from "next/server";
import { ALL_BUDGET_ITEMS } from "@/lib/data";

interface SearchResult {
  id: string;
  name: string;
  amount: number;
  tier: string;
  score: number;
}

/**
 * Calculates a relevance score for a budget item based on the search query.
 * Higher scores indicate better matches.
 *
 * Scoring:
 * - Exact match on id: 100
 * - Exact match on name (case-insensitive): 90
 * - Name starts with query: 70
 * - Id starts with query: 60
 * - Name contains query as word boundary: 50
 * - Name contains query anywhere: 30
 * - Id contains query: 20
 */
function calculateRelevanceScore(
  item: { id: string; name: string },
  query: string,
): number {
  const lowerQuery = query.toLowerCase();
  const lowerName = item.name.toLowerCase();
  const lowerId = item.id.toLowerCase();

  // Exact matches
  if (lowerId === lowerQuery) return 100;
  if (lowerName === lowerQuery) return 90;

  // Starts with
  if (lowerName.startsWith(lowerQuery)) return 70;
  if (lowerId.startsWith(lowerQuery)) return 60;

  // Word boundary match (e.g., "defense" matches "Department of Defense")
  const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(lowerQuery)}`, "i");
  if (wordBoundaryRegex.test(lowerName)) return 50;

  // Contains anywhere
  if (lowerName.includes(lowerQuery)) return 30;
  if (lowerId.includes(lowerQuery)) return 20;

  return 0;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Budget Search API
 *
 * Searches budget items by name and id with relevance scoring.
 *
 * Query parameters:
 * - q: Search query string (required for results, returns empty array if missing)
 *
 * Returns:
 * - Array of matching items (max 20) sorted by relevance score
 *
 * Example:
 * GET /api/budget/search?q=defense
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  // Handle empty queries gracefully
  if (!query) {
    return NextResponse.json({
      results: [],
      query: "",
      total: 0,
    });
  }

  // Search and score all items
  const scoredItems: SearchResult[] = ALL_BUDGET_ITEMS.map((item) => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    tier: item.tier,
    score: calculateRelevanceScore(item, query),
  }))
    .filter((item) => item.score > 0) // Only include matches
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 20); // Limit to 20 results

  return NextResponse.json({
    results: scoredItems,
    query,
    total: scoredItems.length,
  });
}
