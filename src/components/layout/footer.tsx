import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

const navigation = {
  about: [
    { name: "About", href: "/about" },
    { name: "Methodology", href: "/methodology" },
    { name: "Data Sources", href: "/sources" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  dataSources: [
    {
      name: "USAspending.gov",
      href: "https://www.usaspending.gov",
      description: "Official source of federal spending data",
    },
    {
      name: "Congressional Budget Office",
      href: "https://www.cbo.gov",
      description: "Budget analysis and projections",
    },
    {
      name: "Office of Management and Budget",
      href: "https://www.whitehouse.gov/omb",
      description: "Federal budget preparation",
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = "January 2026"; // TODO: Make dynamic based on data sync

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand and Description */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 min-h-[44px] -ml-2 pl-2 pr-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-xs font-bold">
                  $
                </span>
              </div>
              <span className="text-base sm:text-lg font-bold leading-tight">
                Federal Budget Dashboard
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed max-w-sm">
              A living dashboard that translates federal spending into tangible
              terms. Explore billions through side-by-side comparisons that make
              the numbers meaningful.
            </p>
            <div className="mt-6">
              <a
                href="https://github.com/yourusername/budget-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base min-h-[44px] py-2 px-3 -ml-3 rounded-lg hover:bg-muted/50"
              >
                <Github className="h-5 w-5 flex-shrink-0" />
                <span>Open-source project</span>
              </a>
            </div>
          </div>

          {/* Data Sources */}
          <div className="lg:col-span-4">
            <h3 className="text-foreground text-sm font-semibold mb-3 sm:mb-4">
              Data Sources
            </h3>
            <ul className="space-y-2">
              {navigation.dataSources.map((source) => (
                <li key={source.name}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm sm:text-base transition-colors flex items-start gap-3 group min-h-[44px] py-2 px-3 -ml-3 rounded-lg hover:bg-muted/50"
                  >
                    <ExternalLink className="h-4 w-4 sm:h-3.5 sm:w-3.5 mt-1 sm:mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    <div className="flex-1">
                      <div className="font-medium leading-tight">
                        {source.name}
                      </div>
                      <div className="text-xs sm:text-xs opacity-75 mt-0.5">
                        {source.description}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs mt-4 italic px-3">
              Data updated {lastUpdated}
            </p>
          </div>

          {/* About and Legal - Stack on mobile, side-by-side on tablet+ */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-foreground text-sm font-semibold mb-3 sm:mb-4">
                About
              </h3>
              <ul className="space-y-1">
                {navigation.about.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm sm:text-base transition-colors min-h-[44px] py-2 px-3 -ml-3 rounded-lg hover:bg-muted/50 w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-semibold mb-3 sm:mb-4">
                Legal
              </h3>
              <ul className="space-y-1">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center text-muted-foreground hover:text-foreground text-sm sm:text-base transition-colors min-h-[44px] py-2 px-3 -ml-3 rounded-lg hover:bg-muted/50 w-full"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-border mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <p className="leading-relaxed">
              © {currentYear} Federal Budget Dashboard. This is an independent
              project not affiliated with any government agency.
            </p>
            <p className="flex items-center gap-1.5 whitespace-nowrap">
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
