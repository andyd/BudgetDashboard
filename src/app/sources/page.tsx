import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Database,
  RefreshCw,
  FileText,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Building2,
  BarChart3,
  Scale,
  FileJson,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Sources",
  description:
    "Comprehensive documentation of all data sources, update frequencies, and methodology used in the Federal Budget Dashboard.",
  openGraph: {
    title: "Data Sources - Federal Budget Dashboard",
    description:
      "Official government data sources powering transparent federal budget visualization.",
  },
};

// Data source definitions with comprehensive metadata
const primarySources = [
  {
    id: "usaspending",
    name: "USAspending.gov",
    organization: "U.S. Department of the Treasury",
    url: "https://www.usaspending.gov",
    apiUrl: "https://api.usaspending.gov",
    description:
      "The official open data source of federal spending information, mandated by the DATA Act of 2014.",
    dataTypes: [
      "Budget authority by agency and function",
      "Obligations and outlays",
      "Award-level transaction data",
      "Historical spending (FY 2017-present)",
      "Agency financial statements",
    ],
    updateFrequency: "Daily",
    updateDetails:
      "Data refreshed nightly from agency submissions. New fiscal year data available after October appropriations.",
    reliability: "high" as const,
    legalMandate:
      "Digital Accountability and Transparency Act (DATA Act) of 2014",
    icon: Database,
  },
  {
    id: "cbo",
    name: "Congressional Budget Office (CBO)",
    organization: "U.S. Congress",
    url: "https://www.cbo.gov",
    description:
      "Nonpartisan analysis for the U.S. Congress on budgetary and economic issues.",
    dataTypes: [
      "Budget projections and baselines",
      "Economic forecasts",
      "Cost estimates for legislation",
      "Long-term budget outlooks",
      "Monthly budget reviews",
    ],
    updateFrequency: "Varies by report",
    updateDetails:
      "Major baseline updates in January and May. Monthly budget reviews released 1-2 weeks after month end.",
    reliability: "high" as const,
    legalMandate: "Congressional Budget Act of 1974",
    icon: BarChart3,
  },
  {
    id: "omb",
    name: "Office of Management and Budget (OMB)",
    organization: "Executive Office of the President",
    url: "https://www.whitehouse.gov/omb",
    description:
      "Prepares the President's Budget and oversees federal agency budget execution.",
    dataTypes: [
      "President's Budget proposals",
      "Historical budget tables",
      "Mid-session reviews",
      "Sequestration reports",
      "Agency performance data",
    ],
    updateFrequency: "Annual (with supplements)",
    updateDetails:
      "President's Budget typically released first Monday of February. Mid-session review in July.",
    reliability: "high" as const,
    legalMandate: "Budget and Accounting Act of 1921",
    icon: Building2,
  },
  {
    id: "treasury",
    name: "U.S. Treasury Department",
    organization: "U.S. Department of the Treasury",
    url: "https://fiscaldata.treasury.gov",
    description:
      "Official source for federal debt, revenue, and financial operations data.",
    dataTypes: [
      "Daily Treasury Statement",
      "Monthly Treasury Statement",
      "Debt to the penny",
      "Federal revenue collections",
      "Interest expense data",
    ],
    updateFrequency: "Daily/Monthly",
    updateDetails:
      "Daily statements published each business day. Monthly statements typically by the 8th of the following month.",
    reliability: "high" as const,
    legalMandate: "Treasury reporting requirements",
    icon: Scale,
  },
];

const secondarySources = [
  {
    name: "Bureau of Labor Statistics (BLS)",
    url: "https://www.bls.gov",
    dataUsed: "Median wages, employment data, CPI for inflation adjustments",
    updateFrequency: "Monthly/Quarterly",
  },
  {
    name: "U.S. Census Bureau",
    url: "https://www.census.gov",
    dataUsed: "Population counts, household statistics, economic indicators",
    updateFrequency: "Annual (population), Varies (economic)",
  },
  {
    name: "National Center for Education Statistics (NCES)",
    url: "https://nces.ed.gov",
    dataUsed: "Teacher salaries, school funding, education costs",
    updateFrequency: "Annual",
  },
  {
    name: "Kaiser Family Foundation (KFF)",
    url: "https://www.kff.org",
    dataUsed: "Health insurance premiums, healthcare cost data",
    updateFrequency: "Annual",
  },
  {
    name: "Federal Reserve (FRED)",
    url: "https://fred.stlouisfed.org",
    dataUsed: "GDP data, economic indicators, interest rates",
    updateFrequency: "Varies by series",
  },
];

