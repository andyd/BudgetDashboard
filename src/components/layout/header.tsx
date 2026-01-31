"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { name: "Budget", href: "/budget" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-end gap-4">
          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex md:items-center md:gap-6 lg:gap-8"
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1",
                  isActiveLink(link.href)
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-foreground"
                    : "text-muted-foreground",
                )}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] px-0"
              >
                <div className="flex flex-col h-full">
                  {/* Visually hidden title for accessibility */}
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  {/* Mobile Navigation Links */}
                  <nav
                    className="flex flex-col px-6 pt-4"
                    aria-label="Mobile navigation"
                  >
                    {navigationLinks.map((link, index) => (
                      <div key={link.name}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center text-base font-medium transition-colors rounded-md",
                            "min-h-[44px] px-3 py-3",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isActiveLink(link.href)
                              ? "text-foreground bg-accent/50"
                              : "text-muted-foreground",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={
                            isActiveLink(link.href) ? "page" : undefined
                          }
                        >
                          {link.name}
                        </Link>
                        {index < navigationLinks.length - 1 && (
                          <Separator className="my-1" />
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Footer info in mobile menu */}
                  <div className="mt-auto px-6 pb-6">
                    <Separator className="mb-4" />
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p>Visualizing federal spending data</p>
                      <div className="flex gap-4">
                        <Link
                          href="/privacy"
                          className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Privacy
                        </Link>
                        <Link
                          href="/terms"
                          className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Terms
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
