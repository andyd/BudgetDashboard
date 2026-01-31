/**
 * Module Components Index
 *
 * Central export point for all reusable module components.
 * Includes base components, loading skeletons, and Suspense wrappers.
 */

// Base module components
export { StatsBar } from "./StatsBar";
export { ComparisonBuilderModule } from "./ComparisonBuilderModule";
export { BudgetOverviewModule } from "./BudgetOverviewModule";
export { ExamplesSidebar } from "./ExamplesSidebar";

// Loading skeletons
export {
  StatsBarSkeleton,
  ComparisonBuilderModuleSkeleton,
  BudgetOverviewModuleSkeleton,
  ExamplesSidebarSkeleton,
} from "./ModuleSkeletons";

// Suspense wrappers
export {
  StatsBarWithSuspense,
  ComparisonBuilderModuleWithSuspense,
  BudgetOverviewModuleWithSuspense,
  ExamplesSidebarWithSuspense,
} from "./ModuleWrappers";
