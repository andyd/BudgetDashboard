'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Star,
  Boxes,
  Lightbulb,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Featured Comparisons',
    href: '/admin/comparisons',
    icon: Star,
  },
  {
    name: 'Units',
    href: '/admin/units',
    icon: Boxes,
  },
  {
    name: 'Spotlights',
    href: '/admin/spotlights',
    icon: Lightbulb,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Signed out successfully');
        router.refresh();
      }
    } catch (_error) {
      toast.error('Sign out failed');
    }
  }

  return (
    <aside className="w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Budget Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
