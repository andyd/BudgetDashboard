'use client';

import {
  LucideIcon,
  Zap,
  CheckCircle,
  Users,
  Palette,
  Moon,
  Smartphone,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  className?: string;
}

const defaultFeatures: Feature[] = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built with Next.js 14 and optimized for performance with Turbopack and React 19.',
    badge: 'Performance',
  },
  {
    icon: CheckCircle,
    title: 'Type Safe',
    description:
      'Full TypeScript support with strict mode enabled for better developer experience.',
    badge: 'TypeScript',
  },
  {
    icon: Users,
    title: 'Scalable',
    description: 'Designed to grow with your application needs and team size.',
    badge: 'Architecture',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description:
      'Modern design system with shadcn/ui components and Tailwind CSS.',
    badge: 'Design',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description:
      'Built-in dark and light theme support with system preference detection.',
    badge: 'UX',
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    description:
      'Mobile-first design that works perfectly on all devices and screen sizes.',
    badge: 'Mobile',
  },
];

export function FeaturesSection({
  title = 'Everything You Need to Build',
  subtitle = 'Modern web applications require modern tools. This template includes everything you need to build fast, scalable, and beautiful web apps.',
  features = defaultFeatures,
  className,
}: FeaturesSectionProps) {
  return (
    <section className={cn('bg-muted/30 py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            {subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <span>✨</span>
            <span>
              Ready to get started? Clone the repository and start building!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
