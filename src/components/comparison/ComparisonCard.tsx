'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { ComparisonUnit } from '@/types/comparison';

interface ComparisonCardProps {
  /** Budget amount in dollars */
  budgetAmount: number;

  /** Number of comparison units */
  unitCount: number;

  /** Comparison unit details */
  unit: ComparisonUnit;

  /** Headline text for the comparison */
  headline: string;

  /** Additional context or description */
  context?: string;

  /** Additional CSS classes */
  className?: string;
}

export function ComparisonCard({
  budgetAmount,
  unitCount,
  unit,
  headline,
  context,
  className,
}: ComparisonCardProps) {
  // Format numbers for display
  const formattedBudget = formatCurrency(budgetAmount, { compact: true });
  const formattedUnitCount = formatNumber(Math.floor(unitCount));
  const formattedCostPerUnit = formatCurrency(unit.costPerUnit, { compact: true });

  // Determine correct unit name (singular vs plural)
  const unitName = unitCount === 1 ? unit.nameSingular : unit.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        className={cn(
          'relative overflow-hidden',
          'bg-gradient-to-br from-purple-50 via-white to-blue-50',
          'dark:from-purple-950/20 dark:via-gray-950 dark:to-blue-950/20',
          'border-purple-200/60 dark:border-purple-800/40',
          'shadow-lg hover:shadow-xl transition-shadow duration-300',
          className
        )}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <CardContent className="relative p-8 space-y-6">
          {/* Icon and Category Badge */}
          <div className="flex items-center justify-between">
            {unit.icon && (
              <span className="text-5xl" role="img" aria-label={unit.name}>
                {unit.icon}
              </span>
            )}
            <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {unit.category}
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              {headline}
            </h3>
          </div>

          {/* Visual Equation: $X = Y units */}
          <motion.div
            className="flex items-center justify-center gap-4 py-6 px-4 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-200/40 dark:border-purple-800/40"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-400">
                {formattedBudget}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Budget</div>
            </div>

            <div className="text-2xl md:text-3xl font-bold text-gray-400 dark:text-gray-600">=</div>

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400">
                {formattedUnitCount}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{unitName}</div>
            </div>
          </motion.div>

          {/* Context Text */}
          {context && (
            <div className="pt-4 border-t border-purple-200/40 dark:border-purple-800/40">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {context}
              </p>
            </div>
          )}

          {/* Unit Details */}
          <div className="pt-4 border-t border-purple-200/40 dark:border-purple-800/40 space-y-3">
            {unit.description && (
              <p className="text-sm text-muted-foreground italic">
                {unit.description}
              </p>
            )}

            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Cost per unit:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formattedCostPerUnit}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
