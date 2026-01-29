import { NextRequest, NextResponse } from 'next/server';
import type { Comparison } from '@/types';
import { successResponse, errorResponse } from '@/types/api';

/**
 * Mock comparisons data
 * In production, this would come from a database
 * (Duplicated from parent route for simplicity)
 */
const MOCK_COMPARISONS: Comparison[] = [
  {
    id: 'cmp-1',
    budgetItemId: 'defense',
    budgetItemName: 'Defense Budget',
    budgetAmount: 842000000000,
    unitId: 'f35-fighter-jet',
    unitName: 'F-35 Fighter Jet',
    unitCost: 80000000,
    result: 10525,
    formula: '$842,000,000,000 ÷ $80,000,000 = 10,525 jets',
    isFeatured: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'cmp-2',
    budgetItemId: 'medicare',
    budgetItemName: 'Medicare',
    budgetAmount: 848000000000,
    unitId: 'hospital-bed-year',
    unitName: 'Hospital Bed Year',
    unitCost: 300000,
    result: 2826667,
    formula: '$848,000,000,000 ÷ $300,000 = 2,826,667 bed-years',
    isFeatured: true,
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16'),
  },
  {
    id: 'cmp-3',
    budgetItemId: 'education',
    budgetItemName: 'Education',
    budgetAmount: 79000000000,
    unitId: 'teacher-salary',
    unitName: 'Teacher Salary',
    unitCost: 70000,
    result: 1128571,
    formula: '$79,000,000,000 ÷ $70,000 = 1,128,571 teachers',
    isFeatured: true,
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-17'),
  },
  {
    id: 'cmp-4',
    budgetItemId: 'infrastructure',
    budgetItemName: 'Infrastructure',
    budgetAmount: 120000000000,
    unitId: 'mile-of-highway',
    unitName: 'Mile of Highway',
    unitCost: 10000000,
    result: 12000,
    formula: '$120,000,000,000 ÷ $10,000,000 = 12,000 miles',
    isFeatured: true,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: 'cmp-5',
    budgetItemId: 'nasa',
    budgetItemName: 'NASA',
    budgetAmount: 25000000000,
    unitId: 'james-webb-telescope',
    unitName: 'James Webb Space Telescope',
    unitCost: 10000000000,
    result: 2.5,
    formula: '$25,000,000,000 ÷ $10,000,000,000 = 2.5 telescopes',
    isFeatured: true,
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: 'cmp-6',
    budgetItemId: 'veterans-affairs',
    budgetItemName: 'Veterans Affairs',
    budgetAmount: 330000000000,
    unitId: 'nursing-home-year',
    unitName: 'Nursing Home Year',
    unitCost: 100000,
    result: 3300000,
    formula: '$330,000,000,000 ÷ $100,000 = 3,300,000 years',
    isFeatured: false,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'cmp-7',
    budgetItemId: 'homeland-security',
    budgetItemName: 'Homeland Security',
    budgetAmount: 60000000000,
    unitId: 'border-patrol-agent',
    unitName: 'Border Patrol Agent Salary',
    unitCost: 80000,
    result: 750000,
    formula: '$60,000,000,000 ÷ $80,000 = 750,000 agents',
    isFeatured: false,
    createdAt: new Date('2026-01-21'),
    updatedAt: new Date('2026-01-21'),
  },
];

/**
 * GET /api/comparisons/[id]
 *
 * Returns a specific comparison by ID
 *
 * Params:
 * - id: Comparison ID (e.g., "cmp-1", "cmp-2")
 *
 * Returns:
 * - 200: Comparison object
 * - 404: Comparison not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comparison = MOCK_COMPARISONS.find((c) => c.id === id);

    if (!comparison) {
      return NextResponse.json(errorResponse('Comparison not found'), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(comparison));
  } catch (error) {
    console.error('Error fetching comparison:', error);
    return NextResponse.json(errorResponse('Failed to fetch comparison'), {
      status: 500,
    });
  }
}
