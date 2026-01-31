import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getItemById } from "@/lib/data/budget-items";
import { getUnitById } from "@/lib/data/comparison-units";
import { calculateComparison } from "@/lib/comparison-engine";

// =============================================================================
// Types
// =============================================================================

interface EmbedPageProps {
  params: Promise<{
    budgetId: string;
    unitId: string;
  }>;
  searchParams: Promise<{
    theme?: "light" | "dark";
    compact?: "true" | "false";
  }>;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format large currency values in compact form for display
 */
function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
  } else if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

/**
 * Format large numbers for display
 */
function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)} trillion`;
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)} billion`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)} million`;
  }
  if (num >= 1_000) {
    return new Intl.NumberFormat("en-US").format(Math.round(num));
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(num);
}

// =============================================================================
// Metadata Generation
// =============================================================================

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const { budgetId, unitId } = await params;

  const budgetItem = getItemById(budgetId);
  const unit = getUnitById(unitId);

  if (!budgetItem || !unit) {
    return {
      title: "Embed Not Found | Budget Dashboard",
      description: "The requested budget comparison could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const comparison = calculateComparison(budgetItem.amount, unit);
  const formattedAmount = formatCurrencyCompact(budgetItem.amount);

  const title = `${budgetItem.name}: ${formattedAmount} = ${comparison.formatted}`;
  const description = `Federal spending visualization: ${budgetItem.name} budget (${formattedAmount}) equals ${comparison.formatted}.`;

  return {
    title: `${title} | Budget Dashboard Embed`,
    description,
    robots: {
      index: false, // Embeds shouldn't be indexed directly
      follow: false,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

// =============================================================================
// Main Component
// =============================================================================

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { budgetId, unitId } = await params;
  const { theme = "light", compact = "false" } = await searchParams;

  // Look up budget item and unit
  const budgetItem = getItemById(budgetId);
  const unit = getUnitById(unitId);

  // 404 if not found
  if (!budgetItem || !unit) {
    notFound();
  }

  // Calculate comparison
  const comparison = calculateComparison(budgetItem.amount, unit);

  // Determine unit name (singular vs plural)
  const unitName =
    comparison.count !== 1
      ? unit.name || unit.pluralName || "units"
      : unit.nameSingular || unit.name || "unit";

  // Theme-based styles
  const isDark = theme === "dark";
  const isCompact = compact === "true";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://budgetdashboard.app";
  const fullPageUrl = `${baseUrl}/compare/${budgetId}/${unitId}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.5;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              .embed-container {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                padding: ${isCompact ? "12px" : "20px"};
                background: ${isDark ? "#0f172a" : "#f8fafc"};
                color: ${isDark ? "#f1f5f9" : "#1e293b"};
              }

              .card {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: ${isDark ? "#1e293b" : "#ffffff"};
                border-radius: ${isCompact ? "8px" : "12px"};
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                overflow: hidden;
                border: 1px solid ${isDark ? "#334155" : "#e2e8f0"};
              }

              .card-content {
                flex: 1;
                padding: ${isCompact ? "16px" : "24px"};
                display: flex;
                flex-direction: column;
                gap: ${isCompact ? "12px" : "16px"};
              }

              .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
              }

              .icon {
                font-size: ${isCompact ? "32px" : "40px"};
                line-height: 1;
              }

              .category-badge {
                display: inline-block;
                padding: 4px 10px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-radius: 999px;
                background: ${isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)"};
                color: ${isDark ? "#c4b5fd" : "#7c3aed"};
              }

              .title {
                font-size: ${isCompact ? "16px" : "18px"};
                font-weight: 600;
                color: ${isDark ? "#f1f5f9" : "#1e293b"};
              }

              .equation {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: ${isCompact ? "12px" : "16px"};
                padding: ${isCompact ? "16px" : "20px"};
                background: ${isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)"};
                border-radius: 8px;
                border: 1px solid ${isDark ? "#334155" : "#e2e8f0"};
                flex-wrap: wrap;
              }

              .equation-value {
                text-align: center;
                min-width: 80px;
              }

              .equation-amount {
                font-size: ${isCompact ? "24px" : "28px"};
                font-weight: 700;
                color: ${isDark ? "#c4b5fd" : "#7c3aed"};
              }

              .equation-count {
                font-size: ${isCompact ? "24px" : "28px"};
                font-weight: 700;
                color: ${isDark ? "#93c5fd" : "#2563eb"};
              }

              .equation-label {
                font-size: 11px;
                color: ${isDark ? "#94a3b8" : "#64748b"};
                margin-top: 4px;
              }

              .equation-equals {
                font-size: ${isCompact ? "20px" : "24px"};
                font-weight: 700;
                color: ${isDark ? "#475569" : "#94a3b8"};
              }

              .context {
                font-size: ${isCompact ? "12px" : "14px"};
                color: ${isDark ? "#94a3b8" : "#64748b"};
                line-height: 1.6;
                display: ${isCompact ? "none" : "block"};
              }

              .footer {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: ${isCompact ? "8px 12px" : "10px 16px"};
                background: ${isDark ? "#0f172a" : "#f1f5f9"};
                border-top: 1px solid ${isDark ? "#334155" : "#e2e8f0"};
              }

              .powered-by {
                font-size: 11px;
                color: ${isDark ? "#64748b" : "#94a3b8"};
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: color 0.2s;
              }

              .powered-by:hover {
                color: ${isDark ? "#94a3b8" : "#64748b"};
              }

              .powered-by svg {
                width: 14px;
                height: 14px;
              }

              @media (max-width: 400px) {
                .equation {
                  flex-direction: column;
                  gap: 8px;
                }

                .equation-equals {
                  transform: rotate(90deg);
                }

                .equation-amount,
                .equation-count {
                  font-size: 22px;
                }
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="embed-container">
          <div className="card">
            <div className="card-content">
              {/* Header with icon and category */}
              <div className="header">
                {unit.icon && (
                  <span className="icon" role="img" aria-label={unit.name}>
                    {unit.icon}
                  </span>
                )}
                <span className="category-badge">{unit.category}</span>
              </div>

              {/* Budget item title */}
              <h1 className="title">{budgetItem.name}</h1>

              {/* Visual equation */}
              <div className="equation">
                <div className="equation-value">
                  <div className="equation-amount">
                    {formatCurrencyCompact(budgetItem.amount)}
                  </div>
                  <div className="equation-label">Budget</div>
                </div>

                <div className="equation-equals">=</div>

                <div className="equation-value">
                  <div className="equation-count">
                    {formatLargeNumber(comparison.count)}
                  </div>
                  <div className="equation-label">{unitName}</div>
                </div>
              </div>

              {/* Context (hidden in compact mode) */}
              {!isCompact && unit.description && (
                <p className="context">{unit.description}</p>
              )}
            </div>

            {/* Footer with attribution */}
            <div className="footer">
              <a
                href={fullPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="powered-by"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Powered by Budget Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
