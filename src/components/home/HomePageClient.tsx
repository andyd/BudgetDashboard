"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BudgetPieChart } from "@/components/budget/BudgetPieChart";
import { DataFreshnessIndicator } from "@/components/budget/DataFreshnessIndicator";
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import { ComparisonCardMini } from "@/components/comparison/ComparisonCardMini";
import { calculateComparison } from "@/lib/comparison-engine";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";
import type { ComparisonUnit } from "@/types/comparison";

interface HomePageClientProps {
  budgetData: BudgetHierarchy;
  budgetItems: BudgetItem[];
  currentFiscalYear: number;
  lastUpdated: Date;
}

// Pre-selected comparisons for variety and impact
const EXAMPLE_COMPARISONS: Array<{
  budgetItemId: string;
  budgetItemName: string;
  budgetAmount: number;
  unitId: string;
}> = [
  {
    budgetItemId: "f35-program",
    budgetItemName: "F-35 Fighter Program",
    budgetAmount: 13_200_000_000,
    unitId: "teacher-salary",
  },
  {
    budgetItemId: "ice-detention",
    budgetItemName: "ICE Detention Operations",
    budgetAmount: 3_500_000_000,
    unitId: "pell-grant",
  },
  {
    budgetItemId: "nasa",
    budgetItemName: "NASA Budget",
    budgetAmount: 25_000_000_000,
    unitId: "school-construction",
  },
  {
    budgetItemId: "border-wall",
    budgetItemName: "Border Wall Construction",
    budgetAmount: 1_200_000_000,
    unitId: "affordable-housing",
  },
  {
    budgetItemId: "trump-inaugural",
    budgetItemName: "Trump Inaugural Balls",
    budgetAmount: 25_000_000,
    unitId: "health-insurance-annual",
  },
  {
    budgetItemId: "presidential-travel",
    budgetItemName: "Presidential Travel (Annual)",
    budgetAmount: 350_000_000,
    unitId: "school-lunch-year",
  },
  {
    budgetItemId: "nuclear-weapons",
    budgetItemName: "Nuclear Weapons Maintenance",
    budgetAmount: 37_700_000_000,
    unitId: "va-healthcare",
  },
  {
    budgetItemId: "snap-benefits",
    budgetItemName: "SNAP Benefits",
    budgetAmount: 119_000_000_000,
    unitId: "median-home",
  },
];

export function HomePageClient({
  budgetData,
  budgetItems,
  currentFiscalYear,
  lastUpdated,
}: HomePageClientProps) {
  const router = useRouter();

  // Create a lookup map for units
  const unitMap = useMemo(() => {
    const map = new Map<string, ComparisonUnit>();
    ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
    return map;
  }, []);

  // Generate example comparison cards with calculated values
  const exampleCards = useMemo(() => {
    return EXAMPLE_COMPARISONS.map((example) => {
      const unit = unitMap.get(example.unitId);
      if (!unit) return null;

      const result = calculateComparison(example.budgetAmount, unit);

      return {
        ...example,
        unitName: unit.name,
        unitIcon: unit.icon,
        unitCount: result.count,
      };
    }).filter(Boolean) as Array<{
      budgetItemId: string;
      budgetItemName: string;
      budgetAmount: number;
      unitId: string;
      unitName: string;
      unitIcon?: string;
      unitCount: number;
    }>;
  }, [unitMap]);

  const handleItemClick = (itemId: string) => {
    router.push(`/budget/${itemId}`);
  };

  const handleItemHover = (itemId: string | null) => {
    console.log("Hovering budget item:", itemId);
  };

  const handleBuilderShare = (budgetItemId: string, unitId: string) => {
    const shareUrl = `${window.location.origin}/compare/${budgetItemId}/${unitId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Hero Headline */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What Could Your Tax Dollars Buy?
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Turn billions into tangible comparisons. FY {currentFiscalYear}
            </p>
          </div>

          {/* Two Column Layout: Builder (2/3) + Examples (1/3) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Comparison Builder */}
            <div className="lg:col-span-2">
              <ComparisonBuilder
                budgetItems={budgetItems}
                onShare={handleBuilderShare}
              />

              {/* Data Freshness */}
              <div className="mt-6 flex justify-center">
                <DataFreshnessIndicator
                  lastUpdated={lastUpdated}
                  source="USAspending.gov"
                  sourceUrl="https://www.usaspending.gov"
                />
              </div>
            </div>

            {/* Right Column: Example Comparisons */}
            <div className="lg:col-span-1">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Example Comparisons
              </h3>
              <div className="space-y-3">
                {exampleCards.map((card) => (
                  <ComparisonCardMini
                    key={`${card.budgetItemId}-${card.unitId}`}
                    budgetItemId={card.budgetItemId}
                    budgetItemName={card.budgetItemName}
                    budgetAmount={card.budgetAmount}
                    unitId={card.unitId}
                    unitName={card.unitName}
                    unitCount={card.unitCount}
                    unitIcon={card.unitIcon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Overview Section */}
      <section className="border-t bg-muted/10">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Explore the Full Budget
          </h2>

          <div className="mx-auto max-w-3xl">
            <div className="h-[450px]">
              <BudgetPieChart
                data={budgetData}
                onItemClick={handleItemClick}
                onItemHover={handleItemHover}
              />
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/budget"
                className="text-sm font-medium text-primary hover:underline"
              >
                View detailed breakdown →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          Understanding the Numbers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="mb-2 text-lg font-semibold">Total Federal Budget</h3>
            <p className="mb-2 text-3xl font-bold text-primary">$7.0T</p>
            <p className="text-sm text-muted-foreground">
              The complete federal budget for FY 2025, including mandatory and
              discretionary spending
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-lg font-semibold">Transparent Data</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              All data sourced from official government databases including
              USAspending.gov, CBO, and OMB
            </p>
            <Link
              href="/methodology"
              className="text-sm font-medium text-primary hover:underline"
            >
              Read our methodology →
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold">Drill Down Deeper</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Explore spending by department, agency, program, and individual
              line items
            </p>
            <Link
              href="/budget"
              className="text-sm font-medium text-primary hover:underline"
            >
              Explore full budget →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="border-y bg-primary/5">
        <div className="container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Make the Numbers Meaningful
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Turn billions into tangible comparisons. Share your findings with
            others. Help make federal spending understandable for everyone.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Build a Comparison
            </button>
            <Link
              href="/about"
              className="rounded-lg border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted/50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
