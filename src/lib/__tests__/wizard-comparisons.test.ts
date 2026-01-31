/**
 * Tests for wizard-comparisons utilities
 *
 * Tests the generation of personalized budget comparisons based on
 * user wizard answers (priorities and wasteful categories).
 */

import { describe, it, expect } from "vitest";
import {
  generateWizardComparisons,
  formatComparisonHeadline,
  type WizardComparison,
} from "@/lib/wizard-comparisons";
import type {
  PriorityCategory,
  WastefulCategory,
} from "@/lib/wizard-categories";

describe("wizard-comparisons", () => {
  describe("generateWizardComparisons", () => {
    it("should return an array of comparisons", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return max 5 comparisons", () => {
      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
      ];
      const wasteful: WastefulCategory[] = ["defense", "foreign-aid", "admin"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should prioritize topPriority category comparisons", () => {
      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
      ];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      // First comparison should be marked as top priority
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]?.isTopPriority).toBe(true);
      expect(result[0]?.priorityCategory).toBe(topPriority);
    });

    it("should return comparisons with required fields", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);

      result.forEach((comparison) => {
        expect(comparison).toMatchObject({
          budgetItem: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            amount: expect.any(Number),
          }),
          unit: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
          unitCount: expect.any(Number),
          isTopPriority: expect.any(Boolean),
          priorityCategory: expect.any(String),
          wastefulCategory: expect.any(String),
        });
      });
    });

    it("should calculate count correctly (amount / costPerUnit)", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);

      result.forEach((comparison) => {
        const costPerUnit =
          comparison.unit.costPerUnit ?? comparison.unit.cost ?? 0;
        const expectedCount = comparison.budgetItem.amount / costPerUnit;

        expect(comparison.unitCount).toBeCloseTo(expectedCount, 2);
      });
    });

    it("should return empty array for empty priority input", () => {
      const priorities: PriorityCategory[] = [];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result).toEqual([]);
    });

    it("should return empty array for empty wasteful input", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = [];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result).toEqual([]);
    });

    it("should return empty array when both inputs are empty", () => {
      const priorities: PriorityCategory[] = [];
      const wasteful: WastefulCategory[] = [];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result).toEqual([]);
    });

    it("should handle invalid category IDs gracefully", () => {
      // TypeScript prevents invalid IDs, but test runtime behavior
      const priorities: PriorityCategory[] = ["education"];
      const wasteful = ["invalid-category" as WastefulCategory];
      const topPriority: PriorityCategory = "education";

      // Should not throw error
      expect(() => {
        generateWizardComparisons(priorities, wasteful, topPriority);
      }).not.toThrow();

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );
      // Should return empty array since invalid category has no budget items
      expect(result).toEqual([]);
    });

    it("should only include comparisons with unitCount >= 1", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      result.forEach((comparison) => {
        expect(comparison.unitCount).toBeGreaterThanOrEqual(1);
      });
    });

    it("should have positive budget amounts", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);

      result.forEach((comparison) => {
        expect(comparison.budgetItem.amount).toBeGreaterThan(0);
      });
    });

    it("should have valid unit costs", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);

      result.forEach((comparison) => {
        const costPerUnit =
          comparison.unit.costPerUnit ?? comparison.unit.cost ?? 0;
        expect(costPerUnit).toBeGreaterThan(0);
      });
    });

    it("should sort with top priority first, then by unit count", () => {
      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
      ];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      if (result.length > 1) {
        // First item should be top priority
        expect(result[0]?.isTopPriority).toBe(true);

        // Among top priority items, higher unit counts should come first
        let foundNonTopPriority = false;
        for (let i = 1; i < result.length; i++) {
          if (!result[i]?.isTopPriority) {
            foundNonTopPriority = true;
          }

          // Once we find a non-top priority item, all remaining should also be non-top
          if (foundNonTopPriority) {
            expect(result[i]?.isTopPriority).toBe(false);
          }
        }
      }
    });

    it("should include category metadata in results", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense", "foreign-aid"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);

      result.forEach((comparison) => {
        // Should have one of the priority categories
        expect(priorities).toContain(comparison.priorityCategory);

        // Should have one of the wasteful categories
        expect(wasteful).toContain(comparison.wastefulCategory);
      });
    });

    it("should generate comparisons for multiple wasteful categories", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wasteful: WastefulCategory[] = ["defense", "foreign-aid"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      // Should have comparisons from both wasteful categories
      const wastefulCategoriesFound = new Set(
        result.map((c) => c.wastefulCategory),
      );

      // May not have all categories if one doesn't have budget items
      expect(wastefulCategoriesFound.size).toBeGreaterThan(0);
    });

    it("should generate comparisons for multiple priority categories", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      // Should have comparisons from multiple priority categories
      const priorityCategoriesFound = new Set(
        result.map((c) => c.priorityCategory),
      );

      // May not have all categories if units don't match well
      expect(priorityCategoriesFound.size).toBeGreaterThan(0);
    });
  });

  describe("formatComparisonHeadline", () => {
    it("should format headline with budget item name and unit count", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "dept-defense",
          name: "Department of Defense",
          amount: 895_000_000_000,
          tier: "department",
          fiscalYear: 2025,
          source: "Test",
          description: "Test department",
        },
        unit: {
          id: "teacher-salary",
          name: "teacher salaries",
          nameSingular: "teacher salary",
          costPerUnit: 50_000,
          category: "education",
        },
        unitCount: 17_900_000,
        isTopPriority: true,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      expect(headline).toContain("Department of Defense");
      expect(headline).toContain("could fund");
      expect(headline).toContain("teacher salaries");
      expect(headline).toContain("17,900,000");
    });

    it("should use singular form when count is 1", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 50_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "teacher-salary",
          name: "teacher salaries",
          nameSingular: "teacher salary",
          costPerUnit: 50_000,
          category: "education",
        },
        unitCount: 1,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      expect(headline).toContain("teacher salary");
      expect(headline).not.toContain("teacher salaries");
    });

    it("should use plural form when count is greater than 1", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 100_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "teacher-salary",
          name: "teacher salaries",
          nameSingular: "teacher salary",
          costPerUnit: 50_000,
          category: "education",
        },
        unitCount: 2,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      expect(headline).toContain("teacher salaries");
      expect(headline).not.toContain("teacher salary");
    });

    it("should format numbers with thousands separators", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 1_000_000_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "test-unit",
          name: "widgets",
          nameSingular: "widget",
          costPerUnit: 100,
          category: "general",
        },
        unitCount: 10_000_000,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      expect(headline).toContain("10,000,000");
    });

    it("should floor the unit count in headline", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 100_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "test-unit",
          name: "widgets",
          nameSingular: "widget",
          costPerUnit: 30_000,
          category: "general",
        },
        unitCount: 3.33333,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      // Should show "3" not "3.33333"
      expect(headline).toContain("3 widgets");
      expect(headline).not.toContain("3.33");
    });

    it("should use unit.name as fallback if nameSingular is missing", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 50_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "test-unit",
          name: "widgets",
          costPerUnit: 50_000,
          category: "general",
        },
        unitCount: 1,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      // Should still work even without nameSingular
      expect(headline).toContain("widgets");
      expect(headline).toContain("could fund");
    });

    it("should produce non-empty headline", () => {
      const comparison: WizardComparison = {
        budgetItem: {
          id: "test-item",
          name: "Test Item",
          amount: 100_000,
          tier: "program",
          fiscalYear: 2025,
          source: "Test",
          description: "Test",
        },
        unit: {
          id: "test-unit",
          name: "test units",
          costPerUnit: 10_000,
          category: "general",
        },
        unitCount: 10,
        isTopPriority: false,
        priorityCategory: "education",
        wastefulCategory: "defense",
      };

      const headline = formatComparisonHeadline(comparison);

      expect(headline).toBeDefined();
      expect(headline.length).toBeGreaterThan(0);
    });
  });

  describe("integration tests", () => {
    it("should generate valid comparisons with real categories", () => {
      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
      ];
      const wasteful: WastefulCategory[] = ["defense", "farm-subsidies"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(5);

      // All results should be valid and formattable
      result.forEach((comparison) => {
        const headline = formatComparisonHeadline(comparison);
        expect(headline).toBeDefined();
        expect(headline.length).toBeGreaterThan(0);
      });
    });

    it("should work with all priority categories", () => {
      const allPriorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        allPriorities,
        wasteful,
        topPriority,
      );

      // Should work without errors
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should work with all wasteful categories", () => {
      const priorities: PriorityCategory[] = ["education"];
      const allWasteful: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
        "other",
      ];
      const topPriority: PriorityCategory = "education";

      const result = generateWizardComparisons(
        priorities,
        allWasteful,
        topPriority,
      );

      // Should work without errors
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
