/**
 * Unit tests for unit-converter library
 * Tests dollar-to-unit conversions, formatting, and comparison logic
 */

import { describe, it, expect } from "vitest";
import {
  convertBudgetToUnits,
  createFormula,
  createComparison,
  formatCurrency,
  formatNumber,
  getUnitById,
  getUnitsByCategory,
  generateComparisonSummary,
  COMPARISON_UNITS,
} from "../lib/unit-converter";
import type { Unit, BudgetItem, Comparison } from "@/types";

describe("convertBudgetToUnits", () => {
  const teacherSalary: Unit = {
    id: "teacher-salary",
    name: "Teacher Salary",
    pluralName: "Teacher Salaries",
    cost: 65_000,
    period: "year",
    category: "salary",
    source: "BLS",
  };

  const insulinCost: Unit = {
    id: "insulin",
    name: "Monthly Insulin",
    pluralName: "Monthly Insulin Supplies",
    cost: 300,
    period: "month",
    category: "healthcare",
    source: "HHS",
  };

  const schoolLunch: Unit = {
    id: "lunch",
    name: "School Lunch",
    pluralName: "School Lunches",
    cost: 3.5,
    period: "unit",
    category: "education",
    source: "USDA",
  };

  describe("basic conversions", () => {
    it("converts dollars to yearly units correctly", () => {
      const result = convertBudgetToUnits(650_000, teacherSalary);
      expect(result).toBe(10);
    });

    it("converts dollars to monthly units (normalized to year)", () => {
      // $3,600 per year of insulin (12 months * $300)
      const result = convertBudgetToUnits(36_000, insulinCost);
      expect(result).toBe(10); // 36000 / 3600 = 10
    });

    it("converts dollars to per-unit items correctly", () => {
      const result = convertBudgetToUnits(350, schoolLunch);
      expect(result).toBe(100);
    });

    it("handles fractional results by flooring", () => {
      const result = convertBudgetToUnits(100_000, teacherSalary);
      expect(result).toBe(1); // 100000 / 65000 = 1.538, floored to 1
    });

    it("handles very large amounts", () => {
      const result = convertBudgetToUnits(12_400_000_000, teacherSalary);
      expect(result).toBe(190_769); // 12.4B / 65K
    });

    it("handles zero dollar amount", () => {
      const result = convertBudgetToUnits(0, teacherSalary);
      expect(result).toBe(0);
    });

    it("handles small dollar amounts that result in less than 1 unit", () => {
      const result = convertBudgetToUnits(1000, teacherSalary);
      expect(result).toBe(0); // Floored
    });
  });

  describe("real-world scenarios", () => {
    it("calculates F-35 program to health insurance comparison", () => {
      const healthInsurance: Unit = {
        id: "health-individual",
        name: "Individual Health Insurance Premium",
        pluralName: "Individual Health Insurance Premiums",
        cost: 8_500,
        period: "year",
        category: "healthcare",
        source: "KFF",
      };

      const result = convertBudgetToUnits(12_400_000_000, healthInsurance);
      expect(result).toBe(1_458_823); // 12.4B / 8.5K
    });

    it("calculates ICE budget to teacher salaries", () => {
      const iceBudget = 3_100_000_000;
      const result = convertBudgetToUnits(iceBudget, teacherSalary);
      expect(result).toBe(47_692); // 3.1B / 65K
    });

    it("calculates defense budget to multiple unit types", () => {
      const defenseAnnual = 877_000_000_000;

      const teachers = convertBudgetToUnits(defenseAnnual, teacherSalary);
      expect(teachers).toBe(13_492_307); // 877B / 65K

      const healthInsurance: Unit = {
        id: "health-family",
        name: "Family Health Insurance Premium",
        pluralName: "Family Health Insurance Premiums",
        cost: 22_000,
        period: "year",
        category: "healthcare",
        source: "KFF",
      };
      const families = convertBudgetToUnits(defenseAnnual, healthInsurance);
      expect(families).toBe(39_863_636); // 877B / 22K
    });
  });

  describe("edge cases", () => {
    it("handles day-based units normalized to year", () => {
      const dailyUnit: Unit = {
        id: "daily-cost",
        name: "Daily Cost",
        pluralName: "Daily Costs",
        cost: 10,
        period: "day",
        category: "general",
        source: "Test",
      };

      // 10 * 365 = 3650 per year
      const result = convertBudgetToUnits(36_500, dailyUnit);
      expect(result).toBe(10);
    });

    it("returns whole numbers only", () => {
      const result = convertBudgetToUnits(65_001, teacherSalary);
      expect(result).toBe(1);
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});

describe("formatCurrency", () => {
  describe("billions", () => {
    it("formats billions correctly", () => {
      expect(formatCurrency(12_400_000_000)).toBe("$12.4B");
      expect(formatCurrency(1_000_000_000)).toBe("$1.0B");
      expect(formatCurrency(877_000_000_000)).toBe("$877.0B");
    });

    it("rounds to one decimal place", () => {
      expect(formatCurrency(12_345_678_901)).toBe("$12.3B");
      expect(formatCurrency(12_567_890_123)).toBe("$12.6B");
    });
  });

  describe("millions", () => {
    it("formats millions correctly", () => {
      expect(formatCurrency(1_500_000)).toBe("$1.5M");
      expect(formatCurrency(65_000_000)).toBe("$65.0M");
      expect(formatCurrency(999_999_999)).toBe("$1000.0M");
    });
  });

  describe("thousands", () => {
    it("formats thousands correctly", () => {
      expect(formatCurrency(65_000)).toBe("$65.0K");
      expect(formatCurrency(1_000)).toBe("$1.0K");
      expect(formatCurrency(8_500)).toBe("$8.5K");
      expect(formatCurrency(22_000)).toBe("$22.0K");
    });
  });

  describe("small amounts", () => {
    it("formats amounts under $1000 without abbreviation", () => {
      expect(formatCurrency(999)).toBe("$999");
      expect(formatCurrency(500)).toBe("$500");
      expect(formatCurrency(100)).toBe("$100");
      expect(formatCurrency(3.5)).toBe("$4"); // Rounds to integer
    });
  });

  describe("edge cases", () => {
    it("handles zero", () => {
      expect(formatCurrency(0)).toBe("$0");
    });

    it("handles very large numbers", () => {
      expect(formatCurrency(6_800_000_000_000)).toBe("$6800.0B");
      expect(formatCurrency(999_999_999_999)).toBe("$1000.0B");
    });

    it("handles negative amounts as if they were positive", () => {
      // Note: Current implementation doesn't handle negative amounts specially
      expect(formatCurrency(-1_000_000_000)).toBe("$-1000000000");
      expect(formatCurrency(-500)).toBe("$-500");
    });
  });
});

describe("formatNumber", () => {
  it("formats numbers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(10000)).toBe("10,000");
    expect(formatNumber(100000)).toBe("100,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("formats large numbers correctly", () => {
    expect(formatNumber(1_458_823)).toBe("1,458,823");
    expect(formatNumber(47_692)).toBe("47,692");
    expect(formatNumber(190_769)).toBe("190,769");
  });

  it("handles numbers without thousands", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(100)).toBe("100");
    expect(formatNumber(10)).toBe("10");
    expect(formatNumber(1)).toBe("1");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1000)).toBe("-1,000");
    expect(formatNumber(-100000)).toBe("-100,000");
  });

  it("handles decimal numbers", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
    expect(formatNumber(10000.5)).toBe("10,000.5");
  });
});

