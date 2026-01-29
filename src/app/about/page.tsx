import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Database, Calculator, Github, Shield, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About This Project',
  description:
    'Learn about our mission to make federal spending transparent and understandable through data visualization.',
  openGraph: {
    title: 'About - Federal Budget Dashboard',
    description:
      'Making federal spending transparent and understandable through interactive data visualization.',
  },
};

const dataSources = [
  {
    name: 'USAspending.gov',
    description: 'Official source of federal spending data from the US Treasury',
    url: 'https://www.usaspending.gov',
    icon: Database,
  },
  {
    name: 'Congressional Budget Office',
    description: 'Nonpartisan analysis of budget and economic issues',
    url: 'https://www.cbo.gov',
    icon: Calculator,
  },
  {
    name: 'Office of Management and Budget',
    description: 'Presidential budget documents and historical tables',
    url: 'https://www.whitehouse.gov/omb',
    icon: Shield,
  },
];

const methodologyPoints = [
  {
    title: 'Data Collection',
    description:
      'Budget data is sourced directly from USAspending.gov API, which aggregates spending from all federal agencies. Data is refreshed daily to ensure accuracy.',
  },
  {
    title: 'Comparison Calculations',
    description:
      'All comparisons use the most recent available data for the comparison unit (e.g., GDP, national park budgets, infrastructure spending). Dollar amounts are adjusted for inflation using CPI-U when comparing across years.',
  },
  {
    title: 'Visualization Design',
    description:
      'Treemap visualizations use proportional area to represent spending amounts, making it easy to compare relative sizes. Color coding indicates department categories for quick identification.',
  },
  {
    title: 'Editorial Standards',
    description:
      'All featured comparisons are fact-checked and include source citations. We strive for political neutrality and present data without partisan interpretation.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <Badge variant="secondary" className="mb-4">
              About This Project
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About This Project
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Making federal spending transparent and understandable through
              interactive data visualization and real-world comparisons.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-lg">
                The federal budget affects every American, yet understanding where
                trillions of dollars go can be overwhelming. Our mission is to make
                federal spending transparent and understandable by:
              </p>
              <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                <li>
                  Visualizing spending data in intuitive, interactive formats
                </li>
                <li>
                  Providing real-world comparisons that translate billions into
                  tangible terms
                </li>
                <li>
                  Presenting data without partisan interpretation or political bias
                </li>
                <li>
                  Citing all sources and showing our methodology openly
                </li>
              </ul>
              <p className="text-muted-foreground text-lg">
                We believe an informed citizenry is essential to democracy, and
                understanding how tax dollars are spent is a fundamental part of
                civic engagement.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold">Data Sources</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              All data comes from official government sources
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dataSources.map((source) => (
              <Card key={source.name}>
                <CardHeader>
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <source.icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle>{source.name}</CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Site
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold">Methodology</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              How we calculate comparisons and present data
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {methodologyPoints.map((point) => (
              <Card key={point.title}>
                <CardHeader>
                  <CardTitle>{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {point.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Github className="text-primary h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Open Source</CardTitle>
                  <CardDescription>
                    Built in public, free to use and modify
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This project is open source and available on GitHub. We believe
                transparency in government spending should extend to the tools we
                build to visualize it. You can:
              </p>
              <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                <li>View and audit all source code</li>
                <li>Report bugs or suggest features via GitHub Issues</li>
                <li>Contribute improvements via pull requests</li>
                <li>Fork the project for your own use</li>
                <li>Review our data processing pipeline</li>
              </ul>
              <Button asChild>
                <a
                  href="https://github.com/yourusername/budget-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                  <Github className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact & Privacy Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Contact */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Mail className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle>Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Have questions, suggestions, or feedback? We would love to hear
                  from you.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">
                    contact@budgetdashboard.example
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-muted-foreground text-sm">
                    Open an issue for bug reports or feature requests
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Shield className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle>Privacy</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We respect your privacy and believe in minimal data collection.
                </p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-2 text-sm">
                  <li>No tracking cookies</li>
                  <li>No analytics or third-party scripts</li>
                  <li>No personal data collection</li>
                  <li>No user accounts required</li>
                  <li>All data visualization happens client-side</li>
                </ul>
                <p className="text-muted-foreground text-sm">
                  We only store anonymous server logs for security and
                  performance monitoring, retained for 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground text-center text-sm">
            <p>
              This is an independent project and is not affiliated with any
              government agency.
            </p>
            <p className="mt-2">
              All data is sourced from official government sources and is
              provided as-is for informational purposes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
