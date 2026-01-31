import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getItemById, getUnitById } from "@/lib/data";
import { calculateComparison } from "@/lib/comparison-engine";

export const runtime = "edge";

/**
 * Generates dynamic OpenGraph images for budget comparisons
 *
 * Query parameters:
 * - budgetId: Budget item ID (required)
 * - unitId: Comparison unit ID (required)
 *
 * Example:
 * /api/og/comparison?budgetId=dept-defense&unitId=teacher-salary
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const budgetId = searchParams.get("budgetId");
    const unitId = searchParams.get("unitId");

    if (!budgetId || !unitId) {
      return new Response("Missing required parameters: budgetId and unitId", {
        status: 400,
      });
    }

    const budgetItem = getItemById(budgetId);
    const comparisonUnit = getUnitById(unitId);

    if (!budgetItem) {
      return new Response(`Budget item not found: ${budgetId}`, {
        status: 404,
      });
    }

    if (!comparisonUnit) {
      return new Response(`Comparison unit not found: ${unitId}`, {
        status: 404,
      });
    }

    // Calculate the comparison using the comparison engine
    const comparison = calculateComparison(budgetItem.amount, comparisonUnit);

    // Format the spending amount
    const formattedAmount = formatCurrency(budgetItem.amount);

    // Get the unit name (singular or plural based on count)
    const unitName =
      comparison.count === 1
        ? comparisonUnit.nameSingular || comparisonUnit.name
        : comparisonUnit.name;

    // Format the unit count for display
    const formattedCount = formatCompactNumber(comparison.count);

    // Create the headline with budget item name and count
    const headline = `${budgetItem.name}`;

    // Create the comparison line
    const comparisonLine = `= ${formatNumber(comparison.count)} ${capitalizeFirst(unitName)}`;

    // Brand colors matching the dashboard
    const colors = {
      background: "#0f172a", // slate-900
      primary: "#3b82f6", // blue-500
      text: "#f8fafc", // slate-50
      textSecondary: "#94a3b8", // slate-400
      accent: "#60a5fa", // blue-400
      success: "#22c55e", // green-500
    };

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: colors.background,
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            💰
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: colors.textSecondary,
              letterSpacing: "-0.01em",
            }}
          >
            Federal Budget Dashboard
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1040px",
          }}
        >
          {/* Budget Item Name */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: "700",
              color: colors.text,
              lineHeight: "1.15",
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {headline}
          </div>

          {/* Count Display */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: colors.success,
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {comparisonUnit.icon && (
              <span style={{ fontSize: "64px" }}>{comparisonUnit.icon}</span>
            )}
            {comparisonLine}
          </div>

          {/* Amount Subtitle */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: "500",
              color: colors.textSecondary,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {formattedAmount} ({formattedCount} {unitName})
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Source Citation */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: colors.textSecondary,
                display: "flex",
              }}
            >
              Sources: {budgetItem.source} | {comparisonUnit.source}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: colors.primary,
                display: "flex",
              }}
            >
              budgetdashboard.gov
            </div>
          </div>

          {/* Comparison Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "12px 28px",
                borderRadius: "9999px",
                backgroundColor: colors.primary + "20",
                border: `2px solid ${colors.primary}`,
                fontSize: "18px",
                fontWeight: "600",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
              }}
            >
              Comparison
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback error response
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          fontSize: "48px",
          fontWeight: "700",
          fontFamily: "system-ui",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex" }}>Federal Budget Dashboard</div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "400",
            color: "#94a3b8",
            display: "flex",
          }}
        >
          Budget Comparison
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }
}

/**
 * Formats a number as currency (billions, millions, or thousands)
 */
function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  } else if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}

/**
 * Formats a number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Formats a number in compact notation (K, M, B)
 */
function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  } else {
    return num.toString();
  }
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