const dataQualityIndicators = [
  {
    status: "verified",
    label: "Primary Source",
    description:
      "Data from official government APIs with legal reporting mandates",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    status: "calculated",
    label: "Calculated",
    description: "Derived from primary sources using documented methodology",
    icon: RefreshCw,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    status: "estimated",
    label: "Estimated",
    description: "Based on projections or incomplete data; noted in context",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
];

// Metadata for export functionality
const datasetMetadata = {
  lastUpdated: "2026-01-30T08:00:00Z",
  version: "2.1.0",
  fiscalYear: 2026,
  dataRange: {
    start: "2017-10-01",
    end: "2026-01-30",
  },
  totalRecords: {
    budgetItems: 15847,
    agencies: 438,
    programs: 2891,
  },
  formats: ["JSON", "CSV", "API"],
};

function ReliabilityBadge({
  reliability,
}: {
  reliability: "high" | "medium" | "low";
}) {
  const config = {
    high: { label: "High Reliability", variant: "default" as const },
    medium: { label: "Medium Reliability", variant: "secondary" as const },
    low: { label: "Low Reliability", variant: "outline" as const },
  };
  return (
    <Badge variant={config[reliability].variant}>
      {config[reliability].label}
    </Badge>
  );
}

export default function SourcesPage() {
  const formattedLastUpdated = new Date(
    datasetMetadata.lastUpdated,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <>
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <Badge variant="secondary" className="mb-2">
              Data Transparency
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Data Sources & Methodology
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg sm:text-xl">
              Every number in this dashboard comes from official government
              sources. Full transparency in our data sourcing, update schedules,
              and calculations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Last Updated: {formattedLastUpdated}</span>
              </div>
              <div className="bg-muted/50 flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Database className="h-4 w-4 text-primary" />
                <span>FY 2017 - FY {datasetMetadata.fiscalYear}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Data Sources */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Primary Data Sources</h2>
            <p className="text-muted-foreground max-w-3xl">
              These authoritative sources provide the core budget data displayed
              in this dashboard. All are official government sources with legal
              reporting mandates.
            </p>
          </div>

          <div className="grid gap-8">
            {primarySources.map((source) => (
              <Card key={source.id} className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                        <source.icon className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{source.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {source.organization}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ReliabilityBadge reliability={source.reliability} />
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Source
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    {source.description}
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Data Types */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Data We Use
                      </h4>
                      <ul className="space-y-2">
                        {source.dataTypes.map((type) => (
                          <li
                            key={type}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {type}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Update Schedule */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-primary" />
                          Update Frequency
                        </h4>
                        <p className="text-sm">
                          <span className="font-medium text-primary">
                            {source.updateFrequency}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {source.updateDetails}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Legal Mandate
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {source.legalMandate}
                        </p>
                      </div>

                      {source.apiUrl && (
                        <div>
                          <h4 className="font-semibold mb-2">API Endpoint</h4>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {source.apiUrl}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Sources */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Comparison Unit Sources</h2>
            <p className="text-muted-foreground max-w-3xl">
              To translate budget figures into meaningful comparisons, we use
              authoritative statistical data from these government and research
              organizations.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {secondarySources.map((source) => (
              <Card key={source.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {source.dataUsed}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Updates: {source.updateFrequency}
                    </span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Quality Indicators */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Data Quality Indicators</h2>
            <p className="text-muted-foreground max-w-3xl">
              Throughout the dashboard, we indicate the provenance and
              reliability of data using these markers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dataQualityIndicators.map((indicator) => (
              <Card key={indicator.status}>
                <CardContent className="pt-6">
                  <div
                    className={`${indicator.bgColor} w-fit rounded-lg p-3 mb-4`}
                  >
                    <indicator.icon className={`h-6 w-6 ${indicator.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {indicator.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {indicator.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Update Schedule */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Update Schedule</h2>
            <p className="text-muted-foreground max-w-3xl">
              Our data pipeline runs on a predictable schedule to ensure
              accuracy while minimizing latency.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">
                        Data Type
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Source
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Frequency
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Typical Delay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4">Budget Authority</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        USAspending.gov
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">Daily</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        1 business day
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Spending Outlays</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Treasury FMS
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">Daily</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        1 business day
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Federal Debt</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Treasury Fiscal Data
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">Daily</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Same day
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Budget Projections</td>
                      <td className="py-3 px-4 text-muted-foreground">CBO</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">Semiannual</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Within 24 hours of release
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Comparison Units</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        BLS, Census, etc.
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">Quarterly</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Within 1 week of release
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Inflation Adjustments</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        BLS CPI-U
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">Monthly</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Within 3 days of release
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Methodology Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Methodology Summary</h2>
            <p className="text-muted-foreground max-w-3xl">
              How we process, validate, and present federal budget data.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <div>
                      <span className="font-medium">Automated Ingestion</span>
                      <p className="text-muted-foreground">
                        Daily API calls to USAspending.gov and Treasury data
                        sources
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <div>
                      <span className="font-medium">Validation</span>
                      <p className="text-muted-foreground">
                        Cross-reference totals with OMB and CBO publications
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <div>
                      <span className="font-medium">Normalization</span>
                      <p className="text-muted-foreground">
                        Standardize agency names, function codes, and fiscal
                        year boundaries
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      4
                    </span>
                    <div>
                      <span className="font-medium">Aggregation</span>
                      <p className="text-muted-foreground">
                        Build hierarchical totals for drill-down visualization
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      5
                    </span>
                    <div>
                      <span className="font-medium">Publication</span>
                      <p className="text-muted-foreground">
                        Update dashboard with change tracking and audit logs
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparison Calculations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All comparisons follow a consistent methodology:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Formula</h4>
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      Comparison Units = Budget Amount / Unit Cost
                    </code>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Dollar Values</h4>
                    <p className="text-muted-foreground">
                      Nominal dollars unless inflation-adjusted is specified
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Time Alignment</h4>
                    <p className="text-muted-foreground">
                      Budget and comparison unit data matched to same fiscal
                      year where possible
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Rounding</h4>
                    <p className="text-muted-foreground">
                      Displayed values rounded for readability; full precision
                      in exports
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a href="/methodology">
                View Full Methodology Documentation
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Export Metadata */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Dataset Metadata</h2>
            <p className="text-muted-foreground max-w-3xl">
              Current dataset information for research and citation purposes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Temporal Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Start</span>
                  <span className="font-mono">
                    {new Date(
                      datasetMetadata.dataRange.start,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data End</span>
                  <span className="font-mono">
                    {new Date(
                      datasetMetadata.dataRange.end,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Current Fiscal Year
                  </span>
                  <span className="font-mono">
                    FY {datasetMetadata.fiscalYear}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Dataset Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Items</span>
                  <span className="font-mono">
                    {datasetMetadata.totalRecords.budgetItems.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agencies</span>
                  <span className="font-mono">
                    {datasetMetadata.totalRecords.agencies.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Programs</span>
                  <span className="font-mono">
                    {datasetMetadata.totalRecords.programs.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5 text-primary" />
                  Export Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">{datasetMetadata.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Available Formats
                  </span>
                  <span className="font-mono">
                    {datasetMetadata.formats.join(", ")}
                  </span>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href="/api/docs">
                      <Download className="mr-2 h-4 w-4" />
                      API Documentation
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Citing This Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                When citing data from this dashboard in research or
                publications, please use the following format:
              </p>
              <div className="bg-background p-4 rounded-lg border">
                <code className="text-sm">
                  Federal Budget Dashboard. (2026). [Data set]. Retrieved{" "}
                  {formattedLastUpdated} from
                  https://budgetdashboard.gov/sources. Data sourced from
                  USAspending.gov, Congressional Budget Office, and Office of
                  Management and Budget.
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                For specific data points, include the fiscal year and the
                original source (e.g., USAspending.gov) in your citation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground text-center text-sm space-y-2">
            <p>
              This is an independent project and is not affiliated with any
              government agency.
            </p>
            <p>
              All data is sourced from official government sources and is
              provided as-is for informational purposes. We make no guarantees
              about completeness or accuracy.
            </p>
            <p className="pt-2">
              <a href="/methodology" className="text-primary hover:underline">
                View full methodology
              </a>
              {" | "}
              <a href="/about" className="text-primary hover:underline">
                About this project
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
