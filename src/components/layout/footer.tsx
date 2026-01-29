import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';

const navigation = {
  about: [
    { name: 'About', href: '/about' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  dataSources: [
    {
      name: 'USAspending.gov',
      href: 'https://www.usaspending.gov',
      description: 'Official source of federal spending data',
    },
    {
      name: 'Congressional Budget Office',
      href: 'https://www.cbo.gov',
      description: 'Budget analysis and projections',
    },
    {
      name: 'Office of Management and Budget',
      href: 'https://www.whitehouse.gov/omb',
      description: 'Federal budget preparation',
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = 'January 2026'; // TODO: Make dynamic based on data sync

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Brand and Description */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">$</span>
              </div>
              <span className="text-lg font-bold">Federal Budget Dashboard</span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-sm">
              A living dashboard that translates federal spending into tangible terms.
              Explore billions through side-by-side comparisons that make the numbers meaningful.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://github.com/yourusername/budget-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"
              >
                <Github className="h-5 w-5" />
                <span>Open-source project</span>
              </a>
            </div>
          </div>

          {/* Data Sources */}
          <div className="lg:col-span-4">
            <h3 className="text-foreground text-sm font-semibold mb-4">
              Data Sources
            </h3>
            <ul className="space-y-3">
              {navigation.dataSources.map((source) => (
                <li key={source.name}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-start gap-2 group"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-xs opacity-75">{source.description}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs mt-4 italic">
              Data updated {lastUpdated}
            </p>
          </div>

          {/* About and Legal */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-foreground text-sm font-semibold mb-4">
                About
              </h3>
              <ul className="space-y-3">
                {navigation.about.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-semibold mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {currentYear} Federal Budget Dashboard. This is an independent project
              not affiliated with any government agency.
            </p>
            <p className="flex items-center gap-1">
              Built with transparency
              <span className="text-primary">•</span>
              Made for citizens
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