describe("createFormula", () => {
  const teacherSalary: Unit = {
    id: "teacher-salary",
    name: "Teacher Salary",
    pluralName: "Teacher Salaries",
    cost: 65_000,
    period: "year",
    category: "salary",
    source: "BLS",
  };

  const schoolLunch: Unit = {
    id: "lunch",
    name: "School Lunch",
    pluralName: "School Lunches",
    cost: 3.5,
    period: "unit",
    category: "education",
    source: "USDA",
  };

  it("creates formula with year period", () => {
    const formula = createFormula(650_000, teacherSalary, 10);
    expect(formula).toBe("$650.0K ÷ $65.0K/year = 10 Teacher Salaries");
  });

  it("creates formula with unit period (no period text)", () => {
    const formula = createFormula(350, schoolLunch, 100);
    expect(formula).toBe("$350 ÷ $4 = 100 School Lunches");
  });

  it("uses singular unit name when result is 1", () => {
    const formula = createFormula(65_000, teacherSalary, 1);
    expect(formula).toBe("$65.0K ÷ $65.0K/year = 1 Teacher Salary");
  });

  it("uses plural unit name when result is not 1", () => {
    const formula = createFormula(130_000, teacherSalary, 2);
    expect(formula).toBe("$130.0K ÷ $65.0K/year = 2 Teacher Salaries");
  });

  it("handles large numbers with proper formatting", () => {
    const formula = createFormula(12_400_000_000, teacherSalary, 190_769);
    expect(formula).toBe("$12.4B ÷ $65.0K/year = 190,769 Teacher Salaries");
  });

  it("handles monthly period", () => {
    const insulin: Unit = {
      id: "insulin",
      name: "Monthly Insulin Cost",
      pluralName: "Monthly Insulin Supplies",
      cost: 300,
      period: "month",
      category: "healthcare",
      source: "HHS",
    };

    const formula = createFormula(3_600, insulin, 12);
    expect(formula).toBe("$3.6K ÷ $300/month = 12 Monthly Insulin Supplies");
  });
});

