'use client';

import { ArrowRight, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryAction?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  badge?: string;
  className?: string;
}

export function CTASection({
  title = 'Ready to Get Started?',
  subtitle = 'Join thousands of developers building amazing web applications with this template.',
  primaryAction = {
    label: 'Start Building',
    href: 'https://github.com/andyd/webapp-template',
    icon: Github,
  },
  secondaryAction = {
    label: 'Learn More',
    href: '/docs',
  },
  badge = '🚀 Free & Open Source',
  className,
}: CTASectionProps) {
  const PrimaryIcon = primaryAction.icon || ArrowRight;
  const SecondaryIcon = secondaryAction.icon;

  return (
    <section
      className={cn('bg-primary text-primary-foreground py-24', className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 mb-4"
          >
            {badge}
          </Badge>

          {/* Title */}
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xl opacity-90">{subtitle}</p>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="group" asChild>
              <a
                href={primaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PrimaryIcon className="mr-2 h-4 w-4" />
                {primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <a href={secondaryAction.href}>
                {secondaryAction.label}
                {SecondaryIcon && <SecondaryIcon className="ml-2 h-4 w-4" />}
              </a>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col items-center justify-center gap-8 pt-8 sm:flex-row">
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Star className="h-4 w-4 fill-current" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Github className="h-4 w-4" />
              <span>Open source</span>
            </div>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <span>✨</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
