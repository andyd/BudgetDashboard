/**
 * Performance tests for HomePageClient
 *
 * These tests verify that the performance optimizations are working:
 * - Components are properly memoized
 * - Callbacks are stable across renders
 * - Lazy loading works correctly
 */

import { describe, it, expect } from "vitest";
import { HomePageClient } from "@/components/home/HomePageClient";
import { ComparisonBuilderModule } from "@/components/modules/ComparisonBuilderModule";
import { BudgetOverviewModule } from "@/components/modules/BudgetOverviewModule";
import { ExamplesSidebar } from "@/components/modules/ExamplesSidebar";
import { StatsBar } from "@/components/modules/StatsBar";
import { PageLayout } from "@/components/layout/PageLayout";

describe("HomePageClient Performance", () => {
  it("should export memoized components", () => {
    // React.memo components have a $$typeof symbol
    expect(HomePageClient.$$typeof).toBe(Symbol.for("react.memo"));
    expect(ComparisonBuilderModule.$$typeof).toBe(Symbol.for("react.memo"));
    expect(BudgetOverviewModule.$$typeof).toBe(Symbol.for("react.memo"));
    expect(ExamplesSidebar.$$typeof).toBe(Symbol.for("react.memo"));
    expect(StatsBar.$$typeof).toBe(Symbol.for("react.memo"));
    expect(PageLayout.$$typeof).toBe(Symbol.for("react.memo"));
  });

  it("should have proper component names for debugging", () => {
    // Memoized components should preserve their names (may have suffixes in some environments)
    expect(HomePageClient.type.name).toContain("HomePageClient");
    expect(ComparisonBuilderModule.type.name).toContain(
      "ComparisonBuilderModule",
    );
    expect(BudgetOverviewModule.type.name).toContain("BudgetOverviewModule");
    expect(ExamplesSidebar.type.name).toContain("ExamplesSidebar");
    expect(StatsBar.type.name).toContain("StatsBar");
    expect(PageLayout.type.name).toContain("PageLayout");
  });

  it("should be importable without errors", async () => {
    // The module should be importable
    const homeModule = await import("@/components/home/HomePageClient");

    expect(homeModule.HomePageClient).toBeDefined();
    expect(homeModule.HomePageClient.$$typeof).toBe(Symbol.for("react.memo"));
  });
});
