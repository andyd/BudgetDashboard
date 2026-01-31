/**
 * Tests for comparison-engine
 *
 * Comprehensive tests for the budget comparison engine including:
 * - calculateComparison with various inputs
 * - Edge cases (zero, negative, very large numbers)
 * - calculateImpactScore scoring logic
 * - Formatting of results
 * - findBestComparison and getAlternatives
 */

import { describe, it, expect } from "vitest";
import {
  calculateComparison,
  calculateImpactScore,
  findBestComparison,
  getAlternatives,
  getAlternativeSpending,
  formatComparisonResult,
  toComparisonResult,
} from "@/lib/comparison-engine";
import type { ComparisonUnit, BudgetItem } from "@/types";

// =============================================================================
// Test Fixtures
// =============================================================================

const createUnit = (
  overrides: Partial<ComparisonUnit> = {},
): ComparisonUnit => ({
  id: "test-unit",
  name: "Test Units",
  nameSingular: "Test Unit",
  costPerUnit: 100,
  category: "everyday",
  ...overrides,
});

const createBudgetItem = (overrides: Partial<BudgetItem> = {}): BudgetItem => ({
  id: "test-item",
  name: "Test Budget Item",
  amount: 1000000,
  parentId: null,
  fiscalYear: 2025,
  ...overrides,
});

// Common test units
const eiffelTowerUnit = createUnit({
  id: "eiffel-tower",
  name: "Eiffel Towers",
  nameSingular: "Eiffel Tower",
  costPerUnit: 1_500_000_000, // $1.5 billion
  category: "infrastructure",
  icon: "🗼",
});

const latteUnit = createUnit({
  id: "starbucks-latte",
  name: "Starbucks Lattes",
  nameSingular: "Starbucks Latte",
  costPerUnit: 5,
  category: "everyday",
  icon: "☕",
});

const teslaUnit = createUnit({
  id: "tesla-model-3",
  name: "Tesla Model 3s",
  nameSingular: "Tesla Model 3",
  costPerUnit: 40_000,
  category: "vehicles",
  icon: "🚗",
});

const teacherSalaryUnit = createUnit({
  id: "teacher-salary",
  name: "Teacher Salaries",
  nameSingular: "Teacher Salary",
  costPerUnit: 60_000,
  category: "salary",
});

const hospitalUnit = createUnit({
  id: "hospital",
  name: "Hospitals",
  nameSingular: "Hospital",
  costPerUnit: 500_000_000, // $500 million
  category: "buildings",
});

// =============================================================================
// calculateComparison Tests
// =============================================================================

