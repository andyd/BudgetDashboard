import { NextRequest, NextResponse } from 'next/server';
import type { Comparison } from '@/types';
import { successResponse, errorResponse } from '@/types/api';

/**
 * Mock comparisons data
 * In production, this would come from a database
 */
const MOCK_COMPARISONS: Comparison[] = [
  {
    id: 'cmp-1',
    budgetItemId: 'defense',
    budgetItemName: 'Defense Budget',
    budgetAmount: 842000000000, // $842 billion
    unitId: 'f35-fighter-jet',
    unitName: 'F-35 Fighter Jet',
    unitCost: 80000000, // $80 million per jet
    result: 10525, // 842B / 80M
    formula: '$842,000,000,000 ÷ $80,000,000 = 10,525 jets',
    isFeatured: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'cmp-2',
    budgetItemId: 'medicare',
    budgetItemName: 'Medicare',
    budgetAmount: 848000000000, // $848 billion
    unitId: 'hospital-bed-year',
    unitName: 'Hospital Bed Year',
    unitCost: 300000, // $300k per bed-year
    result: 2826667, // 848B / 300k
    formula: '$848,000,000,000 ÷ $300,000 = 2,826,667 bed-years',
    isFeatured: true,
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16'),
  },
  {
    id: 'cmp-3',
    budgetItemId: 'education',
    budgetItemName: 'Education',
    budgetAmount: 79000000000, // $79 billion
    unitId: 'teacher-salary',
    unitName: 'Teacher Salary',
    unitCost: 70000, // $70k average teacher salary
    result: 1128571, // 79B / 70k
    formula: '$79,000,000,000 ÷ $70,000 = 1,128,571 teachers',
    isFeatured: true,
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-17'),
  },
  {
    id: 'cmp-4',
    budgetItemId: 'infrastructure',
    budgetItemName: 'Infrastructure',
    budgetAmount: 120000000000, // $120 billion
    unitId: 'mile-of-highway',
    unitName: 'Mile of Highway',
    unitCost: 10000000, // $10 million per mile
    result: 12000, // 120B / 10M
    formula: '$120,000,000,000 ÷ $10,000,000 = 12,000 miles',
    isFeatured: true,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: 'cmp-5',
    budgetItemId: 'nasa',
    budgetItemName: 'NASA',
    budgetAmount: 25000000000, // $25 billion
    unitId: 'james-webb-telescope',
    unitName: 'James Webb Space Telescope',
    unitCost: 10000000000, // $10 billion
    result: 2.5, // 25B / 10B
    formula: '$25,000,000,000 ÷ $10,000,000,000 = 2.5 telescopes',
    isFeatured: true,
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: 'cmp-6',
    budgetItemId: 'veterans-affairs',
    budgetItemName: 'Veterans Affairs',
    budgetAmount: 330000000000, // $330 billion
    unitId: 'nursing-home-year',
    unitName: 'Nursing Home Year',
    unitCost: 100000, // $100k per year
    result: 3300000, // 330B / 100k
    formula: '$330,000,000,000 ÷ $100,000 = 3,300,000 years',
    isFeatured: false,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'cmp-7',
    budgetItemId: 'homeland-security',
    budgetItemName: 'Homeland Security',
    budgetAmount: 60000000000, // $60 billion
    unitId: 'border-patrol-agent',
    unitName: 'Border Patrol Agent Salary',
    unitCost: 80000, // $80k per year
    result: 750000, // 60B / 80k
    formula: '$60,000,000,000 ÷ $80,000 = 750,000 agents',
    isFeatured: false,
    createdAt: new Date('2026-01-21'),
    updatedAt: new Date('2026-01-21'),
  },
];

/**
 * GET /api/comparisons
 *
 * Returns comparisons, optionally filtered to featured only
 *
 * Query params:
 * - featured=true: Filter to only featured comparisons
 *
 * Returns:
 * - 200: Array of comparisons sorted by createdAt (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    let comparisons: Comparison[];

    if (featuredOnly) {
      // Return only featured comparisons
      comparisons = MOCK_COMPARISONS.filter((c) => c.isFeatured);
    } else {
      // Return all comparisons
      comparisons = [...MOCK_COMPARISONS];
    }

    // Sort by creation date (newest first)
    comparisons.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(successResponse(comparisons));
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch comparisons'),
      { status: 500 }
    );
  }
}

/**
 * POST /api/comparisons
 *
 * Creates a new custom comparison (for sharing)
 *
 * Request body:
 * {
 *   budgetItemId: string;
 *   budgetItemName: string;
 *   budgetAmount: number;
 *   unitId: string;
 *   unitName: string;
 *   unitCost: number;
 *   result: number;
 *   formula: string;
 * }
 *
 * Returns:
 * - 201: Created comparison with generated ID
 * - 400: Invalid request body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      budgetItemId,
      budgetItemName,
      budgetAmount,
      unitId,
      unitName,
      unitCost,
      result,
      formula,
    } = body;

    if (
      !budgetItemId ||
      !budgetItemName ||
      !budgetAmount ||
      !unitId ||
      !unitName ||
      !unitCost ||
      !result ||
      !formula
    ) {
      return NextResponse.json(
        errorResponse('Missing required fields'),
        { status: 400 }
      );
    }

    // Validate types
    if (
      typeof budgetItemId !== 'string' ||
      typeof budgetItemName !== 'string' ||
      typeof budgetAmount !== 'number' ||
      typeof unitId !== 'string' ||
      typeof unitName !== 'string' ||
      typeof unitCost !== 'number' ||
      typeof result !== 'number' ||
      typeof formula !== 'string'
    ) {
      return NextResponse.json(
        errorResponse('Invalid field types'),
        { status: 400 }
      );
    }

    // Create new comparison
    const now = new Date();
    const newComparison: Comparison = {
      id: `cmp-${Date.now()}`, // Simple ID generation for mock
      budgetItemId,
      budgetItemName,
      budgetAmount,
      unitId,
      unitName,
      unitCost,
      result,
      formula,
      isFeatured: false, // Custom comparisons are not featured by default
      createdAt: now,
      updatedAt: now,
    };

    // In production, this would save to database
    // For now, just return the created comparison
    MOCK_COMPARISONS.push(newComparison);

    return NextResponse.json(successResponse(newComparison), { status: 201 });
  } catch (error) {
    console.error('Error creating comparison:', error);
    return NextResponse.json(
      errorResponse('Failed to create comparison'),
      { status: 500 }
    );
  }
}
