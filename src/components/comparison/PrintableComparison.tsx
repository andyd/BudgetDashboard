"use client";

import { Printer, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import type { ComparisonUnit } from "@/types/comparison";

interface SourceCitation {
  source: string;
  url: string;
  date?: string;
}

interface PrintableComparisonProps {
  /** Budget item name being compared */
  budgetItemName: string;

  /** Budget amount in dollars */
  budgetAmount: number;

  /** Comparison unit details */
  unit: ComparisonUnit;

  /** Number of comparison units */
  unitCount: number;

  /** Source citations for the data */
  sources?: SourceCitation[];

  /** Site URL to display in print footer */
  siteUrl?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * PrintableComparison
 *
 * A clean, print-optimized component for displaying budget comparisons.
 * Features print media query styles to hide interactive elements and
 * optimize layout for printing.
 */
export function PrintableComparison({
  budgetItemName,
  budgetAmount,
  unit,
  unitCount,
  sources = [],
  siteUrl = typeof window !== "undefined" ? window.location.origin : "",
  className,
}: PrintableComparisonProps) {
  const generationDate = formatDate(new Date());

  // Format numbers for display
  const formattedBudget = formatCurrency(budgetAmount, { compact: false });
  const formattedBudgetCompact = formatCurrency(budgetAmount, {
    compact: true,
  });
  const formattedUnitCount = formatNumber(Math.floor(unitCount));
  const formattedCostPerUnit = formatCurrency(
    unit.costPerUnit ?? unit.cost ?? 0,
  );

  // Determine correct unit name (singular vs plural)
  const unitName =
    unitCount === 1 ? (unit.nameSingular ?? unit.name) : unit.name;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          /* Hide non-essential elements */
          .print-hide {
            display: none !important;
          }

          /* Show print-only elements */
          .print-show {
            display: block !important;
          }

          /* Reset background and text colors for print */
          .printable-comparison {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 1px solid #e5e5e5 !important;
          }

          .printable-comparison * {
            color: black !important;
            background: white !important;
          }

          /* Ensure proper page breaks */
          .printable-comparison {
            page-break-inside: avoid;
          }

          /* Optimize link display for print */
          .print-link::after {
            content: " (" attr(href) ")";
            font-size: 0.75rem;
            color: #666 !important;
          }

          /* Footer styling for print */
          .print-footer {
            display: flex !important;
            justify-content: space-between;
            border-top: 1px solid #e5e5e5;
            padding-top: 1rem;
            margin-top: 1rem;
            font-size: 0.75rem;
            color: #666 !important;
          }

          /* Hide buttons in print */
          button {
            display: none !important;
          }
        }

        /* Screen styles for print-only elements */
        @media screen {
          .print-show {
            display: none !important;
          }

          .print-footer {
            display: none !important;
          }
        }
      `}</style>

      <Card
        className={cn(
          "printable-comparison relative overflow-hidden",
          "bg-white dark:bg-gray-950",
          "border border-gray-200 dark:border-gray-800",
          className,
        )}
      >
        <CardContent className="p-8 space-y-6">
          {/* Print Button - Hidden in print view */}
          <div className="print-hide flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Budget Comparison
            </h2>
            <p className="text-sm text-muted-foreground">
              Making federal spending tangible
            </p>
          </div>

          {/* Budget Item Name */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Budget Item
            </p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {budgetItemName}
            </h3>
          </div>

          {/* Budget Amount */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Amount
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {formattedBudget}
            </p>
            <p className="text-sm text-muted-foreground">
              ({formattedBudgetCompact})
            </p>
          </div>

          {/* Comparison Result */}
          <div className="py-6 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formattedBudgetCompact}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Budget</p>
              </div>

              <span className="text-2xl font-bold text-gray-400">=</span>

              <div className="text-center">
                {unit.icon && (
                  <span
                    className="text-3xl block mb-1"
                    role="img"
                    aria-label={unit.name}
                  >
                    {unit.icon}
                  </span>
                )}
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formattedUnitCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{unitName}</p>
              </div>
            </div>
          </div>

          {/* Unit Details */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Comparison Unit Details
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Unit Name</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {unit.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost Per Unit</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formattedCostPerUnit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {unit.category}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Count</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formattedUnitCount} {unitName}
                </p>
              </div>
            </div>
            {unit.description && (
              <p className="text-sm text-muted-foreground italic">
                {unit.description}
              </p>
            )}
          </div>

          {/* Source Citations */}
          {sources.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Sources
              </p>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index} className="text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="print-link text-blue-600 dark:text-blue-400 hover:underline print-hide"
                    >
                      {source.source}
                    </a>
                    {/* Print-only source display */}
                    <span className="print-show">
                      {source.source} - {source.url}
                    </span>
                    {source.date && (
                      <span className="text-muted-foreground ml-2">
                        (Updated: {source.date})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unit source if available */}
          {unit.source && (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Unit Data Source
              </p>
              <p className="text-sm">
                {unit.sourceUrl ? (
                  <>
                    <a
                      href={unit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="print-link text-blue-600 dark:text-blue-400 hover:underline print-hide"
                    >
                      {unit.source}
                    </a>
                    <span className="print-show">
                      {unit.source} - {unit.sourceUrl}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{unit.source}</span>
                )}
              </p>
            </div>
          )}

          {/* Print Footer - Only visible when printing */}
          <div className="print-footer">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{siteUrl}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Generated: {generationDate}</span>
            </div>
          </div>

          {/* Screen Footer - Visible on screen only */}
          <div className="print-hide pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{siteUrl}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Generated: {generationDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
