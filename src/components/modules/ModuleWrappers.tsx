/**
 * ModuleWrappers.tsx
 *
 * Suspense boundary wrappers for module components.
 * Provides proper loading states and error boundaries for async module data.
 */

"use client";

import { Suspense } from "react";
import type { ComponentProps } from "react";
import {
  StatsBarSkeleton,
  ComparisonBuilderModuleSkeleton,
  BudgetOverviewModuleSkeleton,
  ExamplesSidebarSkeleton,
} from "./ModuleSkeletons";
import { StatsBar } from "./StatsBar";
import { ComparisonBuilderModule } from "./ComparisonBuilderModule";
import { BudgetOverviewModule } from "./BudgetOverviewModule";
import { ExamplesSidebar } from "./ExamplesSidebar";

// ============================================================================
// StatsBarWithSuspense
// ============================================================================

interface StatsBarWithSuspenseProps extends ComponentProps<typeof StatsBar> {
  fallback?: React.ReactNode;
}

/**
 * StatsBar with built-in Suspense boundary
 */
export function StatsBarWithSuspense({
  fallback,
  ...props
}: StatsBarWithSuspenseProps) {
  return (
    <Suspense fallback={fallback || <StatsBarSkeleton />}>
      <StatsBar {...props} />
    </Suspense>
  );
}

// ============================================================================
// ComparisonBuilderModuleWithSuspense
// ============================================================================

interface ComparisonBuilderModuleWithSuspenseProps extends ComponentProps<
  typeof ComparisonBuilderModule
> {
  fallback?: React.ReactNode;
}

/**
 * ComparisonBuilderModule with built-in Suspense boundary
 */
export function ComparisonBuilderModuleWithSuspense({
  fallback,
  ...props
}: ComparisonBuilderModuleWithSuspenseProps) {
  return (
    <Suspense fallback={fallback || <ComparisonBuilderModuleSkeleton />}>
      <ComparisonBuilderModule {...props} />
    </Suspense>
  );
}

// ============================================================================
// BudgetOverviewModuleWithSuspense
// ============================================================================

interface BudgetOverviewModuleWithSuspenseProps extends ComponentProps<
  typeof BudgetOverviewModule
> {
  fallback?: React.ReactNode;
}

/**
 * BudgetOverviewModule with built-in Suspense boundary
 */
export function BudgetOverviewModuleWithSuspense({
  fallback,
  ...props
}: BudgetOverviewModuleWithSuspenseProps) {
  return (
    <Suspense fallback={fallback || <BudgetOverviewModuleSkeleton />}>
      <BudgetOverviewModule {...props} />
    </Suspense>
  );
}

// ============================================================================
// ExamplesSidebarWithSuspense
// ============================================================================

interface ExamplesSidebarWithSuspenseProps extends ComponentProps<
  typeof ExamplesSidebar
> {
  fallback?: React.ReactNode;
}

/**
 * ExamplesSidebar with built-in Suspense boundary
 */
export function ExamplesSidebarWithSuspense({
  fallback,
  ...props
}: ExamplesSidebarWithSuspenseProps) {
  return (
    <Suspense fallback={fallback || <ExamplesSidebarSkeleton />}>
      <ExamplesSidebar {...props} />
    </Suspense>
  );
}
