import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Database,
  Calculator,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "Learn how we source federal budget data, calculate comparisons, and ensure accuracy in the Budget Dashboard.",
  openGraph: {
    title: "Methodology - Federal Budget Dashboard",
    description:
      "Transparent methodology for budget data sourcing, comparison calculations, and data quality standards.",
  },
};

export default function MethodologyPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Methodology</h1>
          <p className="text-xl text-muted-foreground">
            Transparent sourcing, calculation, and presentation of federal
            budget data
          </p>
        </div>

        {/* Data Sources */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Data Sources
          </h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Primary Budget Data: USAspending.gov</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All federal budget and spending data is sourced from{" "}
                <a
                  href="https://www.usaspending.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  USAspending.gov
                  <ExternalLink className="w-4 h-4" />
                </a>
                , the official open data source of federal spending information
                managed by the U.S. Department of the Treasury.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What we use:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Agency budget authority and obligations</li>
                  <li>
                    Object class spending (personnel, contracts, grants, etc.)
                  </li>
                  <li>Function and subfunction categorization</li>
                  <li>Award-level transaction data for specific programs</li>
                  <li>Historical spending trends (fiscal year 2017-present)</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                USAspending.gov aggregates data from the Financial Management
                System (FMS), Federal Procurement Data System (FPDS), and other
                authoritative federal sources mandated by the Digital
                Accountability and Transparency Act (DATA Act) of 2014.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Comparison Unit Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To provide meaningful context, we translate budget figures into
                relatable units using data from authoritative statistical
                sources:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">
                    Bureau of Labor Statistics (BLS)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Median household income, average wages by occupation,
                    consumer price indices
                  </p>
                  <a
                    href="https://www.bls.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    bls.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">
                    Kaiser Family Foundation (KFF)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Average health insurance premiums, out-of-pocket healthcare
                    costs
                  </p>
                  <a
                    href="https://www.kff.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    kff.org
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">
                    U.S. Department of Health and Human Services (HHS)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Medicare/Medicaid per-beneficiary costs, public health
                    program expenditures
                  </p>
                  <a
                    href="https://www.hhs.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    hhs.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">U.S. Census Bureau</h4>
                  <p className="text-sm text-muted-foreground">
                    Population counts, household statistics, economic indicators
                  </p>
                  <a
                    href="https://www.census.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    census.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">
                    National Center for Education Statistics (NCES)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Average cost of public education, teacher salaries, school
                    funding
                  </p>
                  <a
                    href="https://nces.ed.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    nces.ed.gov
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Example Calculation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-primary" />
            Example Calculation
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>
                How We Calculate: Defense Spending in Teacher Years
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Step 1: Get the budget figure
                  </h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    Department of Defense FY 2025 Budget Authority:
                    $841,400,000,000
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Source: USAspending.gov API, Function 051 (National Defense)
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Step 2: Get the comparison unit
                  </h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    Average public school teacher salary: $66,397
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Source: National Center for Education Statistics, 2023-24
                    school year
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Step 3: Calculate the comparison
                  </h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    $841,400,000,000 ÷ $66,397 = 12,673,426 teacher-years
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Step 4: Present with context
                  </h4>
                  <div className="bg-background p-4 rounded border-2 border-primary">
                    <p className="text-sm">
                      The{" "}
                      <span className="font-semibold">
                        Department of Defense budget
                      </span>{" "}
                      of <span className="font-semibold">$841.4 billion</span>{" "}
                      could fund{" "}
                      <span className="font-semibold text-primary">
                        12.7 million teacher salaries
                      </span>{" "}
                      for one year—nearly 4x the total number of public school
                      teachers in the U.S.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Note:</strong> This comparison illustrates scale, not
                  policy recommendation. We do not suggest reallocating defense
                  spending to education; rather, we use familiar units to make
                  large numbers comprehensible.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Update Frequency */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary" />
            Update Frequency
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Budget Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Updated <span className="font-semibold">daily</span> via
                    automated sync with USAspending.gov API. New fiscal year
                    data becomes available in October when appropriations are
                    enacted.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Comparison Units</h4>
                  <p className="text-sm text-muted-foreground">
                    Updated <span className="font-semibold">quarterly</span>{" "}
                    when source agencies publish new statistics. Most metrics
                    reflect the most recent 12-month period available.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Historical Data</h4>
                  <p className="text-sm text-muted-foreground">
                    USAspending.gov provides reliable data from FY 2017 onward.
                    Pre-2017 data may be incomplete due to DATA Act
                    implementation timeline.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Last updated:{" "}
                    <span className="font-mono">2024-01-15 08:30 UTC</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Caveats and Limitations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-primary" />
            Caveats and Limitations
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    1. Budget Authority vs. Outlays
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We primarily display <strong>budget authority</strong>{" "}
                    (legal permission to spend), not <strong>outlays</strong>{" "}
                    (actual cash disbursed). Multi-year programs may show high
                    authority in one year but spend over several years.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    2. Mandatory vs. Discretionary Spending
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Mandatory spending (Social Security, Medicare, interest on
                    debt) operates under permanent law and is not annually
                    appropriated. Discretionary spending requires annual
                    congressional appropriation. This dashboard shows both but
                    does not imply equal flexibility in reallocation.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    3. Inflation Adjustment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Unless explicitly noted, dollar figures are in{" "}
                    <strong>nominal terms</strong> (not adjusted for inflation).
                    Historical comparisons should account for CPI changes.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    4. Classification Changes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Federal agencies occasionally reorganize, and budget
                    functions/subfunctions may be reclassified. We use the most
                    current classification scheme, which may affect
                    year-over-year comparisons.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    5. Comparison Limitations
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Comparisons are illustrative and do not represent policy
                    endorsements. A comparison showing &ldquo;X could fund
                    Y&rdquo; does not imply substitutability or equivalence of
                    value. Budget decisions involve complex trade-offs not
                    captured by simple arithmetic.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">6. Data Quality</h4>
                  <p className="text-sm text-muted-foreground">
                    While USAspending.gov is the most authoritative source,
                    occasional reporting errors or delays may occur. We
                    cross-reference with OMB and CBO publications where
                    possible. Discrepancies are noted in context.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">7. Off-Budget Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Some spending (e.g., Social Security, USPS operations) is
                    technically &ldquo;off-budget&rdquo; but is included in
                    unified budget reporting. We follow OMB conventions for
                    consistency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why These Comparisons Matter */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Why These Comparisons Matter
          </h2>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Making Billions Comprehensible
                </h3>
                <p className="text-muted-foreground">
                  The federal budget operates in billions and trillions—numbers
                  far beyond everyday experience. When the Department of Defense
                  spends $841 billion, that figure is technically accurate but
                  cognitively meaningless to most people. By translating
                  spending into relatable units (teacher salaries, healthcare
                  costs, median incomes), we bridge the gap between abstract
                  accounting and lived reality.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Informed Democratic Participation
                </h3>
                <p className="text-muted-foreground">
                  Budget decisions reflect collective priorities and values.
                  Citizens cannot meaningfully engage in democratic discourse
                  about spending without understanding what those dollars
                  represent in human terms. These comparisons lower the barrier
                  to informed participation in debates about taxation, spending,
                  and national priorities.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Avoiding False Equivalencies
                </h3>
                <p className="text-muted-foreground mb-4">
                  We are careful <em>not</em> to suggest that comparing defense
                  spending to teacher salaries means we should &ldquo;defund the
                  military to hire teachers.&rdquo; Budget trade-offs involve:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Constitutional obligations (e.g., national defense)</li>
                  <li>Legal mandates (e.g., Social Security benefits)</li>
                  <li>
                    Economic effects (e.g., multiplier effects, opportunity
                    costs)
                  </li>
                  <li>
                    Long-term consequences (e.g., infrastructure decay, skills
                    gaps)
                  </li>
                  <li>Political feasibility and coalition-building</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Our goal is comprehension, not prescription. We provide the
                  numbers; you provide the values.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Transparency and Accountability
                </h3>
                <p className="text-muted-foreground">
                  By making budget data accessible and interpretable, we support
                  transparency efforts mandated by laws like the DATA Act. When
                  spending is legible to the public, oversight becomes more
                  effective. Journalists, researchers, and advocates can use
                  this tool to ask sharper questions and hold institutions
                  accountable.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">
                  Nonpartisan Design Principle
                </h3>
                <p className="text-muted-foreground">
                  This dashboard is intentionally neutral. We do not
                  editorialize on whether spending is &ldquo;too high&rdquo; or
                  &ldquo;too low,&rdquo; nor do we advocate for specific policy
                  changes. Our role is to present data clearly and allow users
                  to draw their own conclusions. Comparisons are selected for
                  familiarity and relevance, not to advance a particular
                  ideology.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Primary Sources */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Primary Sources</h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <a
                  href="https://www.usaspending.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  USAspending.gov - Official source of federal spending data
                </a>
                <a
                  href="https://www.whitehouse.gov/omb/budget/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Office of Management and Budget (OMB) - Federal budget
                  publications
                </a>
                <a
                  href="https://www.cbo.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Congressional Budget Office (CBO) - Budget analysis and
                  projections
                </a>
                <a
                  href="https://www.bls.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Bureau of Labor Statistics - Wage and employment data
                </a>
                <a
                  href="https://www.kff.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Kaiser Family Foundation - Health insurance and healthcare
                  cost data
                </a>
                <a
                  href="https://www.census.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  U.S. Census Bureau - Population and household statistics
                </a>
                <a
                  href="https://nces.ed.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  National Center for Education Statistics - Education funding
                  and costs
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Questions About Our Methodology?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We are committed to transparency and accuracy. If you have
                questions about our data sources, calculations, or methodology,
                please reach out.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:methodology@budgetdashboard.gov">
                    Contact Us
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/api/docs">View API Documentation</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
