/**
 * USAspending API Client
 *
 * Client for interacting with the USAspending.gov API v2.
 * Provides methods for fetching budget data, agencies, and spending information.
 *
 * API Documentation: https://api.usaspending.gov/
 * Base URL: https://api.usaspending.gov/api/v2/
 *
 * Features:
 * - Rate limiting (configurable)
 * - Response caching (in-memory)
 * - Request retry logic
 * - Type-safe API responses
 * - Transform API data to app types
 */

import type {
  Agency,
  BudgetItem,
} from '@/types/budget';

// ============================================================================
// Configuration
// ============================================================================

const BASE_URL = 'https://api.usaspending.gov/api/v2';

const DEFAULT_CONFIG = {
  /** Maximum requests per minute */
  rateLimit: 60,
  /** Cache TTL in milliseconds (5 minutes default) */
  cacheTTL: 5 * 60 * 1000,
  /** Request timeout in milliseconds */
  timeout: 30000,
  /** Maximum retry attempts */
  maxRetries: 3,
  /** Retry delay in milliseconds */
  retryDelay: 1000,
} as const;

// ============================================================================
// USAspending API Types
// ============================================================================

/**
 * USAspending API Agency Response
 * Raw structure from /agency/ endpoints
 */
interface USASpendingAgencyResponse {
  toptier_code: string;
  agency_name: string;
  agency_id: number;
  abbreviation: string;
  current_total_budget_authority_amount: number;
  fiscal_year: number;
  office_agency_code?: string;
  congressional_justification_url?: string;
}

/**
 * USAspending API Budget Function Response
 * Raw structure from /budget_functions/ endpoints
 */
interface USASpendingBudgetFunctionResponse {
  budget_function: string;
  budget_function_code: string;
  budget_subfunction?: string;
  budget_subfunction_code?: string;
  obligated_amount: number;
  gross_outlay_amount: number;
  fiscal_year: number;
}

/**
 * USAspending API Object Class Response
 * Raw structure from /object_class/ endpoints
 */
interface USASpendingObjectClassResponse {
  id: number;
  object_class: string;
  object_class_name: string;
  obligated_amount: number;
  gross_outlay_amount: number;
}

/**
 * USAspending API Spending Data Response
 * Raw structure from spending endpoints
 */
interface USASpendingSpendingResponse {
  results: Array<{
    toptier_code: string;
    name: string;
    obligated_amount: number;
    gross_outlay_amount: number;
    fiscal_year: number;
  }>;
  page_metadata: {
    page: number;
    count: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================================================
// Transformed Types (Our App Format)
// ============================================================================

/**
 * Agency data transformed for our app
 */
interface AgencyData {
  id: string;
  name: string;
  abbreviation: string;
  amount: number;
  fiscalYear: number;
  parentId: string | null;
}

/**
 * Spending data for a specific entity
 */
interface SpendingData {
  entityId: string;
  entityName: string;
  totalAmount: number;
  fiscalYear: number;
  breakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

/**
 * Budget function data
 */
interface BudgetFunctionData {
  id: string;
  name: string;
  code: string;
  amount: number;
  fiscalYear: number;
}

/**
 * Object class data
 */
interface ObjectClassData {
  id: string;
  name: string;
  code: string;
  amount: number;
}

// ============================================================================
// Cache Implementation
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  clearByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

// ============================================================================
// Rate Limiter Implementation
// ============================================================================

class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;

  constructor(maxRequestsPerMinute: number) {
    this.maxRequests = maxRequestsPerMinute;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove requests older than 1 minute
    this.requests = this.requests.filter((time) => time > oneMinuteAgo);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      if (oldestRequest) {
        const waitTime = 60000 - (now - oldestRequest);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.checkLimit();
      }
    }

    this.requests.push(now);
  }
}

// ============================================================================
// API Client
// ============================================================================

export class USASpendingClient {
  private baseUrl: string;
  private cache: ResponseCache;
  private rateLimiter: RateLimiter;
  private config: typeof DEFAULT_CONFIG;

  constructor(config: Partial<typeof DEFAULT_CONFIG> = {}) {
    this.baseUrl = BASE_URL;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new ResponseCache(this.config.cacheTTL);
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
  }

  /**
   * Make a request to the USAspending API with caching and rate limiting
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache first
    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Rate limit
    await this.rateLimiter.checkLimit();

    // Make request with retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `USAspending API error: ${response.status} ${response.statusText}`
          );
        }

        const data = (await response.json()) as T;

        // Cache successful response
        this.cache.set(cacheKey, data);

        return data;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay * (attempt + 1))
          );
        }
      }
    }

    throw new Error(
      `Failed to fetch from USAspending API after ${this.config.maxRetries} attempts: ${lastError?.message}`
    );
  }

  // ==========================================================================
  // Public API Methods
  // ==========================================================================

  /**
   * Get all federal agencies
   * @returns Array of agencies with spending data
   */
  async getAgencies(_fiscalYear?: number): Promise<Agency[]> {
    // TODO: Implement actual API call to /agency/
    // Endpoint: GET /agency/
    // Query params: fiscal_year (optional)
    //
    // Example implementation:
    // const year = fiscalYear || new Date().getFullYear();
    // const response = await this.request<{ results: USASpendingAgencyResponse[] }>(
    //   `/agency/?fiscal_year=${year}`
    // );
    //
    // return response.results.map(transformAgencyToAppFormat);

    console.warn('USASpendingClient.getAgencies() - Not yet implemented');
    return [];
  }

