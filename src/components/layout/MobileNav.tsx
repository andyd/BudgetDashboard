"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Home, Search, BarChart3, Plus, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/explore",
    label: "Explore Budget",
    icon: BarChart3,
  },
  {
    href: "/compare",
    label: "Build Comparison",
    icon: Plus,
  },
  {
    href: "/about",
    label: "About",
    icon: Info,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-base font-medium">{link.label}</span>
              </Link>
            );
          })}
          <div className="border-t my-2" />
          <Button
            variant="outline"
            className="justify-start gap-3 px-4 py-6"
            onClick={handleLinkClick}
          >
            <Search className="h-5 w-5" />
            <span className="text-base font-medium">Search</span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
