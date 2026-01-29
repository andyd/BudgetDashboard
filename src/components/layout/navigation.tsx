'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/common/theme-toggle';

const navigation = [
  { name: 'Explore', href: '/' },
  { name: 'Compare', href: '/compare' },
  { name: 'About', href: '/about' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex items-center min-w-0">
            <Link
              href="/"
              className="text-base sm:text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors whitespace-nowrap"
            >
              Federal Budget Dashboard
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {/* Data Freshness Indicator - placeholder for now */}
            <div className="text-xs text-muted-foreground px-2">
              Updated: Jan 2026
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search budget data"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search budget data"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Logo */}
                  <div>
                    <Link
                      href="/"
                      className="text-lg font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Federal Budget Dashboard
                    </Link>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground text-base font-medium transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Data Freshness */}
                  <div className="pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Data Updated: Jan 2026
                    </div>
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Theme:</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Modal Placeholder - will be replaced with actual BudgetSearch component */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Search Budget Data</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  ×
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                BudgetSearch component will be implemented here
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
