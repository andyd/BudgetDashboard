'use client';

import { Check, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PricingFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  cta: string;
  href: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
  className?: string;
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for personal projects and learning.',
    popular: false,
    cta: 'Get Started',
    href: 'https://github.com/andyd/webapp-template',
    features: [
      { name: 'Full template access', included: true },
      { name: 'TypeScript support', included: true },
      { name: 'Tailwind CSS setup', included: true },
      { name: 'shadcn/ui components', included: true },
      { name: 'Dark/light mode', included: true },
      { name: 'Responsive design', included: true },
      { name: 'Basic documentation', included: true },
      { name: 'Community support', included: true },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'Advanced features', included: false },
      { name: 'Commercial license', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For professional developers and small teams.',
    popular: true,
    cta: 'Get Pro',
    href: '/pricing/pro',
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced components', included: true },
      { name: 'Premium templates', included: true },
      { name: 'Commercial license', included: true },
      { name: 'API integrations', included: true },
      { name: 'Performance optimization', included: true },
      { name: 'Custom deployment', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Analytics dashboard', included: true },
      { name: 'White-label solution', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: '$199',
    description: 'For large organizations and agencies.',
    popular: false,
    cta: 'Contact Sales',
    href: '/contact',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'White-label solution', included: true },
      { name: 'Custom development', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Training & workshops', included: true },
      { name: 'Source code access', included: true },
      { name: 'Custom licensing', included: true },
      { name: 'Priority feature requests', included: true },
      { name: 'Account manager', included: true },
    ],
  },
];

export function PricingSection({
  title = 'Simple, Transparent Pricing',
  subtitle = "Choose the plan that's right for you. All plans include our core features.",
  tiers = defaultTiers,
  className,
}: PricingSectionProps) {
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

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                tier.popular && 'ring-primary shadow-lg ring-2'
              )}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">{tier.price}</div>
                  <CardDescription className="text-base">
                    {tier.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-center space-x-3"
                    >
                      {feature.included ? (
                        <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                      ) : (
                        <X className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          feature.included
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    'w-full',
                    tier.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-secondary hover:bg-secondary/80'
                  )}
                  asChild
                >
                  <a href={tier.href}>{tier.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 space-y-4 text-center">
          <p className="text-muted-foreground">
            All plans include updates and security patches. Need a custom plan?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
