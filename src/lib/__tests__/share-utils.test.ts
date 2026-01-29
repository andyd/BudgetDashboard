/**
 * Tests for share-utils
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  encodeComparison,
  parseComparisonId,
  generateComparisonUrl,
  generateBudgetUrl,
  getShareText,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getLinkedInShareUrl,
  getAllShareUrls,
} from '../share-utils';
import type { ComparisonResult } from '@/types/comparison';

describe('share-utils', () => {
  describe('encodeComparison', () => {
    it('should encode budget item and unit IDs', () => {
      const result = encodeComparison('defense-2025', 'starbucks-latte');
      expect(result).toBe('defense-2025:starbucks-latte');
    });

    it('should handle special characters', () => {
      const result = encodeComparison('item with spaces', 'unit/with/slashes');
      expect(result).toContain(':');
      expect(result).not.toContain(' ');
      expect(result).not.toContain('/');
    });
  });

  describe('parseComparisonId', () => {
    it('should parse valid comparison ID', () => {
      const result = parseComparisonId('defense-2025:starbucks-latte');
      expect(result).toEqual({
        budgetItemId: 'defense-2025',
        unitId: 'starbucks-latte',
      });
    });

    it('should handle encoded special characters', () => {
      const encoded = encodeComparison('item with spaces', 'unit/with/slashes');
      const result = parseComparisonId(encoded);
      expect(result).toEqual({
        budgetItemId: 'item with spaces',
        unitId: 'unit/with/slashes',
      });
    });

    it('should return null for invalid format', () => {
      expect(parseComparisonId('invalid')).toBeNull();
      expect(parseComparisonId('too:many:colons')).toBeNull();
      expect(parseComparisonId('')).toBeNull();
    });
  });

  describe('generateComparisonUrl', () => {
    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    });

    it('should generate comparison URL', () => {
      const url = generateComparisonUrl('defense-2025:starbucks-latte');
      expect(url).toBe('https://example.com/compare/defense-2025:starbucks-latte');
    });
  });

  describe('generateBudgetUrl', () => {
    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    });

    it('should generate budget drill-down URL', () => {
      const url = generateBudgetUrl(['defense', 'military', 'navy']);
      expect(url).toBe('https://example.com/budget/defense/military/navy');
    });

    it('should handle single path segment', () => {
      const url = generateBudgetUrl(['defense']);
      expect(url).toBe('https://example.com/budget/defense');
    });

    it('should encode path segments with special characters', () => {
      const url = generateBudgetUrl(['item with spaces']);
      expect(url).not.toContain(' ');
      expect(url).toContain('item%20with%20spaces');
    });
  });

  describe('getShareText', () => {
    it('should generate share text with emoji', () => {
      const comparison: ComparisonResult = {
        unitCount: 160000000000,
        formatted: 'The Defense Budget equals 160 billion lattes',
        unit: {
          id: 'starbucks-latte',
          name: 'Starbucks Lattes',
          nameSingular: 'Starbucks Latte',
          costPerUnit: 5,
          category: 'everyday',
        },
        dollarAmount: 800000000000,
      };

      const text = getShareText(comparison);
      expect(text).toContain('The Defense Budget equals 160 billion lattes');
      expect(text).toMatch(/[🤯💡]/);
    });

    it('should use appropriate emoji for large numbers', () => {
      const comparison: ComparisonResult = {
        unitCount: 10000000,
        formatted: 'Test comparison',
        unit: {
          id: 'test-unit',
          name: 'Test Units',
          nameSingular: 'Test Unit',
          costPerUnit: 1,
          category: 'misc',
        },
        dollarAmount: 1000,
      };

      const text = getShareText(comparison);
      expect(text).toContain('🤯');
    });

    it('should use appropriate emoji for smaller numbers', () => {
      const comparison: ComparisonResult = {
        unitCount: 100,
        formatted: 'Test comparison',
        unit: {
          id: 'test-unit',
          name: 'Test Units',
          nameSingular: 'Test Unit',
          costPerUnit: 1,
          category: 'misc',
        },
        dollarAmount: 1000,
      };

      const text = getShareText(comparison);
      expect(text).toContain('💡');
    });
  });

  describe('getTwitterShareUrl', () => {
    it('should generate Twitter share URL', () => {
      const url = getTwitterShareUrl('https://example.com/compare/abc', 'Check this out!');
      expect(url).toContain('https://twitter.com/intent/tweet');
      expect(url).toContain('url=');
      expect(url).toContain('text=');
    });
  });

  describe('getFacebookShareUrl', () => {
    it('should generate Facebook share URL', () => {
      const url = getFacebookShareUrl('https://example.com/compare/abc');
      expect(url).toContain('https://www.facebook.com/sharer/sharer.php');
      expect(url).toContain('u=');
    });
  });

  describe('getLinkedInShareUrl', () => {
    it('should generate LinkedIn share URL', () => {
      const url = getLinkedInShareUrl('https://example.com/compare/abc');
      expect(url).toContain('https://www.linkedin.com/sharing/share-offsite/');
      expect(url).toContain('url=');
    });

    it('should include title when provided', () => {
      const url = getLinkedInShareUrl('https://example.com/compare/abc', 'Budget Comparison');
      expect(url).toContain('title=');
    });
  });

  describe('getAllShareUrls', () => {
    beforeEach(() => {
      vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');
    });

    it('should return all share URLs', () => {
      const comparison: ComparisonResult = {
        unitCount: 160000000000,
        formatted: 'The Defense Budget equals 160 billion lattes',
        unit: {
          id: 'starbucks-latte',
          name: 'Starbucks Lattes',
          nameSingular: 'Starbucks Latte',
          costPerUnit: 5,
          category: 'everyday',
        },
        dollarAmount: 800000000000,
      };

      const result = getAllShareUrls('defense-2025:starbucks-latte', comparison);

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('twitter');
      expect(result).toHaveProperty('facebook');
      expect(result).toHaveProperty('linkedin');

      expect(result.url).toBe('https://example.com/compare/defense-2025:starbucks-latte');
      expect(result.text).toContain('The Defense Budget equals 160 billion lattes');
      expect(result.twitter).toContain('twitter.com');
      expect(result.facebook).toContain('facebook.com');
      expect(result.linkedin).toContain('linkedin.com');
    });
  });
});
