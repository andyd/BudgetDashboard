import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { BudgetBreadcrumb } from '@/components/budget/BudgetBreadcrumb';
import { SpotlightPanel } from '@/components/budget/SpotlightPanel';
import { YearOverYearIndicator } from '@/components/budget/YearOverYearIndicator';
import { BudgetTreemap } from '@/components/budget/BudgetTreemap';
import { ComparisonCard } from '@/components/comparison/ComparisonCard';
import { Button } from '@/components/ui/button';
import type { BudgetItem } from '@/types/budget';
import { formatCurrency, formatCompact } from '@/lib/format';
import { mockUnits } from '@/lib/mock-data/units';
import { convertBudgetToUnits } from '@/lib/unit-converter';

interface PageProps {
  params: Promise<{
    path: string[];
  }>;
}

/**
 * Mock data fetching - Replace with actual API calls
 */
async function getBudgetItemByPath(path: string[]): Promise<{
  item: BudgetItem & { children?: BudgetItem[] };
  breadcrumbs: Array<{ id: string; name: string; slug: string }>;
  spotlight?: {
    title: string;
    description: string;
    sources: Array<{ label: string; url: string }>;
  };
} | null> {
  // TODO: Replace with actual database/API call
  // For now, return mock data structure
  const mockData: Record<string, any> = {
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

  // Simple path lookup (first segment only for mock)
  const key = path[0];
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

/**
 * Generate static params for top-level departments
 */
export async function generateStaticParams() {
  // TODO: Replace with actual data source
  const topLevelDepartments = [
    'defense',
    'health-human-services',
    'treasury',
    'education',
    'veterans-affairs',
    'homeland-security',
    'justice',
    'agriculture',
    'transportation',
    'energy',
  ];

  return topLevelDepartments.map((dept) => ({
    path: [dept],
  }));
}

export default async function BudgetDrillDownPage(props: PageProps) {
  const params = await props.params;
  const { path } = params;

  // Fetch budget data for this path
  const budgetData = await getBudgetItemByPath(path);

  if (!budgetData) {
    notFound();
  }

  const { item, breadcrumbs, spotlight } = budgetData;
  const hasChildren = item.children && item.children.length > 0;

  // Calculate parent path for back button
  const parentPath =
    path.length > 1
      ? `/budget/${path.slice(0, -1).join('/')}`
      : '/';

  // Find a relevant comparison unit
  const relevantUnit = mockUnits.find((u) => u.category === 'everyday');
  const comparisonResult = relevantUnit
    ? convertBudgetToUnits(item.amount, relevantUnit)
    : null;

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
      {relevantUnit && comparisonResult && (
        <div className="mb-8">
          <ComparisonCard
            budgetAmount={item.amount}
            unitCount={comparisonResult.unitCount}
            unit={relevantUnit}
            headline={`${item.name} = ${formatCompact(comparisonResult.unitCount)} ${comparisonResult.unitCount === 1 ? relevantUnit.nameSingular : relevantUnit.name}`}
          />
        </div>
      )}

      {/* Treemap Visualization - Children */}
      {hasChildren && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Budget Breakdown</h2>
          <div className="h-[600px]">
            <BudgetTreemap
              data={{
                root: item,
                departments: item.children || [],
                totalAmount: item.amount,
                fiscalYear: item.fiscalYear,
              }}
              onItemClick={(itemId) => {
                // Find the clicked item and navigate to it
                const clickedItem = item.children?.find((c) => c.id === itemId);
                if (clickedItem) {
                  const slug = clickedItem.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                  window.location.href = `/budget/${path.join('/')}/${slug}`;
                }
              }}
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
