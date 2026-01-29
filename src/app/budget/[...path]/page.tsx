'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { BudgetBreadcrumb } from '@/components/budget/BudgetBreadcrumb';
import { SpotlightPanel } from '@/components/budget/SpotlightPanel';
import { YearOverYearIndicator } from '@/components/budget/YearOverYearIndicator';
import { BudgetPieChart } from '@/components/budget/BudgetPieChart';
import { ComparisonCard } from '@/components/comparison/ComparisonCard';
import { Button } from '@/components/ui/button';
import type { BudgetItem } from '@/types/budget';
import { formatCurrency, formatCompact } from '@/lib/format';
import { mockUnits } from '@/lib/mock-data/units';
import { convertBudgetToUnits } from '@/lib/unit-converter';

interface BudgetData {
  item: BudgetItem & { children?: BudgetItem[] };
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  spotlight?: {
    title: string;
    description: string;
    sources: Array<{ label: string; url: string }>;
  } | undefined;
}

/**
 * Mock data - Replace with actual API calls
 */
function getBudgetItemByPath(path: string[]): BudgetData | null {
  const mockData: Record<string, BudgetData['item'] & { spotlight?: BudgetData['spotlight'] }> = {
    defense: {
      id: 'dept-defense',
      name: 'Department of Defense',
      amount: 842_000_000_000,
      parentId: null,
      fiscalYear: 2024,
      percentOfParent: 13.2,
      yearOverYearChange: 3.1,
      children: [
        {
          id: 'defense-navy',
          name: 'Navy',
          amount: 255_800_000_000,
          parentId: 'dept-defense',
          fiscalYear: 2024,
          percentOfParent: 30.4,
          yearOverYearChange: 4.2,
        },
        {
          id: 'defense-army',
          name: 'Army',
          amount: 185_900_000_000,
          parentId: 'dept-defense',
          fiscalYear: 2024,
          percentOfParent: 22.1,
          yearOverYearChange: 1.5,
        },
        {
          id: 'defense-air-force',
          name: 'Air Force',
          amount: 194_600_000_000,
          parentId: 'dept-defense',
          fiscalYear: 2024,
          percentOfParent: 23.1,
          yearOverYearChange: 5.3,
        },
      ],
      spotlight: {
        title: 'Defense Department Budget',
        description:
          'The Department of Defense budget covers military operations, personnel salaries, equipment, research and development, and facility maintenance across all branches of the armed forces.',
        sources: [
          {
            label: 'DoD Budget Request FY2024',
            url: 'https://comptroller.defense.gov/Budget-Materials/',
          },
        ],
      },
    },
  };

  const key = path[0];
  if (!key) {
    return null;
  }

  const data = mockData[key];

  if (!data) {
    return null;
  }

  return {
    item: data,
    breadcrumbs: [
      { id: 'root', name: 'Federal Budget', slug: '' },
      { id: data.id, name: data.name, slug: key },
    ],
    spotlight: data.spotlight,
  };
}

export default function BudgetDrillDownPage() {
  const params = useParams();
  const router = useRouter();
  const path = (params.path as string[]) || [];

  const budgetData = getBudgetItemByPath(path);

  if (!budgetData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
        <h1 className="text-2xl font-bold mb-4">Budget Item Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The budget item you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const { item, breadcrumbs, spotlight } = budgetData;
  const hasChildren = item.children && item.children.length > 0;

  const parentPath =
    path.length > 1
      ? `/budget/${path.slice(0, -1).join('/')}`
      : '/';

  const relevantUnit = mockUnits.find((u) => u.category === 'everyday');
  const unitCount = relevantUnit
    ? convertBudgetToUnits(item.amount, relevantUnit)
    : null;

  const handleItemClick = (itemId: string) => {
    const clickedItem = item.children?.find((c) => c.id === itemId);
    if (clickedItem) {
      const slug = clickedItem.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      router.push(`/budget/${path.join('/')}/${slug}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={parentPath} className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Breadcrumb Navigation */}
      <BudgetBreadcrumb path={breadcrumbs} className="mb-8" />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-2">
          <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
          {item.yearOverYearChange !== null && (
            <YearOverYearIndicator
              change={item.yearOverYearChange}
              previousAmount={item.amount / (1 + item.yearOverYearChange / 100)}
              currentAmount={item.amount}
            />
          )}
        </div>

        <div className="flex items-baseline gap-4">
          <p className="text-3xl font-semibold text-muted-foreground">
            {formatCurrency(item.amount, { compact: true })}
          </p>
          {item.percentOfParent !== null && (
            <span className="text-lg text-muted-foreground">
              ({item.percentOfParent.toFixed(1)}% of parent budget)
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          Fiscal Year {item.fiscalYear}
        </p>
      </div>

      {/* Spotlight Panel - Editorial Context */}
      {spotlight && (
        <div className="mb-8">
          <SpotlightPanel
            budgetItemId={item.id}
            title={spotlight.title}
            description={spotlight.description}
            sources={spotlight.sources}
            defaultOpen={true}
          />
        </div>
      )}

      {/* Comparison Card - Contextual Reference */}
      {relevantUnit && unitCount !== null && (
        <div className="mb-8">
          <ComparisonCard
            budgetAmount={item.amount}
            unitCount={unitCount}
            unit={relevantUnit}
            headline={`${item.name} = ${formatCompact(unitCount)} ${unitCount === 1 ? relevantUnit.nameSingular : relevantUnit.name}`}
          />
        </div>
      )}

      {/* Pie Chart Visualization - Children */}
      {hasChildren && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Budget Breakdown</h2>
          <div className="h-[600px]">
            <BudgetPieChart
              data={{
                root: item,
                departments: (item.children || []).map(child => ({
                  ...child,
                  agencies: [] // Children at this level don't have agencies
                })),
                totalAmount: item.amount,
                fiscalYear: item.fiscalYear,
              }}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      )}

      {/* No Children State */}
      {!hasChildren && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            This is the most detailed level available for this budget item.
          </p>
        </div>
      )}
    </div>
  );
}
