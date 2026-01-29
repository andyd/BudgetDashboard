'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BreadcrumbSegment {
  id: string;
  name: string;
  slug: string;
}

interface BudgetBreadcrumbProps {
  path: BreadcrumbSegment[];
  className?: string;
}

export function BudgetBreadcrumb({ path, className }: BudgetBreadcrumbProps) {
  // For mobile: show first, last, and collapse middle segments
  const shouldCollapse = path.length > 3;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Build full URL path for each segment
  const getSegmentUrl = (index: number): string => {
    const segments = path.slice(0, index + 1);
    return `/budget/${segments.map((s) => s.slug).join('/')}`;
  };

  // Mobile collapsed view
  if (isMobile && shouldCollapse) {
    const first = path[0];
    const last = path[path.length - 1];
    const middle = path.slice(1, -1);

    return (
      <nav
        aria-label="Budget breadcrumb navigation"
        className={cn('flex items-center text-sm', className)}
      >
        <ol className="flex items-center gap-1 overflow-hidden">
          {/* First segment */}
          <li className="flex items-center">
            <Link
              href={getSegmentUrl(0)}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[120px]"
            >
              {first.name}
            </Link>
          </li>

          {/* Separator */}
          <li aria-hidden="true">
            <ChevronRightIcon className="size-4 text-muted-foreground/50 shrink-0" />
          </li>

          {/* Collapsed middle segments in dropdown */}
          <li className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm p-1">
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Show hidden path segments</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px]">
                {middle.map((segment, index) => (
                  <DropdownMenuItem key={segment.id} asChild>
                    <Link
                      href={getSegmentUrl(index + 1)}
                      className="cursor-pointer"
                    >
                      {segment.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Separator */}
          <li aria-hidden="true">
            <ChevronRightIcon className="size-4 text-muted-foreground/50 shrink-0" />
          </li>

          {/* Last segment (current) */}
          <li
            className="text-foreground font-medium truncate max-w-[120px]"
            aria-current="page"
          >
            {last.name}
          </li>
        </ol>
      </nav>
    );
  }

  // Desktop view - show all segments
  return (
    <nav
      aria-label="Budget breadcrumb navigation"
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center gap-1 overflow-hidden flex-wrap">
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;

          return (
            <React.Fragment key={segment.id}>
              <li className="flex items-center shrink-0">
                {isLast ? (
                  <span
                    className="text-foreground font-medium"
                    aria-current="page"
                  >
                    {segment.name}
                  </span>
                ) : (
                  <Link
                    href={getSegmentUrl(index)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {segment.name}
                  </Link>
                )}
              </li>

              {!isLast && (
                <li aria-hidden="true" className="shrink-0">
                  <ChevronRightIcon className="size-4 text-muted-foreground/50" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
