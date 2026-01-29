'use client';

import { LucideIcon, Download, Code, Rocket } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  details: string[];
}

interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
  className?: string;
}

const defaultSteps: Step[] = [
  {
    icon: Download,
    title: 'Clone & Install',
    description: 'Get started in minutes with our comprehensive template.',
    badge: 'Step 1',
    details: [
      'Clone the repository from GitHub',
      'Install dependencies with npm',
      'Set up environment variables',
      'Start the development server',
    ],
  },
  {
    icon: Code,
    title: 'Customize & Build',
    description: 'Modify the template to fit your project needs.',
    badge: 'Step 2',
    details: [
      'Update branding and content',
      'Add your own components',
      'Configure your database',
      'Set up authentication',
    ],
  },
  {
    icon: Rocket,
    title: 'Deploy & Launch',
    description: 'Deploy your application to production.',
    badge: 'Step 3',
    details: [
      'Build for production',
      'Deploy to your platform',
      'Configure domain and SSL',
      'Monitor and optimize',
    ],
  },
];

export function HowItWorksSection({
  title = 'How It Works',
  subtitle = 'Get your web application up and running in just 3 simple steps.',
  steps = defaultSteps,
  className,
}: HowItWorksSectionProps) {
  return (
    <section className={cn('py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Step Number */}
              <div className="bg-primary text-primary-foreground absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </div>

              <CardHeader className="pt-8 text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <step.icon className="text-primary h-6 w-6" />
                </div>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  {step.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {step.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className="flex items-start space-x-2 text-sm"
                    >
                      <div className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Lines (Desktop Only) */}
        <div className="relative mt-8 hidden md:block">
          <div className="from-primary/20 to-primary/20 absolute top-1/2 left-1/3 h-0.5 w-1/3 -translate-y-1/2 transform bg-gradient-to-r" />
          <div className="from-primary/20 to-primary/20 absolute top-1/2 left-2/3 h-0.5 w-1/3 -translate-y-1/2 transform bg-gradient-to-r" />
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <span>⚡</span>
            <span>Average setup time: 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
