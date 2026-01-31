import { NextRequest, NextResponse } from "next/server";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import type { ComparisonUnit } from "@/types/comparison";

/**
 * Search comparison units by name and description
 *
 * Query parameters:
 * - q: Search query (required) - searches name and description
 * - category: Filter by category (optional) - comma-separated for multiple categories
 *
 * Examples:
 * /api/units/search?q=teacher
 * /api/units/search?q=health&category=healthcare
 * /api/units/search?q=cost&category=healthcare,education
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");
  const categoryParam = searchParams.get("category");

  // Validate required query parameter
  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Missing required query parameter: q" },
      { status: 400 },
    );
  }

  const searchQuery = query.toLowerCase().trim();

  // Parse categories (supports comma-separated values)
  const categories = categoryParam
    ? categoryParam.split(",").map((c) => c.trim().toLowerCase())
    : null;

  // Search and filter units
  let results = ALL_COMPARISON_UNITS.filter((unit: ComparisonUnit) => {
    // Search in name and description
    const nameMatch = unit.name.toLowerCase().includes(searchQuery);
    const descriptionMatch = unit.description
      ? unit.description.toLowerCase().includes(searchQuery)
      : false;

    return nameMatch || descriptionMatch;
  });

  // Apply category filter if provided
  if (categories && categories.length > 0) {
    results = results.filter((unit: ComparisonUnit) =>
      categories.includes(unit.category.toLowerCase()),
    );
  }

  // Limit results to 20
  const limitedResults = results.slice(0, 20);

  // Format response with category info
  const formattedResults = limitedResults.map((unit: ComparisonUnit) => ({
    id: unit.id,
    name: unit.name,
    nameSingular: unit.nameSingular,
    description: unit.description,
    category: unit.category,
    icon: unit.icon,
    cost: unit.cost ?? unit.costPerUnit,
    period: unit.period,
    source: unit.source,
  }));

  return NextResponse.json({
    query: searchQuery,
    categories: categories,
    total: results.length,
    count: limitedResults.length,
    units: formattedResults,
  });
}
