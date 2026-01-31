import { NextRequest, NextResponse } from "next/server";
import { getItemById, getUnitById } from "@/lib/data";
import {
  calculateComparison,
  formatComparisonResult,
} from "@/lib/comparison-engine";

/**
 * GET /api/compare
 *
 * Calculate a comparison between a budget item and a comparison unit.
 *
 * Query Parameters:
 * - budgetId: string - ID of the budget item
 * - unitId: string - ID of the comparison unit
 *
 * Returns:
 * - 200: Comparison result with budget item, unit, and calculated count
 * - 400: Missing required parameters
 * - 404: Budget item or unit not found
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const budgetId = searchParams.get("budgetId");
  const unitId = searchParams.get("unitId");

  // Validate required parameters
  if (!budgetId || !unitId) {
    return NextResponse.json(
      {
        error: "Missing required parameters",
        message: "Both budgetId and unitId query parameters are required",
      },
      { status: 400 },
    );
  }

  // Look up budget item
  const budgetItem = getItemById(budgetId);
  if (!budgetItem) {
    return NextResponse.json(
      {
        error: "Budget item not found",
        message: `No budget item found with id: ${budgetId}`,
      },
      { status: 404 },
    );
  }

  // Look up comparison unit
  const unit = getUnitById(unitId);
  if (!unit) {
    return NextResponse.json(
      {
        error: "Comparison unit not found",
        message: `No comparison unit found with id: ${unitId}`,
      },
      { status: 404 },
    );
  }

  // Calculate comparison
  const calculation = calculateComparison(budgetItem.amount, unit);
  const formattedResult = formatComparisonResult(budgetItem.amount, unit);

  // Build response
  const response = {
    budgetItem: {
      id: budgetItem.id,
      name: budgetItem.name,
      amount: budgetItem.amount,
      tier: budgetItem.tier,
      fiscalYear: budgetItem.fiscalYear,
      description: budgetItem.description,
      source: budgetItem.source,
    },
    unit: {
      id: unit.id,
      name: unit.name,
      category: unit.category,
      costPerUnit: unit.costPerUnit ?? unit.cost,
      description: unit.description,
      icon: unit.icon,
    },
    comparison: {
      count: calculation.count,
      formatted: calculation.formatted,
      formattedCount: formattedResult.formattedCount,
      unitName: formattedResult.unitName,
      displayString: formattedResult.displayString,
    },
  };

  // Return response with cache headers
  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