describe("createComparison", () => {
  const budgetItem: BudgetItem = {
    id: "ice-detention",
    name: "ICE Detention",
    amount: 3_100_000_000,
    parentId: null,
    fiscalYear: 2025,
    percentOfParent: null,
    yearOverYearChange: null,
  };

  const teacherSalary: Unit = {
    id: "teacher-salary",
    name: "Teacher Salary",
    pluralName: "Teacher Salaries",
    cost: 65_000,
    period: "year",
    category: "salary",
    source: "BLS",
  };

  it("creates a complete comparison object", () => {
    const comparison = createComparison(budgetItem, teacherSalary);

    expect(comparison.budgetItemId).toBe("ice-detention");
    expect(comparison.budgetItemName).toBe("ICE Detention");
    expect(comparison.budgetAmount).toBe(3_100_000_000);
    expect(comparison.unitId).toBe("teacher-salary");
    expect(comparison.unitName).toBe("Teacher Salary");
    expect(comparison.unitCost).toBe(65_000);
    expect(comparison.result).toBe(47_692);
    expect(comparison.formula).toContain("$3.1B");
    expect(comparison.formula).toContain("47,692");
    expect(comparison.isFeatured).toBe(false);
  });

  it("includes proper formula string", () => {
    const comparison = createComparison(budgetItem, teacherSalary);

    expect(comparison.formula).toBe(
      "$3.1B ÷ $65.0K/year = 47,692 Teacher Salaries",
    );
  });

  it("handles different unit types", () => {
    const healthInsurance: Unit = {
      id: "health-family",
      name: "Family Health Insurance Premium",
      pluralName: "Family Health Insurance Premiums",
      cost: 22_000,
      period: "year",
      category: "healthcare",
      source: "KFF",
    };

    const comparison = createComparison(budgetItem, healthInsurance);

    expect(comparison.result).toBe(140_909);
    expect(comparison.unitName).toBe("Family Health Insurance Premium");
  });

  it("omits id, createdAt, updatedAt fields", () => {
    const comparison = createComparison(budgetItem, teacherSalary);

    expect(comparison).not.toHaveProperty("id");
    expect(comparison).not.toHaveProperty("createdAt");
    expect(comparison).not.toHaveProperty("updatedAt");
  });
});

describe("getUnitById", () => {
  it("returns unit by id", () => {
    const unit = getUnitById("teacher-salary");
    expect(unit).toBeDefined();
    expect(unit?.name).toBe("Teacher Salary");
    expect(unit?.cost).toBe(65_000);
  });

  it("returns undefined for non-existent id", () => {
    const unit = getUnitById("non-existent-id");
    expect(unit).toBeUndefined();
  });

  it("finds all common units by id", () => {
    const ids = [
      "teacher-salary",
      "health-insurance-individual",
      "health-insurance-family",
      "insulin-monthly",
      "school-lunch",
      "section-8-voucher",
      "median-household-income",
    ];

    ids.forEach((id) => {
      const unit = getUnitById(id);
      expect(unit).toBeDefined();
      expect(unit?.id).toBe(id);
    });
  });
});

