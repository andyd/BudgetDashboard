/**
 * Tests for random-comparison utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getRandomComparison,
  getInterestingComparison,
  getMultipleInterestingComparisons,
  type RandomComparison,
} from "@/lib/random-comparison";

describe("random-comparison", () => {
  describe("getRandomComparison", () => {
    it("should return a valid result", () => {
      const result = getRandomComparison();

      expect(result).not.toBeNull();
    });

    it("should return result with expected structure", () => {
      const result = getRandomComparison();

      expect(result).toMatchObject({
        budgetItemId: expect.any(String),
        budgetAmount: expect.any(Number),
        unit: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          category: expect.any(String),
        }),
        unitCount: expect.any(Number),
        headline: expect.any(String),
        isFeatured: expect.any(Boolean),
      });
    });

    it("should return different results on multiple calls (randomness)", () => {
      // Run multiple times to increase chance of getting different results
      const results = new Set<string>();
      for (let i = 0; i < 20; i++) {
        const result = getRandomComparison();
        if (result) {
          results.add(result.budgetItemId);
        }
      }

      // With 5 featured comparisons and 20 calls, we should get more than 1 unique result
      // (probability of getting same one 20 times is (1/5)^19 = essentially 0)
      expect(results.size).toBeGreaterThan(1);
    });

    it("should have positive budget amount and unit count", () => {
      const result = getRandomComparison();

      expect(result).not.toBeNull();
      expect(result!.budgetAmount).toBeGreaterThan(0);
      expect(result!.unitCount).toBeGreaterThan(0);
    });
  });

  describe("getInterestingComparison", () => {
    it("should return a valid result", () => {
      const result = getInterestingComparison();

      expect(result).not.toBeNull();
    });

    it("should return high-impact result with large budget amount", () => {
      const result = getInterestingComparison();

      expect(result).not.toBeNull();
      // High-impact comparisons should have significant budget amounts (at least $100M)
      expect(result!.budgetAmount).toBeGreaterThanOrEqual(100_000_000);
    });

    it("should return result with expected structure", () => {
      const result = getInterestingComparison();

      expect(result).toMatchObject({
        budgetItemId: expect.any(String),
        budgetAmount: expect.any(Number),
        unit: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          category: expect.any(String),
        }),
        unitCount: expect.any(Number),
        headline: expect.any(String),
        isFeatured: expect.any(Boolean),
      });
    });

    it("should return high unit count for impactful display", () => {
      const result = getInterestingComparison();

      expect(result).not.toBeNull();
      // Interesting comparisons should have at least 10,000 units for visual impact
      expect(result!.unitCount).toBeGreaterThanOrEqual(10_000);
    });
  });

  describe("getMultipleInterestingComparisons", () => {
    it("should return the requested number of results", () => {
      const results = getMultipleInterestingComparisons(3);

      expect(results).toHaveLength(3);
    });

    it("should return unique results", () => {
      const results = getMultipleInterestingComparisons(3);
      const ids = results.map((r) => r.budgetItemId);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it("should return results with expected structure", () => {
      const results = getMultipleInterestingComparisons(2);

      results.forEach((result) => {
        expect(result).toMatchObject({
          budgetItemId: expect.any(String),
          budgetAmount: expect.any(Number),
          unit: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            category: expect.any(String),
          }),
          unitCount: expect.any(Number),
          headline: expect.any(String),
          isFeatured: expect.any(Boolean),
        });
      });
    });

    it("should return high-impact results", () => {
      const results = getMultipleInterestingComparisons(2);

      results.forEach((result) => {
        // All interesting comparisons should have significant budget amounts
        expect(result.budgetAmount).toBeGreaterThanOrEqual(100_000_000);
        expect(result.unitCount).toBeGreaterThanOrEqual(10_000);
      });
    });

    it("should handle requesting more than available comparisons", () => {
      // Request more than the 5 featured comparisons available
      const results = getMultipleInterestingComparisons(10);

      // Should return at most the number of available comparisons
      expect(results.length).toBeLessThanOrEqual(5);
      expect(results.length).toBeGreaterThan(0);
    });

    it("should return empty array when requesting zero", () => {
      const results = getMultipleInterestingComparisons(0);

      expect(results).toHaveLength(0);
    });

    it("should return empty array for negative count", () => {
      const results = getMultipleInterestingComparisons(-1);

      expect(results).toHaveLength(0);
    });
  });

  describe("result structure validation", () => {
    it("should have valid unit with required fields", () => {
      const result = getRandomComparison();

      expect(result).not.toBeNull();
      expect(result!.unit).toBeDefined();
      expect(typeof result!.unit.id).toBe("string");
      expect(typeof result!.unit.name).toBe("string");
      expect(typeof result!.unit.category).toBe("string");
    });

    it("should have non-empty headline", () => {
      const result = getRandomComparison();

      expect(result).not.toBeNull();
      expect(result!.headline).toBeDefined();
      expect(result!.headline.length).toBeGreaterThan(0);
    });

    it("should have valid budget item ID", () => {
      const result = getRandomComparison();

      expect(result).not.toBeNull();
      expect(result!.budgetItemId).toBeDefined();
      expect(result!.budgetItemId.length).toBeGreaterThan(0);
    });
  });
});