  /**
   * Get spending data for a specific agency
   * @param agencyId - Agency identifier (toptier_code)
   * @returns Detailed spending breakdown for the agency
   */
  async getAgencySpending(agencyId: string): Promise<SpendingData> {
    // TODO: Implement actual API call to /spending/
    // Endpoint: POST /spending/
    // Body: {
    //   "filters": {
    //     "agencies": [{ "type": "awarding", "tier": "toptier", "name": agencyId }]
    //   }
    // }
    //
    // Transform response to SpendingData format

    console.warn('USASpendingClient.getAgencySpending() - Not yet implemented');
    return {
      entityId: agencyId,
      entityName: 'Unknown Agency',
      totalAmount: 0,
      fiscalYear: new Date().getFullYear(),
      breakdown: [],
    };
  }

  /**
   * Get all budget functions
   * @returns Array of budget functions with spending totals
   */
  async getBudgetFunctions(_fiscalYear?: number): Promise<BudgetFunctionData[]> {
    // TODO: Implement actual API call to /budget_functions/
    // Endpoint: GET /budget_functions/federal_account/
    // Query params: fiscal_year (optional)
    //
    // Transform USASpendingBudgetFunctionResponse to BudgetFunctionData

    console.warn(
      'USASpendingClient.getBudgetFunctions() - Not yet implemented'
    );
    return [];
  }

  /**
   * Get all object classes (spending categories)
   * @returns Array of object classes with spending totals
   */
  async getObjectClasses(_fiscalYear?: number): Promise<ObjectClassData[]> {
    // TODO: Implement actual API call to /object_class/
    // Endpoint: GET /object_class/
    // Query params: fiscal_year (optional)
    //
    // Transform USASpendingObjectClassResponse to ObjectClassData

    console.warn('USASpendingClient.getObjectClasses() - Not yet implemented');
    return [];
  }

  /**
   * Search for budget items by keyword
   * @param searchTerm - Search query
   * @returns Array of matching budget items
   */
  async searchBudgetItems(_searchTerm: string): Promise<BudgetItem[]> {
    // TODO: Implement actual API call to /search/
    // Endpoint: POST /search/
    // Body: { "query": searchTerm }
    //
    // Transform results to BudgetItem format

    console.warn(
      'USASpendingClient.searchBudgetItems() - Not yet implemented'
    );
    return [];
  }

  /**
   * Get spending trends over time for an entity
   * @param entityId - Entity identifier
   * @param startYear - Start fiscal year
   * @param endYear - End fiscal year
   * @returns Time series spending data
   */
  async getSpendingTrends(
    _entityId: string,
    _startYear: number,
    _endYear: number
  ): Promise<Array<{ year: number; amount: number }>> {
    // TODO: Implement actual API call to get historical data
    // May require multiple requests for different fiscal years
    //
    // Return array of year/amount pairs

    console.warn(
      'USASpendingClient.getSpendingTrends() - Not yet implemented'
    );
    return [];
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cached responses for a specific prefix
   */
  clearCacheByPrefix(prefix: string): void {
    this.cache.clearByPrefix(prefix);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; ttl: number } {
    return {
      size: this.cache['cache'].size,
      ttl: this.config.cacheTTL,
    };
  }
}

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Transform USAspending agency data to our app's Agency type
 */
function transformAgencyToAppFormat(
  apiAgency: USASpendingAgencyResponse,
  _parentId: string | null = null
): Agency {
  // TODO: Implement actual transformation logic
  // Map API fields to our Agency interface
  // Calculate percentOfParent if parent exists
  // Handle nested programs and line items

  const baseItem: BudgetItem = {
    id: apiAgency.toptier_code,
    name: apiAgency.agency_name,
    amount: apiAgency.current_total_budget_authority_amount,
    parentId: _parentId,
    fiscalYear: apiAgency.fiscal_year,
    percentOfParent: null, // Calculate based on parent
    yearOverYearChange: null, // Calculate based on historical data
  };

  return {
    ...baseItem,
    programs: [], // TODO: Fetch and transform programs
  };
}

/**
 * Transform USAspending budget function to our app's format
 */
function transformBudgetFunction(
  _apiFunction: USASpendingBudgetFunctionResponse
): BudgetFunctionData {
  // TODO: Implement transformation
  return {
    id: _apiFunction.budget_function_code,
    name: _apiFunction.budget_function,
    code: _apiFunction.budget_function_code,
    amount: _apiFunction.obligated_amount,
    fiscalYear: _apiFunction.fiscal_year,
  };
}

/**
 * Transform USAspending object class to our app's format
 */
function transformObjectClass(
  _apiObjectClass: USASpendingObjectClassResponse
): ObjectClassData {
  // TODO: Implement transformation
  return {
    id: String(_apiObjectClass.id),
    name: _apiObjectClass.object_class_name,
    code: _apiObjectClass.object_class,
    amount: _apiObjectClass.obligated_amount,
  };
}

// ============================================================================
// Singleton Instance Export
// ============================================================================

/**
 * Default client instance
 * Use this for most operations unless you need custom configuration
 */
export const usaSpendingClient = new USASpendingClient();

/**
 * Export types for consumers
 */
export type {
  AgencyData,
  SpendingData,
  BudgetFunctionData,
  ObjectClassData,
  USASpendingAgencyResponse,
  USASpendingBudgetFunctionResponse,
  USASpendingObjectClassResponse,
  USASpendingSpendingResponse,
};
