import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-8">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/methodology"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Methodology
          </Link>
          <a
            href="https://github.com/yourusername/budget-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t text-xs text-muted-foreground">
          <p>
            © {currentYear} Federal Budget Dashboard. All rights reserved.
          </p>
          <p>
            Data from{' '}
            <a
              href="https://www.usaspending.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              USAspending.gov
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