describe("getUnitsByCategory", () => {
  it("returns healthcare units", () => {
    const units = getUnitsByCategory("healthcare");
    expect(units.length).toBeGreaterThan(0);
    units.forEach((unit) => {
      expect(unit.category).toBe("healthcare");
    });
  });

  it("returns salary units", () => {
    const units = getUnitsByCategory("salary");
    expect(units.length).toBeGreaterThan(0);
    units.forEach((unit) => {
      expect(unit.category).toBe("salary");
    });
  });

  it("returns education units", () => {
    const units = getUnitsByCategory("education");
    expect(units.length).toBeGreaterThan(0);
    units.forEach((unit) => {
      expect(unit.category).toBe("education");
    });
  });

  it("returns empty array for non-existent category", () => {
    const units = getUnitsByCategory("non-existent");
    expect(units).toEqual([]);
  });

  it("returns housing units", () => {
    const units = getUnitsByCategory("housing");
    expect(units.length).toBeGreaterThan(0);
    units.forEach((unit) => {
      expect(unit.category).toBe("housing");
    });
  });
});

describe("generateComparisonSummary", () => {
  it("generates summary with plural unit name", () => {
    const comparison: Comparison = {
      id: "1",
      budgetItemId: "ice-detention",
      budgetItemName: "ICE Detention",
      budgetAmount: 3_100_000_000,
      unitId: "teacher-salary",
      unitName: "Teacher Salary",
      unitCost: 65_000,
      result: 47_692,
      formula: "$3.1B ÷ $65.0K/year = 47,692 Teacher Salaries",
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const summary = generateComparisonSummary(comparison);
    expect(summary).toBe(
      "ICE Detention ($3.1B) could fund 47,692 Teacher Salaries",
    );
  });

  it("generates summary with singular unit name when result is 1", () => {
    const comparison: Comparison = {
      id: "2",
      budgetItemId: "small-program",
      budgetItemName: "Small Program",
      budgetAmount: 65_000,
      unitId: "teacher-salary",
      unitName: "Teacher Salary",
      unitCost: 65_000,
      result: 1,
      formula: "$65.0K ÷ $65.0K/year = 1 Teacher Salary",
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const summary = generateComparisonSummary(comparison);
    expect(summary).toBe("Small Program ($65.0K) could fund 1 Teacher Salary");
  });

  it("handles large numbers with proper formatting", () => {
    const comparison: Comparison = {
      id: "3",
      budgetItemId: "f35-program",
      budgetItemName: "F-35 Program",
      budgetAmount: 12_400_000_000,
      unitId: "health-insurance-individual",
      unitName: "Individual Health Insurance Premium",
      unitCost: 8_500,
      result: 1_458_823,
      formula:
        "$12.4B ÷ $8.5K/year = 1,458,823 Individual Health Insurance Premiums",
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const summary = generateComparisonSummary(comparison);
    expect(summary).toContain("$12.4B");
    expect(summary).toContain("1,458,823");
  });

  it("uses pluralName from COMPARISON_UNITS when available", () => {
    const comparison: Comparison = {
      id: "4",
      budgetItemId: "education-budget",
      budgetItemName: "Education Budget",
      budgetAmount: 35_000,
      unitId: "school-lunch",
      unitName: "School Lunch",
      unitCost: 3.5,
      result: 10_000,
      formula: "$35.0K ÷ $4/unit = 10,000 School Lunches",
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const summary = generateComparisonSummary(comparison);
    expect(summary).toContain("School Lunches"); // Should use plural
  });
});

describe("COMPARISON_UNITS", () => {
  it("exports array of comparison units", () => {
    expect(Array.isArray(COMPARISON_UNITS)).toBe(true);
    expect(COMPARISON_UNITS.length).toBeGreaterThan(0);
  });

  it("all units have required fields", () => {
    COMPARISON_UNITS.forEach((unit) => {
      expect(unit.id).toBeDefined();
      expect(typeof unit.id).toBe("string");
      expect(unit.name).toBeDefined();
      expect(typeof unit.name).toBe("string");
      expect(unit.pluralName).toBeDefined();
      expect(typeof unit.pluralName).toBe("string");
      expect(unit.cost).toBeDefined();
      expect(typeof unit.cost).toBe("number");
      expect(unit.cost).toBeGreaterThan(0);
      expect(unit.period).toBeDefined();
      expect(["year", "month", "day", "unit"]).toContain(unit.period);
      expect(unit.category).toBeDefined();
      expect([
        "salary",
        "healthcare",
        "education",
        "housing",
        "general",
      ]).toContain(unit.category);
      expect(unit.source).toBeDefined();
      expect(typeof unit.source).toBe("string");
    });
  });

  it("has unique ids", () => {
    const ids = COMPARISON_UNITS.map((u) => u.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it("includes expected common units", () => {
    const expectedIds = [
      "teacher-salary",
      "health-insurance-individual",
      "health-insurance-family",
      "insulin-monthly",
      "school-lunch",
      "section-8-voucher",
      "median-household-income",
    ];

    expectedIds.forEach((id) => {
      const unit = COMPARISON_UNITS.find((u) => u.id === id);
      expect(unit).toBeDefined();
    });
  });

  it("has appropriate cost values", () => {
    const teacher = COMPARISON_UNITS.find((u) => u.id === "teacher-salary");
    expect(teacher?.cost).toBe(65_000);

    const healthIndividual = COMPARISON_UNITS.find(
      (u) => u.id === "health-insurance-individual",
    );
    expect(healthIndividual?.cost).toBe(8_500);

    const lunch = COMPARISON_UNITS.find((u) => u.id === "school-lunch");
    expect(lunch?.cost).toBe(3.5);
  });
});

describe("integration tests", () => {
  it("full workflow: budget item to shareable summary", () => {
    const budgetItem: BudgetItem = {
      id: "ice-detention",
      name: "ICE Detention",
      amount: 3_100_000_000,
      parentId: null,
      fiscalYear: 2025,
      percentOfParent: null,
      yearOverYearChange: null,
    };

    const unit = getUnitById("teacher-salary");
    expect(unit).toBeDefined();

    const comparison = createComparison(budgetItem, unit!);

    const fullComparison: Comparison = {
      ...comparison,
      id: "generated-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const summary = generateComparisonSummary(fullComparison);

    expect(summary).toContain("ICE Detention");
    expect(summary).toContain("$3.1B");
    expect(summary).toContain("47,692");
    expect(summary).toContain("Teacher Salaries");
  });

  it("compares defense budget across multiple unit types", () => {
    const defenseItem: BudgetItem = {
      id: "defense",
      name: "Defense Budget",
      amount: 877_000_000_000,
      parentId: null,
      fiscalYear: 2025,
      percentOfParent: null,
      yearOverYearChange: null,
    };

    const categories = ["salary", "healthcare", "education", "housing"];
    const results: Array<{ category: string; result: number }> = [];

    categories.forEach((category) => {
      const units = getUnitsByCategory(category);
      if (units.length > 0) {
        const comparison = createComparison(defenseItem, units[0]);
        results.push({ category, result: comparison.result });
      }
    });

    expect(results.length).toBeGreaterThan(0);
    results.forEach(({ result }) => {
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  it("handles zero budget gracefully", () => {
    const zeroItem: BudgetItem = {
      id: "zero-budget",
      name: "Zero Budget",
      amount: 0,
      parentId: null,
      fiscalYear: 2025,
      percentOfParent: null,
      yearOverYearChange: null,
    };

    const unit = getUnitById("teacher-salary");
    const comparison = createComparison(zeroItem, unit!);

    expect(comparison.result).toBe(0);
    expect(comparison.formula).toContain("0 Teacher Salaries");
  });
});
