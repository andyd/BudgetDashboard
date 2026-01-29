'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Star,
  Box,
  Lightbulb,
  RefreshCw,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Featured Comparisons',
    href: '/admin/comparisons',
    icon: Star,
  },
  {
    title: 'Units',
    href: '/admin/units',
    icon: Box,
  },
  {
    title: 'Spotlights',
    href: '/admin/spotlights',
    icon: Lightbulb,
  },
  {
    title: 'Data Sync',
    href: '/admin/sync',
    icon: RefreshCw,
  },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground'
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      {/* Logo/Title */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Budget Dashboard Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="size-10">
              <Menu className="size-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}
