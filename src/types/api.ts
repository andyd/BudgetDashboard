/**
 * API Response Types
 *
 * Defines consistent response structures for all API endpoints.
 * All API responses should use these types to ensure consistency.
 */

import type { BudgetItem, Comparison, Unit } from './index';

/**
 * Generic API response wrapper
 * Provides consistent structure for all API responses
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

/**
 * Budget items response
 */
export interface BudgetResponse {
  items: BudgetItem[];
  lastUpdated: string;
  fiscalYear: string;
}

/**
 * Single comparison response
 */
export interface ComparisonResponse {
  comparison: Comparison;
  budgetItem: BudgetItem;
  unit: Unit;
}

/**
 * Featured comparisons response
 */
export interface FeaturedResponse {
  comparisons: Array<{
    comparison: Comparison;
    budgetItem: BudgetItem;
    unit: Unit;
  }>;
}

/**
 * Units list response
 */
export interface UnitsResponse {
  units: Unit[];
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Paginated response wrapper
 * Used for endpoints that return paginated data
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T; status: 'success' } {
  return response.status === 'success' && response.data !== null;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { error: string; status: 'error' } {
  return response.status === 'error' && response.error !== null;
}

/**
 * Helper to create success response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null,
    status: 'success',
  };
}

/**
 * Helper to create error response
 */
export function errorResponse<T>(error: string): ApiResponse<T> {
  return {
    data: null,
    error,
    status: 'error',
  };
}