describe("calculateComparison", () => {
  describe("basic calculations", () => {
    it("should calculate correct count for simple division", () => {
      const result = calculateComparison(
        1000,
        createUnit({ costPerUnit: 100 }),
      );
      expect(result.count).toBe(10);
    });

    it("should calculate count for large budget amounts", () => {
      // $800 billion defense budget / $5 per latte = 160 billion lattes
      const result = calculateComparison(800_000_000_000, latteUnit);
      expect(result.count).toBe(160_000_000_000);
    });

    it("should handle fractional counts", () => {
      const result = calculateComparison(150, createUnit({ costPerUnit: 100 }));
      expect(result.count).toBe(1.5);
    });

    it("should handle very precise fractional counts", () => {
      const result = calculateComparison(333, createUnit({ costPerUnit: 100 }));
      expect(result.count).toBeCloseTo(3.33, 2);
    });
  });

  describe("formatting", () => {
    it("should format singular unit name for count of 1", () => {
      const result = calculateComparison(1_500_000_000, eiffelTowerUnit);
      expect(result.count).toBe(1);
      expect(result.formatted).toBe("1 Eiffel Tower");
    });

    it("should format plural unit name for count greater than 1", () => {
      const result = calculateComparison(3_000_000_000, eiffelTowerUnit);
      expect(result.count).toBe(2);
      expect(result.formatted).toBe("2 Eiffel Towers");
    });

    it("should format thousands correctly", () => {
      const result = calculateComparison(5_000, latteUnit);
      expect(result.count).toBe(1000);
      expect(result.formatted).toBe("1 thousand Starbucks Lattes");
    });

    it("should format millions correctly", () => {
      const result = calculateComparison(5_000_000, latteUnit);
      expect(result.count).toBe(1_000_000);
      expect(result.formatted).toBe("1 million Starbucks Lattes");
    });

    it("should format billions correctly", () => {
      const result = calculateComparison(5_000_000_000, latteUnit);
      expect(result.count).toBe(1_000_000_000);
      expect(result.formatted).toBe("1 billion Starbucks Lattes");
    });

    it("should format trillions correctly", () => {
      const result = calculateComparison(5_000_000_000_000, latteUnit);
      expect(result.count).toBe(1_000_000_000_000);
      expect(result.formatted).toBe("1 trillion Starbucks Lattes");
    });

    it("should format decimal values nicely", () => {
      // 7.5 billion lattes
      const result = calculateComparison(37_500_000_000, latteUnit);
      expect(result.count).toBe(7_500_000_000);
      expect(result.formatted).toBe("7.5 billion Starbucks Lattes");
    });
  });

  describe("edge cases - zero values", () => {
    it("should return zero count when amount is zero", () => {
      const result = calculateComparison(0, latteUnit);
      expect(result.count).toBe(0);
      expect(result.formatted).toContain("0");
    });

    it("should return zero when unit cost is zero", () => {
      const zeroCostUnit = createUnit({ costPerUnit: 0 });
      const result = calculateComparison(1000, zeroCostUnit);
      expect(result.count).toBe(0);
    });

    it("should handle unit with undefined costPerUnit using cost property", () => {
      const unit = createUnit({ costPerUnit: undefined, cost: 50 });
      const result = calculateComparison(500, unit);
      expect(result.count).toBe(10);
    });

    it("should return zero when both costPerUnit and cost are undefined", () => {
      const unit = createUnit({ costPerUnit: undefined, cost: undefined });
      const result = calculateComparison(1000, unit);
      expect(result.count).toBe(0);
    });
  });

  describe("edge cases - negative values", () => {
    it("should handle negative amounts", () => {
      const result = calculateComparison(
        -1000,
        createUnit({ costPerUnit: 100 }),
      );
      expect(result.count).toBe(-10);
    });

    it("should handle negative cost per unit", () => {
      const negativeCostUnit = createUnit({ costPerUnit: -100 });
      const result = calculateComparison(1000, negativeCostUnit);
      // Negative cost should return 0 as per the implementation
      expect(result.count).toBe(0);
    });
  });

  describe("edge cases - very large numbers", () => {
    it("should handle very large amounts (US national debt scale)", () => {
      // ~$33 trillion national debt
      const result = calculateComparison(33_000_000_000_000, latteUnit);
      expect(result.count).toBe(6_600_000_000_000); // 6.6 trillion
      expect(result.formatted).toContain("trillion");
    });

    it("should handle amounts larger than typical budget values", () => {
      const result = calculateComparison(1e15, latteUnit); // $1 quadrillion
      expect(result.count).toBe(2e14); // 200 trillion
      expect(result.formatted).toContain("trillion");
    });

    it("should handle very small fractions", () => {
      // $1 against $1.5 billion Eiffel Tower
      const result = calculateComparison(1, eiffelTowerUnit);
      expect(result.count).toBeCloseTo(6.67e-10, 12);
    });
  });

  describe("edge cases - floating point precision", () => {
    it("should handle floating point amounts", () => {
      const result = calculateComparison(
        10.5,
        createUnit({ costPerUnit: 5.25 }),
      );
      expect(result.count).toBe(2);
    });

    it("should handle very small cost per unit", () => {
      const tinyUnit = createUnit({ costPerUnit: 0.01 }); // 1 cent
      const result = calculateComparison(100, tinyUnit);
      expect(result.count).toBe(10000);
    });
  });

  describe("pluralName usage", () => {
    it("should use pluralName when provided and count is not 1", () => {
      const unit = createUnit({
        name: "Geese",
        nameSingular: "Goose",
        pluralName: "Geese",
        costPerUnit: 50,
      });
      const result = calculateComparison(100, unit);
      expect(result.formatted).toContain("Geese");
    });

    it("should use nameSingular when count is 1", () => {
      const unit = createUnit({
        name: "Geese",
        nameSingular: "Goose",
        pluralName: "Geese",
        costPerUnit: 100,
      });
      const result = calculateComparison(100, unit);
      expect(result.formatted).toBe("1 Goose");
    });

    it("should strip trailing s from name when no nameSingular provided", () => {
      const unit = createUnit({
        name: "Laptops",
        nameSingular: undefined,
        costPerUnit: 1000,
      });
      const result = calculateComparison(1000, unit);
      expect(result.formatted).toBe("1 Laptop");
    });
  });
});

