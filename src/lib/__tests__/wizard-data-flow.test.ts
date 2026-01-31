/**
 * Wizard Data Flow Validation Tests
 *
 * Verifies end-to-end data flow for wizard comparisons:
 * 1. All category IDs reference valid budget items
 * 2. All category IDs reference valid comparison units
 * 3. Budget items can be retrieved by category
 * 4. Comparison units can be retrieved by category
 * 5. Generated comparisons are valid and complete
 */

import { describe, it, expect } from "vitest";
import {
  PRIORITY_CATEGORIES,
  WASTEFUL_CATEGORIES,
  getBudgetItemsForCategory,
  getComparisonUnitsForCategory,
  getCategoryBudgetTotal,
  type PriorityCategory,
  type WastefulCategory,
} from "../wizard-categories";
import { generateWizardComparisons } from "../wizard-comparisons";
import { ALL_BUDGET_ITEMS, getItemById } from "../data/budget-items";
import { ALL_COMPARISON_UNITS, getUnitById } from "../data/comparison-units";

describe("Wizard Data Flow", () => {
  describe("Category ID Validation", () => {
    it("should have all priority categories defined", () => {
      const expectedCategories: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];

      expectedCategories.forEach((category) => {
        expect(PRIORITY_CATEGORIES[category]).toBeDefined();
        expect(PRIORITY_CATEGORIES[category].id).toBe(category);
      });
    });

    it("should have all wasteful categories defined", () => {
      const expectedCategories: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
        "other",
      ];

      expectedCategories.forEach((category) => {
        expect(WASTEFUL_CATEGORIES[category]).toBeDefined();
        expect(WASTEFUL_CATEGORIES[category].id).toBe(category);
      });
    });
  });

  describe("Budget Items Mapping", () => {
    it("should return valid budget items for defense category", () => {
      const items = getBudgetItemsForCategory("defense");

      expect(items.length).toBeGreaterThan(0);

      // Check specific expected items
      const expectedIds = [
        "dept-defense",
        "program-f35",
        "program-aircraft-carrier",
        "program-nuclear-weapons",
        "program-missile-defense",
        "program-overseas-operations",
      ];

      expectedIds.forEach((id) => {
        const item = getItemById(id);
        if (!item) {
          console.warn(`Missing budget item: ${id}`);
        }
      });

      // All returned items should exist in ALL_BUDGET_ITEMS
      items.forEach((item) => {
        expect(ALL_BUDGET_ITEMS).toContainEqual(item);
      });
    });

    it("should return valid budget items for foreign-aid category", () => {
      const items = getBudgetItemsForCategory("foreign-aid");

      expect(items.length).toBeGreaterThan(0);

      const expectedIds = ["dept-state"];

      expectedIds.forEach((id) => {
        const item = getItemById(id);
        expect(item).toBeDefined();
      });

      items.forEach((item) => {
        expect(ALL_BUDGET_ITEMS).toContainEqual(item);
      });
    });

    it("should return valid budget items for admin category", () => {
      const items = getBudgetItemsForCategory("admin");

      // May be empty or have items
      items.forEach((item) => {
        expect(ALL_BUDGET_ITEMS).toContainEqual(item);
      });
    });

    it("should return valid budget items for farm-subsidies category", () => {
      const items = getBudgetItemsForCategory("farm-subsidies");

      expect(items.length).toBeGreaterThan(0);

      const expectedIds = ["dept-usda"];

      expectedIds.forEach((id) => {
        const item = getItemById(id);
        expect(item).toBeDefined();
      });

      items.forEach((item) => {
        expect(ALL_BUDGET_ITEMS).toContainEqual(item);
      });
    });

    it("should return valid budget items for interest category", () => {
      const items = getBudgetItemsForCategory("interest");

      expect(items.length).toBeGreaterThan(0);

      const expectedIds = ["dept-treasury"];

      expectedIds.forEach((id) => {
        const item = getItemById(id);
        expect(item).toBeDefined();
      });

      items.forEach((item) => {
        expect(ALL_BUDGET_ITEMS).toContainEqual(item);
      });
    });

    it("should verify all referenced budget item IDs exist", () => {
      const allReferencedIds = new Set<string>();

      // Collect all IDs referenced in wasteful categories
      const wastefulCategories: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
        "other",
      ];

      wastefulCategories.forEach((category) => {
        const items = getBudgetItemsForCategory(category);
        items.forEach((item) => allReferencedIds.add(item.id));
      });

      // Check that all referenced IDs exist
      allReferencedIds.forEach((id) => {
        const item = getItemById(id);
        expect(item, `Budget item ${id} should exist`).toBeDefined();
      });
    });
  });

  describe("Comparison Units Mapping", () => {
    it("should return valid comparison units for education category", () => {
      const units = getComparisonUnitsForCategory("education");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("education");
      });
    });

    it("should return valid comparison units for healthcare category", () => {
      const units = getComparisonUnitsForCategory("healthcare");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("healthcare");
      });
    });

    it("should return valid comparison units for veterans category", () => {
      const units = getComparisonUnitsForCategory("veterans");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("veterans");
      });
    });

    it("should return valid comparison units for infrastructure category", () => {
      const units = getComparisonUnitsForCategory("infrastructure");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("transportation");
      });
    });

    it("should return valid comparison units for environment category", () => {
      const units = getComparisonUnitsForCategory("environment");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("environment");
      });
    });

    it("should return valid comparison units for housing category", () => {
      const units = getComparisonUnitsForCategory("housing");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("housing");
      });
    });

    it("should return valid comparison units for science category", () => {
      const units = getComparisonUnitsForCategory("science");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        // Science maps to education category
        expect(unit.category).toBe("education");
      });
    });

    it("should return valid comparison units for social-security category", () => {
      const units = getComparisonUnitsForCategory("social-security");

      expect(units.length).toBeGreaterThan(0);

      units.forEach((unit) => {
        expect(ALL_COMPARISON_UNITS).toContainEqual(unit);
        expect(unit.category).toBe("income");
      });
    });
  });

  describe("Category Budget Totals", () => {
    it("should calculate budget totals for priority categories", () => {
      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];

      priorities.forEach((category) => {
        const total = getCategoryBudgetTotal(category);
        expect(total).toBeGreaterThan(0);
      });
    });

    it("should calculate budget totals for wasteful categories", () => {
      const wastefulCategories: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
      ];

      wastefulCategories.forEach((category) => {
        const total = getCategoryBudgetTotal(category);
        if (category !== "other") {
          expect(total).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("Wizard Comparison Generation", () => {
    it("should generate valid comparisons for typical user input", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense", "foreign-aid"];
      const topPriority: PriorityCategory = "education";

      const comparisons = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      expect(comparisons.length).toBeGreaterThan(0);
      expect(comparisons.length).toBeLessThanOrEqual(5);

      comparisons.forEach((comparison) => {
        // Budget item should exist
        expect(comparison.budgetItem).toBeDefined();
        expect(comparison.budgetItem.amount).toBeGreaterThan(0);

        // Unit should exist
        expect(comparison.unit).toBeDefined();
        const costPerUnit = comparison.unit.costPerUnit ?? comparison.unit.cost;
        expect(costPerUnit).toBeGreaterThan(0);

        // Unit count should be valid
        expect(comparison.unitCount).toBeGreaterThanOrEqual(1);

        // Categories should match inputs
        expect(priorities).toContain(comparison.priorityCategory);
        expect(wasteful).toContain(comparison.wastefulCategory);
      });
    });

    it("should prioritize top priority matches", () => {
      const priorities: PriorityCategory[] = ["education", "healthcare"];
      const wasteful: WastefulCategory[] = ["defense"];
      const topPriority: PriorityCategory = "education";

      const comparisons = generateWizardComparisons(
        priorities,
        wasteful,
        topPriority,
      );

      // First comparison should be top priority
      if (comparisons.length > 0) {
        expect(comparisons[0]?.isTopPriority).toBe(true);
        expect(comparisons[0]?.priorityCategory).toBe(topPriority);
      }
    });

    it("should handle all wasteful categories", () => {
      const priorities: PriorityCategory[] = ["education"];
      const wastefulCategories: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
      ];

      wastefulCategories.forEach((wasteful) => {
        const comparisons = generateWizardComparisons(
          priorities,
          [wasteful],
          "education",
        );

        // Should generate at least some comparisons for most categories
        if (wasteful !== "other") {
          expect(
            comparisons.length,
            `Should generate comparisons for ${wasteful}`,
          ).toBeGreaterThan(0);
        }
      });
    });

    it("should handle all priority categories", () => {
      const priorityCategories: PriorityCategory[] = [
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

      priorityCategories.forEach((priority) => {
        const comparisons = generateWizardComparisons(
          [priority],
          wasteful,
          priority,
        );

        expect(
          comparisons.length,
          `Should generate comparisons for ${priority}`,
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("Data Integrity", () => {
    it("should have no duplicate budget item IDs", () => {
      const ids = ALL_BUDGET_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size, "Should have no duplicate budget item IDs").toBe(
        ids.length,
      );
    });

    it("should have no duplicate comparison unit IDs", () => {
      const ids = ALL_COMPARISON_UNITS.map((unit) => unit.id);
      const uniqueIds = new Set(ids);

      expect(
        uniqueIds.size,
        "Should have no duplicate comparison unit IDs",
      ).toBe(ids.length);
    });

    it("should have valid cost fields in comparison units", () => {
      ALL_COMPARISON_UNITS.forEach((unit) => {
        const cost = unit.costPerUnit ?? unit.cost;

        expect(
          cost,
          `Unit ${unit.id} should have a valid cost`,
        ).toBeGreaterThan(0);
      });
    });

    it("should have valid amounts in budget items", () => {
      ALL_BUDGET_ITEMS.forEach((item) => {
        expect(
          item.amount,
          `Item ${item.id} should have a valid amount`,
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("Missing Data Detection", () => {
    it("should report all missing budget item IDs referenced by categories", () => {
      const missingIds: string[] = [];

      // Check defense category
      const defenseIds = [
        "dept-defense",
        "program-f35",
        "program-aircraft-carrier",
        "program-nuclear-weapons",
        "program-missile-defense",
        "program-overseas-operations",
      ];

      defenseIds.forEach((id) => {
        if (!getItemById(id)) {
          missingIds.push(id);
        }
      });

      // Check other wasteful categories
      const otherIds = [
        "dept-state",
        "dept-justice",
        "dept-usda",
        "dept-treasury",
      ];

      otherIds.forEach((id) => {
        if (!getItemById(id)) {
          missingIds.push(id);
        }
      });

      // Check priority category mappings
      const priorityDeptIds = [
        "dept-education",
        "dept-hhs",
        "dept-va",
        "dept-dot",
        "dept-epa",
        "dept-energy",
        "dept-hud",
        "dept-nasa",
        "dept-ssa",
      ];

      priorityDeptIds.forEach((id) => {
        if (!getItemById(id)) {
          missingIds.push(id);
        }
      });

      if (missingIds.length > 0) {
        console.warn("Missing budget item IDs:", missingIds);
      }

      expect(missingIds.length, `Missing IDs: ${missingIds.join(", ")}`).toBe(
        0,
      );
    });

    it("should report categories with no comparison units", () => {
      const emptyCategories: PriorityCategory[] = [];

      const priorities: PriorityCategory[] = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];

      priorities.forEach((category) => {
        const units = getComparisonUnitsForCategory(category);
        if (units.length === 0) {
          emptyCategories.push(category);
        }
      });

      if (emptyCategories.length > 0) {
        console.warn("Categories with no comparison units:", emptyCategories);
      }

      expect(
        emptyCategories.length,
        `Categories with no units: ${emptyCategories.join(", ")}`,
      ).toBe(0);
    });

    it("should report categories with no budget items", () => {
      const emptyCategories: WastefulCategory[] = [];

      const wastefulCategories: WastefulCategory[] = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
        "other",
      ];

      wastefulCategories.forEach((category) => {
        const items = getBudgetItemsForCategory(category);
        if (items.length === 0 && category !== "other") {
          emptyCategories.push(category);
        }
      });

      if (emptyCategories.length > 0) {
        console.warn("Categories with no budget items:", emptyCategories);
      }

      // Allow "other" to be empty
      const nonOtherEmpty = emptyCategories.filter((cat) => cat !== "other");

      expect(
        nonOtherEmpty.length,
        `Categories with no items: ${nonOtherEmpty.join(", ")}`,
      ).toBe(0);
    });
  });
});
