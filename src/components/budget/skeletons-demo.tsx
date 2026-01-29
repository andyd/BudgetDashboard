/**
 * Demo file showing usage of skeleton components
 *
 * These skeletons can be used while loading data:
 *
 * @example Loading state with BudgetTreemapSkeleton
 * ```tsx
 * import { BudgetTreemapSkeleton } from '@/components/budget';
 *
 * function BudgetView() {
 *   const { data, isLoading } = useBudgetData();
 *
 *   if (isLoading) {
 *     return <BudgetTreemapSkeleton />;
 *   }
 *
 *   return <BudgetTreemap data={data} />;
 * }
 * ```
 *
 * @example Loading state with ComparisonCardSkeleton
 * ```tsx
 * import { ComparisonCardSkeleton } from '@/components/comparison';
 *
 * function ComparisonList() {
 *   const { comparisons, isLoading } = useComparisons();
 *
 *   if (isLoading) {
 *     return (
 *       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 *         <ComparisonCardSkeleton />
 *         <ComparisonCardSkeleton />
 *         <ComparisonCardSkeleton />
 *       </div>
 *     );
 *   }
 *
 *   return comparisons.map((c) => <ComparisonCard key={c.id} comparison={c} />);
 * }
 * ```
 *
 * @example Full page loading with DrillDownSkeleton
 * ```tsx
 * import { DrillDownSkeleton } from '@/components/budget';
 *
 * function BudgetDetailPage({ params }: { params: { path: string[] } }) {
 *   const { data, isLoading } = useBudgetDetail(params.path);
 *
 *   if (isLoading) {
 *     return <DrillDownSkeleton />;
 *   }
 *
 *   return <DrillDownPanel data={data} />;
 * }
 * ```
 */

export {};
