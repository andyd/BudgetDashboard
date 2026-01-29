'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  badge?: string;
  className?: string;
}

export function HeroSection({
  title = 'Build Modern Web Apps',
  subtitle = 'Faster Than Ever',
  description = 'A comprehensive Next.js 14 template with TypeScript, Tailwind CSS, and shadcn/ui. Start building your next web application with confidence.',
  primaryAction = {
    label: 'Get Started',
    href: '/get-started',
  },
  secondaryAction = {
    label: 'View Documentation',
    href: '/docs',
  },
  badge = '🚀 Next.js 14 Template',
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br',
        className
      )}
    >
      {/* Background decoration */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]" />
      <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Badge */}
          <Badge variant="secondary" className="animate-fade-in mb-4">
            <Sparkles className="mr-2 h-3 w-3" />
            {badge}
          </Badge>

          {/* Title */}
          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
            <span className="from-primary to-primary/60 block bg-gradient-to-r bg-clip-text text-transparent">
              {subtitle}
            </span>
          </h1>

          {/* Description */}
          <p className="text-muted-foreground animate-fade-in-up animation-delay-200 mx-auto max-w-3xl text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group">
              {primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              {secondaryAction.label}
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up animation-delay-600 grid grid-cols-1 gap-8 pt-16 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-primary text-3xl font-bold">14+</div>
              <div className="text-muted-foreground text-sm">
                Next.js Version
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary text-3xl font-bold">100%</div>
              <div className="text-muted-foreground text-sm">TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-primary text-3xl font-bold">∞</div>
              <div className="text-muted-foreground text-sm">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