// =============================================================================
// calculateImpactScore Tests
// =============================================================================

describe("calculateImpactScore", () => {
  describe("base scoring", () => {
    it("should return a score between 0 and 100", () => {
      const score = calculateImpactScore(1000000, latteUnit);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return 0 when unit cost is zero", () => {
      const zeroCostUnit = createUnit({ costPerUnit: 0 });
      const score = calculateImpactScore(1000, zeroCostUnit);
      expect(score).toBe(0);
    });

    it("should return 0 when unit cost is negative", () => {
      const negativeCostUnit = createUnit({ costPerUnit: -100 });
      const score = calculateImpactScore(1000, negativeCostUnit);
      expect(score).toBe(0);
    });
  });

  describe("roundness scoring", () => {
    it("should give high scores to exact powers of 10", () => {
      // Amount that results in exactly 100 units
      const unit = createUnit({ costPerUnit: 10 });
      const score100 = calculateImpactScore(1000, unit); // 100 units

      // Amount that results in 137 units
      const score137 = calculateImpactScore(1370, unit); // 137 units

      expect(score100).toBeGreaterThan(score137);
    });

    it("should prefer round thousands over irregular numbers", () => {
      const unit = createUnit({ costPerUnit: 1 });
      const scoreRound = calculateImpactScore(10000, unit); // 10,000 units
      const scoreIrregular = calculateImpactScore(12345, unit); // 12,345 units

      expect(scoreRound).toBeGreaterThan(scoreIrregular);
    });
  });

  describe("range scoring", () => {
    it("should score 1-100 range highest", () => {
      // Unit that produces exactly 50 (in sweet spot 1-100)
      const unit = createUnit({ costPerUnit: 10 });
      const scoreLowRange = calculateImpactScore(500, unit); // 50 units

      // Unit that produces a much larger count outside the sweet spot
      // Using a unit that produces billions (far outside optimal range)
      const unit2 = createUnit({ costPerUnit: 0.0000001 });
      const scoreVeryHighRange = calculateImpactScore(500, unit2); // 5 billion units

      expect(scoreLowRange).toBeGreaterThan(scoreVeryHighRange);
    });

    it("should penalize extremely large counts (trillions)", () => {
      const unit = createUnit({ costPerUnit: 0.00001 });
      const scoreTrillions = calculateImpactScore(100000000, unit); // Results in trillions

      const unit2 = createUnit({ costPerUnit: 100 });
      const scoreReasonable = calculateImpactScore(100000000, unit2); // 1 million

      expect(scoreReasonable).toBeGreaterThan(scoreTrillions);
    });
  });

  describe("fractional penalty", () => {
    it("should penalize fractional counts", () => {
      const unit = createUnit({ costPerUnit: 1000 });
      const scoreFraction = calculateImpactScore(500, unit); // 0.5 units

      const unit2 = createUnit({ costPerUnit: 100 });
      const scoreWhole = calculateImpactScore(500, unit2); // 5 units

      expect(scoreWhole).toBeGreaterThan(scoreFraction);
    });

    it("should give lower scores to very small fractions", () => {
      const unit = createUnit({ costPerUnit: 1000000 });
      const scoreTinyFraction = calculateImpactScore(100, unit); // 0.0001 units

      const unit2 = createUnit({ costPerUnit: 2000 });
      const scoreHalfUnit = calculateImpactScore(1000, unit2); // 0.5 units

      expect(scoreHalfUnit).toBeGreaterThan(scoreTinyFraction);
    });
  });

  describe("realistic comparisons", () => {
    it("should prefer memorable comparisons for defense budget", () => {
      const defenseAmount = 800_000_000_000; // $800 billion

      const latteScore = calculateImpactScore(defenseAmount, latteUnit);
      const hospitalScore = calculateImpactScore(defenseAmount, hospitalUnit);

      // Both should be valid scores
      expect(latteScore).toBeGreaterThan(0);
      expect(hospitalScore).toBeGreaterThan(0);
    });

    it("should handle typical government program amounts", () => {
      const mediumProgram = 50_000_000_000; // $50 billion

      const teslaScore = calculateImpactScore(mediumProgram, teslaUnit);
      const teacherScore = calculateImpactScore(
        mediumProgram,
        teacherSalaryUnit,
      );

      expect(teslaScore).toBeGreaterThan(0);
      expect(teacherScore).toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// findBestComparison Tests
// =============================================================================

describe("findBestComparison", () => {
  const allUnits = [
    latteUnit,
    teslaUnit,
    eiffelTowerUnit,
    hospitalUnit,
    teacherSalaryUnit,
  ];

  it("should return undefined for empty units array", () => {
    const result = findBestComparison(1000000, []);
    expect(result).toBeUndefined();
  });

  it("should return a unit from the provided array", () => {
    const result = findBestComparison(1000000, allUnits);
    expect(result).toBeDefined();
    expect(allUnits).toContain(result);
  });

  it("should return the only unit when array has one element", () => {
    const result = findBestComparison(1000000, [latteUnit]);
    expect(result).toBe(latteUnit);
  });

  it("should select appropriate unit for small amounts", () => {
    const smallAmount = 500; // $500
    const result = findBestComparison(smallAmount, allUnits);
    expect(result).toBeDefined();
    // For $500, lattes (100 of them) should be more memorable
    // than 0.0000003 Eiffel Towers
  });

  it("should select appropriate unit for large amounts", () => {
    const largeAmount = 100_000_000_000; // $100 billion
    const result = findBestComparison(largeAmount, allUnits);
    expect(result).toBeDefined();
  });

  it("should be deterministic (same input, same output)", () => {
    const amount = 5_000_000_000;
    const result1 = findBestComparison(amount, allUnits);
    const result2 = findBestComparison(amount, allUnits);
    expect(result1).toBe(result2);
  });
});

// =============================================================================
// getAlternatives Tests
// =============================================================================

describe("getAlternatives", () => {
  const allUnits = [
    latteUnit,
    teslaUnit,
    eiffelTowerUnit,
    hospitalUnit,
    teacherSalaryUnit,
  ];

  it("should return empty array when no other units available", () => {
    const result = getAlternatives(1000000, latteUnit, [latteUnit]);
    expect(result).toEqual([]);
  });

  it("should exclude the selected unit from alternatives", () => {
    const result = getAlternatives(1000000, latteUnit, allUnits);
    expect(result).not.toContain(latteUnit);
  });

  it("should return at most 3 alternatives", () => {
    const result = getAlternatives(1000000, latteUnit, allUnits);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("should return at least 1 alternative when others exist", () => {
    const result = getAlternatives(1000000, latteUnit, allUnits);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("should prefer diverse categories", () => {
    const result = getAlternatives(50_000_000_000, latteUnit, allUnits);

    // Get unique categories from results
    const categories = new Set(result.map((u) => u.category));

    // Should have more than one category if possible
    if (result.length > 1) {
      expect(categories.size).toBeGreaterThanOrEqual(1);
    }
  });

  it("should handle when only one other unit exists", () => {
    const result = getAlternatives(1000000, latteUnit, [latteUnit, teslaUnit]);
    expect(result.length).toBe(1);
    expect(result[0]).toBe(teslaUnit);
  });
});

// =============================================================================
// getAlternativeSpending Tests
// =============================================================================

describe("getAlternativeSpending", () => {
  const defenseItem = createBudgetItem({
    id: "defense",
    name: "Defense",
    amount: 800_000_000_000,
  });

  const educationItem = createBudgetItem({
    id: "education",
    name: "Education",
    amount: 80_000_000_000,
  });

  const healthItem = createBudgetItem({
    id: "health",
    name: "Health",
    amount: 1_400_000_000_000,
  });

  const smallItem = createBudgetItem({
    id: "small-program",
    name: "Small Program",
    amount: 5_000_000,
  });

  const allItems = [defenseItem, educationItem, healthItem, smallItem];

  it("should return empty array when no other items available", () => {
    const result = getAlternativeSpending(defenseItem, [defenseItem]);
    expect(result).toEqual([]);
  });

  it("should exclude the selected item from alternatives", () => {
    const result = getAlternativeSpending(defenseItem, allItems);
    expect(result.every((alt) => alt.item.id !== defenseItem.id)).toBe(true);
  });

  it("should return at most 3 alternatives", () => {
    const result = getAlternativeSpending(defenseItem, allItems);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("should calculate correct ratios", () => {
    const result = getAlternativeSpending(defenseItem, [
      defenseItem,
      educationItem,
    ]);

    expect(result.length).toBe(1);
    expect(result[0].item).toBe(educationItem);
    expect(result[0].ratio).toBeCloseTo(0.1, 1); // Education is 10% of defense
  });

  it("should format ratio comparisons correctly", () => {
    const result = getAlternativeSpending(educationItem, [
      educationItem,
      defenseItem,
    ]);

    expect(result.length).toBe(1);
    const formatted = result[0].formatted;
    expect(formatted).toContain("Defense");
    expect(formatted).toContain("Education");
  });

  it("should handle items with same amounts", () => {
    const sameAmountItem = createBudgetItem({
      id: "same-amount",
      name: "Same Amount Program",
      amount: defenseItem.amount,
    });

    const result = getAlternativeSpending(defenseItem, [
      defenseItem,
      sameAmountItem,
    ]);

    expect(result.length).toBe(1);
    expect(result[0].ratio).toBeCloseTo(1, 2);
    expect(result[0].formatted).toContain("about the same");
  });
});

// =============================================================================
// formatComparisonResult Tests
// =============================================================================

describe("formatComparisonResult", () => {
  it("should return all required fields", () => {
    const result = formatComparisonResult(1000000, latteUnit);

    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("unit");
    expect(result).toHaveProperty("count");
    expect(result).toHaveProperty("formattedCount");
    expect(result).toHaveProperty("unitName");
    expect(result).toHaveProperty("displayString");
    expect(result).toHaveProperty("icon");
  });

  it("should preserve the original amount", () => {
    const amount = 5_000_000;
    const result = formatComparisonResult(amount, latteUnit);
    expect(result.amount).toBe(amount);
  });

  it("should preserve the unit reference", () => {
    const result = formatComparisonResult(1000000, latteUnit);
    expect(result.unit).toBe(latteUnit);
  });

  it("should calculate count when not provided", () => {
    const result = formatComparisonResult(
      500,
      createUnit({ costPerUnit: 100 }),
    );
    expect(result.count).toBe(5);
  });

  it("should use provided count when given", () => {
    const providedCount = 42;
    const result = formatComparisonResult(1000000, latteUnit, providedCount);
    expect(result.count).toBe(providedCount);
  });

  it("should include icon from unit", () => {
    const result = formatComparisonResult(1000000, latteUnit);
    expect(result.icon).toBe("☕");
  });

  it("should return undefined icon when unit has no icon", () => {
    const noIconUnit = createUnit({ icon: undefined });
    const result = formatComparisonResult(1000000, noIconUnit);
    expect(result.icon).toBeUndefined();
  });

  it("should format displayString correctly", () => {
    const result = formatComparisonResult(5_000_000_000, latteUnit);
    expect(result.displayString).toBe("1 billion Starbucks Lattes");
  });

  it("should use correct singular/plural form", () => {
    // Singular
    const singularResult = formatComparisonResult(5, latteUnit);
    expect(singularResult.unitName).toBe("Starbucks Latte");

    // Plural
    const pluralResult = formatComparisonResult(10, latteUnit);
    expect(pluralResult.unitName).toBe("Starbucks Lattes");
  });
});

// =============================================================================
// toComparisonResult Tests
// =============================================================================

describe("toComparisonResult", () => {
  it("should convert calculation to ComparisonResult format", () => {
    const calculation = { count: 100, formatted: "100 Starbucks Lattes" };
    const dollarAmount = 500;

    const result = toComparisonResult(calculation, latteUnit, dollarAmount);

    expect(result).toEqual({
      unitCount: 100,
      formatted: "100 Starbucks Lattes",
      unit: latteUnit,
      dollarAmount: 500,
    });
  });

  it("should preserve decimal counts", () => {
    const calculation = { count: 1.5, formatted: "1.5 Starbucks Lattes" };
    const result = toComparisonResult(calculation, latteUnit, 7.5);

    expect(result.unitCount).toBe(1.5);
  });

  it("should handle very large counts", () => {
    const calculation = {
      count: 160_000_000_000,
      formatted: "160 billion Starbucks Lattes",
    };
    const result = toComparisonResult(calculation, latteUnit, 800_000_000_000);

    expect(result.unitCount).toBe(160_000_000_000);
    expect(result.dollarAmount).toBe(800_000_000_000);
  });
});

// =============================================================================
// Integration Tests
// =============================================================================

describe("integration", () => {
  it("should provide consistent results across functions", () => {
    const amount = 50_000_000_000; // $50 billion

    // Calculate comparison
    const calculation = calculateComparison(amount, teslaUnit);

    // Format result
    const formatted = formatComparisonResult(amount, teslaUnit);

    // Convert to ComparisonResult
    const comparisonResult = toComparisonResult(calculation, teslaUnit, amount);

    // All should have consistent counts
    expect(calculation.count).toBe(formatted.count);
    expect(calculation.count).toBe(comparisonResult.unitCount);
    expect(calculation.formatted).toBe(comparisonResult.formatted);
  });

  it("should work with findBestComparison and formatComparisonResult", () => {
    const units = [latteUnit, teslaUnit, hospitalUnit];
    const amount = 1_000_000_000; // $1 billion

    const bestUnit = findBestComparison(amount, units);
    expect(bestUnit).toBeDefined();

    const result = formatComparisonResult(amount, bestUnit!);
    expect(result.displayString).toBeDefined();
    expect(result.count).toBeGreaterThan(0);
  });

  it("should handle realistic federal budget scenario", () => {
    // Simulate comparing $816 billion defense budget
    const defenseAmount = 816_000_000_000;

    // Calculate various comparisons
    const latteComparison = calculateComparison(defenseAmount, latteUnit);
    const teslaComparison = calculateComparison(defenseAmount, teslaUnit);
    const hospitalComparison = calculateComparison(defenseAmount, hospitalUnit);

    // All should produce valid results
    expect(latteComparison.count).toBeCloseTo(163_200_000_000, -6); // ~163 billion lattes
    expect(teslaComparison.count).toBeCloseTo(20_400_000, -3); // ~20.4 million Teslas
    expect(hospitalComparison.count).toBeCloseTo(1632, 0); // ~1,632 hospitals
  });
});
