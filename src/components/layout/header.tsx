"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Methodology", href: "/methodology" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-foreground hover:text-foreground/90 transition-colors"
            >
              USA Government Budget
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-4">
                    <Link
                      href="/"
                      className="text-lg font-bold text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      USA Government Budget
                    </Link>
                  </div>

                  <Separator />

                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-1 pt-6">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-3 rounded-md hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
