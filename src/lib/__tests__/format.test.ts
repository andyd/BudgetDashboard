/**
 * Tests for format utilities
 */

import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatCompact,
  formatDate,
  formatOrdinal,
  formatBytes,
  truncate,
  pluralize,
} from "@/lib/format";

describe("format utilities", () => {
  describe("formatCurrency", () => {
    describe("basic formatting", () => {
      it("should format small amounts with cents by default", () => {
        expect(formatCurrency(99.99)).toBe("$99.99");
        expect(formatCurrency(0.5)).toBe("$0.50");
        expect(formatCurrency(999)).toBe("$999.00");
      });

      it("should format large amounts without cents by default", () => {
        expect(formatCurrency(1000)).toBe("$1,000");
        expect(formatCurrency(1234567)).toBe("$1,234,567");
        expect(formatCurrency(1000000000)).toBe("$1,000,000,000");
      });

      it("should handle zero", () => {
        expect(formatCurrency(0)).toBe("$0.00");
      });
    });

    describe("showCents option", () => {
      it("should show cents when explicitly enabled", () => {
        expect(formatCurrency(1000, { showCents: true })).toBe("$1,000.00");
        expect(formatCurrency(1234567.89, { showCents: true })).toBe(
          "$1,234,567.89",
        );
      });

      it("should hide cents when explicitly disabled", () => {
        expect(formatCurrency(99.99, { showCents: false })).toBe("$100");
        expect(formatCurrency(0.5, { showCents: false })).toBe("$1");
      });
    });

    describe("compact option", () => {
      it("should format in compact notation", () => {
        expect(formatCurrency(1234567890, { compact: true })).toBe("$1.23B");
        expect(formatCurrency(456789000, { compact: true })).toBe("$456.79M");
        expect(formatCurrency(12345, { compact: true })).toBe("$12.35K");
        expect(formatCurrency(999, { compact: true })).toBe("$999");
      });

      it("should handle negative numbers in compact mode", () => {
        expect(formatCurrency(-1234567890, { compact: true })).toBe("$-1.23B");
      });
    });

    describe("symbol option", () => {
      it("should use custom currency symbol", () => {
        expect(formatCurrency(100, { symbol: "\u20AC" })).toBe("\u20AC100.00");
        expect(formatCurrency(1000, { symbol: "\u00A3" })).toBe("\u00A31,000");
        expect(formatCurrency(50, { symbol: "" })).toBe("50.00");
      });
    });

    describe("showSign option", () => {
      it("should show + sign for positive numbers", () => {
        expect(formatCurrency(50, { showSign: true })).toBe("+$50.00");
        expect(formatCurrency(1000, { showSign: true })).toBe("+$1,000");
      });

      it("should not show + sign for zero", () => {
        expect(formatCurrency(0, { showSign: true })).toBe("$0.00");
      });

      it("should show - sign for negative numbers regardless of showSign", () => {
        expect(formatCurrency(-50)).toBe("-$50.00");
        expect(formatCurrency(-50, { showSign: true })).toBe("-$50.00");
      });
    });

    describe("negative numbers", () => {
      it("should format negative amounts correctly", () => {
        expect(formatCurrency(-99.99)).toBe("-$99.99");
        expect(formatCurrency(-1234567)).toBe("-$1,234,567");
      });
    });

    describe("combined options", () => {
      it("should combine showSign and compact", () => {
        expect(formatCurrency(1000000, { showSign: true, compact: true })).toBe(
          "+$1M",
        );
      });

      it("should combine symbol and showCents", () => {
        expect(
          formatCurrency(1500.5, { symbol: "\u20AC", showCents: true }),
        ).toBe("\u20AC1,500.50");
      });
    });
  });

  describe("formatNumber", () => {
    it("should format integers with thousands separators", () => {
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(999)).toBe("999");
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1234567)).toBe("1,234,567");
      expect(formatNumber(1000000000)).toBe("1,000,000,000");
    });

    it("should format decimals with up to 2 decimal places", () => {
      expect(formatNumber(99.99)).toBe("99.99");
      expect(formatNumber(99.9)).toBe("99.9");
      expect(formatNumber(99.999)).toBe("100");
      expect(formatNumber(0.12)).toBe("0.12");
      expect(formatNumber(0.1)).toBe("0.1");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-1234)).toBe("-1,234");
      expect(formatNumber(-99.99)).toBe("-99.99");
    });

    it("should handle very small decimals", () => {
      expect(formatNumber(0.001)).toBe("0");
      expect(formatNumber(0.01)).toBe("0.01");
    });
  });

  describe("formatPercent", () => {
    it("should format decimals as percentages", () => {
      expect(formatPercent(0.1234)).toBe("12.34%");
      expect(formatPercent(0.5)).toBe("50.00%");
      expect(formatPercent(1)).toBe("100.00%");
    });

    it("should handle custom decimal places", () => {
      expect(formatPercent(0.1234, 0)).toBe("12%");
      expect(formatPercent(0.1234, 1)).toBe("12.3%");
      expect(formatPercent(0.1234, 3)).toBe("12.340%");
    });

    it("should handle percentages greater than 100%", () => {
      expect(formatPercent(1.5)).toBe("150.00%");
      expect(formatPercent(2.5, 0)).toBe("250%");
    });

    it("should handle zero", () => {
      expect(formatPercent(0)).toBe("0.00%");
      expect(formatPercent(0, 0)).toBe("0%");
    });

    it("should handle negative percentages", () => {
      expect(formatPercent(-0.25)).toBe("-25.00%");
      expect(formatPercent(-0.1, 0)).toBe("-10%");
    });

    it("should handle very small percentages", () => {
      expect(formatPercent(0.001)).toBe("0.10%");
      expect(formatPercent(0.0001)).toBe("0.01%");
    });
  });

  describe("formatCompact", () => {
    describe("billions", () => {
      it("should format billions correctly", () => {
        expect(formatCompact(1000000000)).toBe("1B");
        expect(formatCompact(1234567890)).toBe("1.23B");
        expect(formatCompact(1500000000)).toBe("1.50B");
        expect(formatCompact(999999999999)).toBe("1000B");
      });
    });

    describe("millions", () => {
      it("should format millions correctly", () => {
        expect(formatCompact(1000000)).toBe("1M");
        expect(formatCompact(1234567)).toBe("1.23M");
        expect(formatCompact(456789000)).toBe("456.79M");
        expect(formatCompact(999999999)).toBe("1000M");
      });
    });

    describe("thousands", () => {
      it("should format thousands correctly", () => {
        expect(formatCompact(1000)).toBe("1K");
        expect(formatCompact(1234)).toBe("1.23K");
        expect(formatCompact(12345)).toBe("12.35K");
        expect(formatCompact(999999)).toBe("1000K");
      });
    });

    describe("small numbers", () => {
      it("should not abbreviate numbers less than 1000", () => {
        expect(formatCompact(0)).toBe("0");
        expect(formatCompact(1)).toBe("1");
        expect(formatCompact(999)).toBe("999");
        expect(formatCompact(500)).toBe("500");
      });
    });

    describe("negative numbers", () => {
      it("should handle negative numbers", () => {
        expect(formatCompact(-1000000000)).toBe("-1B");
        expect(formatCompact(-1234567)).toBe("-1.23M");
        expect(formatCompact(-12345)).toBe("-12.35K");
        expect(formatCompact(-500)).toBe("-500");
      });
    });

    describe("trailing zeros", () => {
      it("should remove trailing .00", () => {
        expect(formatCompact(1000000000)).toBe("1B");
        expect(formatCompact(2000000)).toBe("2M");
        expect(formatCompact(5000)).toBe("5K");
      });
    });
  });

  describe("formatDate", () => {
    it("should format Date objects", () => {
      // Use explicit time to avoid timezone issues
      const date = new Date("2024-01-15T12:00:00");
      expect(formatDate(date)).toBe("Jan 15, 2024");
    });

    it("should format date strings", () => {
      // Use explicit time to avoid timezone issues
      expect(formatDate("2024-01-15T12:00:00")).toBe("Jan 15, 2024");
      expect(formatDate("2024-12-25T12:00:00")).toBe("Dec 25, 2024");
    });

    it("should handle different months", () => {
      expect(formatDate("2024-06-01T12:00:00")).toBe("Jun 1, 2024");
      expect(formatDate("2024-11-30T12:00:00")).toBe("Nov 30, 2024");
    });
  });

  describe("formatOrdinal", () => {
    it("should format 1st, 2nd, 3rd correctly", () => {
      expect(formatOrdinal(1)).toBe("1st");
      expect(formatOrdinal(2)).toBe("2nd");
      expect(formatOrdinal(3)).toBe("3rd");
    });

    it("should format 4th-20th with th", () => {
      expect(formatOrdinal(4)).toBe("4th");
      expect(formatOrdinal(10)).toBe("10th");
      expect(formatOrdinal(11)).toBe("11th");
      expect(formatOrdinal(12)).toBe("12th");
      expect(formatOrdinal(13)).toBe("13th");
      expect(formatOrdinal(20)).toBe("20th");
    });

    it("should format 21st, 22nd, 23rd correctly", () => {
      expect(formatOrdinal(21)).toBe("21st");
      expect(formatOrdinal(22)).toBe("22nd");
      expect(formatOrdinal(23)).toBe("23rd");
    });

    it("should format larger ordinals correctly", () => {
      expect(formatOrdinal(100)).toBe("100th");
      expect(formatOrdinal(101)).toBe("101st");
      expect(formatOrdinal(111)).toBe("111th");
      expect(formatOrdinal(112)).toBe("112th");
      expect(formatOrdinal(113)).toBe("113th");
    });
  });

  describe("formatBytes", () => {
    it("should format bytes", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
      expect(formatBytes(500)).toBe("500 Bytes");
    });

    it("should format kilobytes", () => {
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1536)).toBe("1.5 KB");
    });

    it("should format megabytes", () => {
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1234567)).toBe("1.18 MB");
    });

    it("should format gigabytes", () => {
      expect(formatBytes(1073741824)).toBe("1 GB");
      expect(formatBytes(1610612736)).toBe("1.5 GB");
    });

    it("should respect custom decimal places", () => {
      expect(formatBytes(1234567, 0)).toBe("1 MB");
      expect(formatBytes(1234567, 1)).toBe("1.2 MB");
      expect(formatBytes(1234567, 3)).toBe("1.177 MB");
    });
  });

  describe("truncate", () => {
    it("should not truncate short text", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
      expect(truncate("Hello", 5)).toBe("Hello");
    });

    it("should truncate long text with ellipsis", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
      expect(truncate("This is a long sentence", 10)).toBe("This is...");
    });

    it("should handle edge cases", () => {
      expect(truncate("", 5)).toBe("");
      expect(truncate("Hi", 3)).toBe("Hi");
      expect(truncate("Hello", 3)).toBe("...");
    });
  });

  describe("pluralize", () => {
    it("should return singular for count of 1", () => {
      expect(pluralize(1, "item")).toBe("item");
      expect(pluralize(1, "category", "categories")).toBe("category");
    });

    it("should return plural for counts other than 1", () => {
      expect(pluralize(0, "item")).toBe("items");
      expect(pluralize(2, "item")).toBe("items");
      expect(pluralize(5, "item")).toBe("items");
      expect(pluralize(100, "item")).toBe("items");
    });

    it("should use custom plural when provided", () => {
      expect(pluralize(2, "category", "categories")).toBe("categories");
      expect(pluralize(0, "match", "matches")).toBe("matches");
      expect(pluralize(5, "person", "people")).toBe("people");
    });

    it("should handle negative counts", () => {
      expect(pluralize(-1, "item")).toBe("items");
      expect(pluralize(-5, "item")).toBe("items");
    });
  });

  describe("edge cases", () => {
    it("should handle Infinity", () => {
      expect(formatNumber(Infinity)).toBe("\u221E");
      expect(formatCurrency(Infinity)).toBe("$\u221E");
    });

    it("should handle very large numbers", () => {
      expect(formatCompact(1e15)).toBe("1000000B");
      expect(formatNumber(1e12)).toBe("1,000,000,000,000");
    });

    it("should handle NaN gracefully", () => {
      expect(formatNumber(NaN)).toBe("NaN");
      expect(formatCurrency(NaN)).toBe("$NaN");
    });
  });
});
