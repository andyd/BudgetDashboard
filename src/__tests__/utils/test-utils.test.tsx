/**
 * Test Utils Tests
 *
 * Example tests demonstrating how to use the testing utilities.
 * These also serve as validation that the mock factories work correctly.
 */

import { describe, it, expect } from 'vitest';
import {
  mockBudgetItem,
  mockLineItem,
  mockProgram,
  mockAgency,
  mockDepartment,
  mockUnit,
  mockComparison,
  mockFeaturedComparison,
  mockComparisonResult,
  createMockBudgetHierarchy,
} from './test-utils';

describe('Budget Item Mock Factories', () => {
  it('mockBudgetItem should create valid budget item with defaults', () => {
    const item = mockBudgetItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('amount');
    expect(item.fiscalYear).toBe(2024);
    expect(item.parentId).toBeNull();
  });

  it('mockBudgetItem should accept overrides', () => {
    const item = mockBudgetItem({
      name: 'Custom Name',
      amount: 500_000,
      fiscalYear: 2025,
    });

    expect(item.name).toBe('Custom Name');
    expect(item.amount).toBe(500_000);
    expect(item.fiscalYear).toBe(2025);
  });

  it('mockLineItem should include required LineItem properties', () => {
    const lineItem = mockLineItem();

    expect(lineItem).toHaveProperty('description');
    expect(lineItem).toHaveProperty('source');
    expect(lineItem).toHaveProperty('lastUpdated');
    expect(lineItem.lastUpdated).toBeInstanceOf(Date);
  });

  it('mockProgram should contain lineItems array', () => {
    const lineItem1 = mockLineItem();
    const lineItem2 = mockLineItem();
    const program = mockProgram({
      lineItems: [lineItem1, lineItem2],
    });

    expect(program.lineItems).toHaveLength(2);
    expect(program.lineItems[0]).toBe(lineItem1);
  });

  it('mockAgency should contain programs array', () => {
    const program = mockProgram();
    const agency = mockAgency({
      programs: [program],
    });

    expect(agency.programs).toHaveLength(1);
    expect(agency.programs[0]).toBe(program);
  });

  it('mockDepartment should contain agencies array', () => {
    const agency = mockAgency();
    const department = mockDepartment({
      agencies: [agency],
    });

    expect(department.agencies).toHaveLength(1);
    expect(department.agencies[0]).toBe(agency);
    expect(department.parentId).toBeNull();
  });
});

describe('Comparison Mock Factories', () => {
  it('mockUnit should create valid comparison unit', () => {
    const unit = mockUnit();

    expect(unit).toHaveProperty('id');
    expect(unit).toHaveProperty('name');
    expect(unit).toHaveProperty('costPerUnit');
    expect(unit).toHaveProperty('category');
    expect(typeof unit.costPerUnit).toBe('number');
  });

  it('mockUnit should accept overrides', () => {
    const unit = mockUnit({
      name: 'Starbucks Latte',
      costPerUnit: 5.95,
      category: 'food',
    });

    expect(unit.name).toBe('Starbucks Latte');
    expect(unit.costPerUnit).toBe(5.95);
    expect(unit.category).toBe('food');
  });

  it('mockComparison should create valid comparison', () => {
    const comparison = mockComparison();

    expect(comparison).toHaveProperty('id');
    expect(comparison).toHaveProperty('budgetItemId');
    expect(comparison).toHaveProperty('unitId');
    expect(comparison).toHaveProperty('unitCount');
    expect(comparison.createdAt).toBeInstanceOf(Date);
  });

  it('mockComparison should calculate unit count correctly', () => {
    const comparison = mockComparison({
      budgetAmount: 1_000_000,
      unitCount: 100_000,
    });

    expect(comparison.budgetAmount).toBe(1_000_000);
    expect(comparison.unitCount).toBe(100_000);
  });

  it('mockFeaturedComparison should include featured properties', () => {
    const featured = mockFeaturedComparison({
      headline: 'Test Headline',
      isFeatured: true,
      displayOrder: 5,
    });

    expect(featured.headline).toBe('Test Headline');
    expect(featured.isFeatured).toBe(true);
    expect(featured.displayOrder).toBe(5);
    // Should also have base comparison properties
    expect(featured).toHaveProperty('budgetItemId');
    expect(featured).toHaveProperty('unitId');
  });

  it('mockComparisonResult should include formatted string', () => {
    const result = mockComparisonResult({
      budgetItemName: 'Coffee Budget',
      unitName: 'Lattes',
      unitCount: 150,
    });

    expect(result.budgetItemName).toBe('Coffee Budget');
    expect(result.unitName).toBe('Lattes');
    expect(result.unitCount).toBe(150);
    expect(result.formattedString).toContain('Coffee Budget');
    expect(result.formattedString).toContain('150');
    expect(result.formattedString).toContain('Lattes');
  });
});

describe('Budget Hierarchy Helpers', () => {
  it('createMockBudgetHierarchy should create complete hierarchy', () => {
    const hierarchy = createMockBudgetHierarchy();

    expect(hierarchy.department).toBeDefined();
    expect(hierarchy.agency).toBeDefined();
    expect(hierarchy.program).toBeDefined();
    expect(hierarchy.lineItem1).toBeDefined();
    expect(hierarchy.lineItem2).toBeDefined();
  });

  it('hierarchy should have proper parent-child relationships', () => {
    const hierarchy = createMockBudgetHierarchy();

    // Check IDs match
    expect(hierarchy.agency.parentId).toBe(hierarchy.department.id);
    expect(hierarchy.program.parentId).toBe(hierarchy.agency.id);
    expect(hierarchy.lineItem1.parentId).toBe(hierarchy.program.id);

    // Check nested structures
    expect(hierarchy.department.agencies).toContain(hierarchy.agency);
    expect(hierarchy.agency.programs).toContain(hierarchy.program);
    expect(hierarchy.program.lineItems).toContain(hierarchy.lineItem1);
    expect(hierarchy.program.lineItems).toContain(hierarchy.lineItem2);
  });

  it('hierarchy should have consistent amounts', () => {
    const hierarchy = createMockBudgetHierarchy();

    // Line items should sum to program
    const lineItemTotal =
      hierarchy.lineItem1.amount + hierarchy.lineItem2.amount;
    expect(hierarchy.program.amount).toBe(lineItemTotal);

    // Program should equal agency (since it's the only program)
    expect(hierarchy.agency.amount).toBe(hierarchy.program.amount);

    // Agency should equal department (since it's the only agency)
    expect(hierarchy.department.amount).toBe(hierarchy.agency.amount);
  });
});

describe('Mock ID Generation', () => {
  it('should generate unique IDs for multiple items', () => {
    const item1 = mockBudgetItem();
    const item2 = mockBudgetItem();
    const item3 = mockBudgetItem();

    const ids = [item1.id, item2.id, item3.id];
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(3);
  });

  it('should generate unique IDs across different types', () => {
    const budgetItem = mockBudgetItem();
    const unit = mockUnit();
    const comparison = mockComparison();

    expect(budgetItem.id).not.toBe(unit.id);
    expect(budgetItem.id).not.toBe(comparison.id);
    expect(unit.id).not.toBe(comparison.id);
  });
});
