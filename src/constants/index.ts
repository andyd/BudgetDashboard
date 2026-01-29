/**
 * Federal Budget Dashboard - Application Constants
 *
 * Central place for all app-wide configuration values, including
 * fiscal year settings, budget hierarchy levels, category mappings,
 * API endpoints, and external data sources.
 */

// =============================================================================
// FISCAL YEAR & POPULATION
// =============================================================================

export const FISCAL_YEAR = 2025 as const;

export const US_POPULATION = 335_000_000 as const;

// =============================================================================
// BUDGET HIERARCHY
// =============================================================================

/**
 * Budget hierarchy levels from highest to most granular
 */
export const BUDGET_LEVELS = [
  'Total',
  'Department',
  'Agency',
  'Program',
  'Line Item',
] as const;

export type BudgetLevel = (typeof BUDGET_LEVELS)[number];

// =============================================================================
// DEPARTMENT & CATEGORY IDs
// =============================================================================

/**
 * Treasury Account Symbol (TAS) codes for major departments
 * Format: Agency Code - Bureau Code
 */
export const CATEGORY_IDS = {
  // Cabinet Departments
  DEFENSE: '097', // Department of Defense
  HEALTH_HUMAN_SERVICES: '075', // HHS (includes Medicare, Medicaid)
  TREASURY: '020', // Treasury (includes IRS)
  AGRICULTURE: '012', // USDA
  VETERANS_AFFAIRS: '036', // VA
  EDUCATION: '091', // Department of Education
  HOMELAND_SECURITY: '070', // DHS
  ENERGY: '089', // DOE
  HOUSING_URBAN_DEV: '086', // HUD
  JUSTICE: '015', // DOJ
  STATE: '019', // Department of State
  TRANSPORTATION: '069', // DOT
  INTERIOR: '014', // DOI
  COMMERCE: '013', // DOC
  LABOR: '016', // DOL

  // Major Independent Agencies
  SOCIAL_SECURITY: '028', // SSA
  NASA: '080', // NASA
  EPA: '068', // Environmental Protection Agency
  NSF: '049', // National Science Foundation
  SBA: '073', // Small Business Administration

  // Legislative & Judicial
  CONGRESS: '001', // Legislative Branch
  JUDICIAL: '010', // Judicial Branch

  // Interest Payments
  INTEREST_ON_DEBT: '020-0541', // Treasury - Interest on the Public Debt
} as const;

/**
 * Human-readable department names
 */
export const DEPARTMENT_NAMES: Record<string, string> = {
  '097': 'Defense',
  '075': 'Health & Human Services',
  '020': 'Treasury',
  '012': 'Agriculture',
  '036': 'Veterans Affairs',
  '091': 'Education',
  '070': 'Homeland Security',
  '089': 'Energy',
  '086': 'Housing & Urban Development',
  '015': 'Justice',
  '019': 'State',
  '069': 'Transportation',
  '014': 'Interior',
  '013': 'Commerce',
  '016': 'Labor',
  '028': 'Social Security Administration',
  '080': 'NASA',
  '068': 'Environmental Protection Agency',
  '049': 'National Science Foundation',
  '073': 'Small Business Administration',
  '001': 'Legislative Branch',
  '010': 'Judicial Branch',
} as const;

// =============================================================================
// COMPARISON UNITS
// =============================================================================

/**
 * Default units for contextualizing budget numbers
 * Each unit includes: singular/plural names, value in dollars, category, and sources
 */
export const DEFAULT_COMPARISON_UNITS = [
  // Infrastructure & Construction
  {
    id: 'highway-mile',
    singular: 'mile of highway',
    plural: 'miles of highway',
    value: 10_000_000, // $10M per mile (rural interstate average)
    category: 'infrastructure',
    icon: '🛣️',
    source: 'FHWA Highway Cost Index',
    sourceUrl: 'https://www.fhwa.dot.gov/policy/23cpr/appendixa.cfm',
  },
  {
    id: 'bridge',
    singular: 'bridge repair',
    plural: 'bridge repairs',
    value: 250_000, // Average repair cost
    category: 'infrastructure',
    icon: '🌉',
    source: 'ASCE Infrastructure Report Card',
    sourceUrl: 'https://infrastructurereportcard.org/',
  },
  {
    id: 'school',
    singular: 'public school',
    plural: 'public schools',
    value: 25_000_000, // Average new school construction
    category: 'infrastructure',
    icon: '🏫',
    source: 'National Center for Education Statistics',
    sourceUrl: 'https://nces.ed.gov/',
  },

  // Healthcare & Social Services
  {
    id: 'teacher-salary',
    singular: "teacher's annual salary",
    plural: "teachers' annual salaries",
    value: 65_000, // Average public school teacher
    category: 'education',
    icon: '👨‍🏫',
    source: 'NEA Rankings & Estimates',
    sourceUrl: 'https://www.nea.org/',
  },
  {
    id: 'hospital-bed',
    singular: 'hospital bed (annual)',
    plural: 'hospital beds (annual)',
    value: 1_000_000, // Annual operating cost per bed
    category: 'healthcare',
    icon: '🏥',
    source: 'AHA Hospital Statistics',
    sourceUrl: 'https://www.aha.org/',
  },
  {
    id: 'medical-resident',
    singular: 'medical resident (annual)',
    plural: 'medical residents (annual)',
    value: 150_000, // Training cost per resident
    category: 'healthcare',
    icon: '👨‍⚕️',
    source: 'AAMC Medical Education Costs',
    sourceUrl: 'https://www.aamc.org/',
  },

  // Defense & Security
  {
    id: 'f35-fighter',
    singular: 'F-35 fighter jet',
    plural: 'F-35 fighter jets',
    value: 80_000_000, // Per unit cost
    category: 'defense',
    icon: '✈️',
    source: 'DOD Selected Acquisition Reports',
    sourceUrl: 'https://www.esd.whs.mil/SAR/',
  },
  {
    id: 'aircraft-carrier',
    singular: 'aircraft carrier',
    plural: 'aircraft carriers',
    value: 13_000_000_000, // Ford-class carrier
    category: 'defense',
    icon: '🚢',
    source: 'Congressional Research Service',
    sourceUrl: 'https://crsreports.congress.gov/',
  },
  {
    id: 'border-patrol-agent',
    singular: 'border patrol agent (annual)',
    plural: 'border patrol agents (annual)',
    value: 100_000, // Salary + benefits + equipment
    category: 'defense',
    icon: '🛂',
    source: 'CBP Budget Overview',
    sourceUrl: 'https://www.cbp.gov/',
  },

  // Research & Space
  {
    id: 'mars-rover',
    singular: 'Mars rover mission',
    plural: 'Mars rover missions',
    value: 2_500_000_000, // Perseverance/Curiosity class
    category: 'science',
    icon: '🔴',
    source: 'NASA Budget Documentation',
    sourceUrl: 'https://www.nasa.gov/budget/',
  },
  {
    id: 'research-grant',
    singular: 'NIH research grant',
    plural: 'NIH research grants',
    value: 500_000, // Average R01 grant
    category: 'science',
    icon: '🔬',
    source: 'NIH RePORTER',
    sourceUrl: 'https://reporter.nih.gov/',
  },

  // Everyday Comparisons (per capita)
  {
    id: 'per-person',
    singular: 'per person',
    plural: 'per person',
    value: 1, // Will be divided by population
    category: 'per-capita',
    icon: '👤',
    source: 'US Census Bureau',
    sourceUrl: 'https://www.census.gov/',
  },
  {
    id: 'median-income',
    singular: 'median household income',
    plural: 'median household incomes',
    value: 75_000, // US median
    category: 'household',
    icon: '🏠',
    source: 'US Census Bureau ACS',
    sourceUrl: 'https://www.census.gov/programs-surveys/acs',
  },
  {
    id: 'college-tuition',
    singular: 'year of public college',
    plural: 'years of public college',
    value: 28_000, // Average in-state tuition + room & board
    category: 'education',
    icon: '🎓',
    source: 'College Board Trends',
    sourceUrl: 'https://research.collegeboard.org/',
  },
] as const;

/**
 * Categories for organizing comparison units
 */
export const COMPARISON_CATEGORIES = [
  'infrastructure',
  'education',
  'healthcare',
  'defense',
  'science',
  'per-capita',
  'household',
  'all',
] as const;

export type ComparisonCategory = (typeof COMPARISON_CATEGORIES)[number];

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * Internal API routes
 */
export const API_ENDPOINTS = {
  budget: {
    summary: '/api/budget/summary', // Total budget overview
    department: (id: string) => `/api/budget/department/${id}`,
    agency: (deptId: string, agencyId: string) =>
      `/api/budget/department/${deptId}/agency/${agencyId}`,
    search: '/api/budget/search',
    trending: '/api/budget/trending', // Most-viewed items
  },
  comparisons: {
    featured: '/api/comparisons/featured',
    create: '/api/comparisons',
    get: (id: string) => `/api/comparisons/${id}`,
    update: (id: string) => `/api/comparisons/${id}`,
    delete: (id: string) => `/api/comparisons/${id}`,
  },
  units: {
    list: '/api/units',
    categories: '/api/units/categories',
  },
  admin: {
    sync: '/api/admin/sync', // Sync USAspending data
    spotlight: '/api/admin/spotlight', // Manage editorial content
  },
} as const;

/**
 * External data sources
 */
export const EXTERNAL_SOURCES = {
  usaspending: {
    name: 'USAspending.gov',
    baseUrl: 'https://api.usaspending.gov/api/v2',
    website: 'https://www.usaspending.gov/',
    endpoints: {
      // Spending by agency
      agencyBudgets: '/agency/{toptier_code}/budgetary_resources/',
      // Federal account details
      federalAccount: '/federal_accounts/{account_code}/',
      // Search spending
      spendingByCategory: '/spending/',
      // Award (contract/grant) search
      advancedSearch: '/search/spending_by_award/',
    },
  },
  cbo: {
    name: 'Congressional Budget Office',
    website: 'https://www.cbo.gov/',
    dataUrl: 'https://www.cbo.gov/topics/budget',
  },
  omb: {
    name: 'Office of Management and Budget',
    website: 'https://www.whitehouse.gov/omb/',
    budgetUrl: 'https://www.whitehouse.gov/omb/budget/',
  },
  treasury: {
    name: 'US Department of Treasury',
    website: 'https://fiscaldata.treasury.gov/',
    api: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service',
  },
  gao: {
    name: 'Government Accountability Office',
    website: 'https://www.gao.gov/',
    reportsUrl: 'https://www.gao.gov/reports-testimonies',
  },
} as const;

// =============================================================================
// SOCIAL SHARING
// =============================================================================

/**
 * Templates for social media sharing
 */
export const SOCIAL_SHARE_TEMPLATES = {
  twitter: {
    text: (budgetItem: string, amount: string, comparison: string) =>
      `The US spends ${amount} on ${budgetItem} - that's enough to ${comparison}! Explore the federal budget:`,
    hashtags: ['FederalBudget', 'DataViz', 'USSpending'],
  },
  facebook: {
    quote: (budgetItem: string, amount: string) =>
      `Did you know the US federal government spends ${amount} on ${budgetItem}?`,
  },
  linkedin: {
    title: 'Federal Budget Insights',
    summary: (budgetItem: string, comparison: string) =>
      `Putting federal spending in context: ${budgetItem} equals ${comparison}. Understanding where tax dollars go.`,
  },
  email: {
    subject: 'Check out this federal budget visualization',
    body: (url: string) =>
      `I found this interesting visualization of the US federal budget that makes spending numbers easier to understand:\n\n${url}`,
  },
} as const;

// =============================================================================
// APP CONFIGURATION
// =============================================================================

export const APP_CONFIG = {
  name: 'Federal Budget Dashboard',
  shortName: 'Budget Dashboard',
  description:
    'Interactive visualization of US federal spending with real-world comparisons',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  version: '1.0.0',
  keywords: [
    'federal budget',
    'government spending',
    'data visualization',
    'USAspending',
    'transparency',
  ],
  author: 'Your Name',
  twitter: '@budgetdashboard',
  ogImage: '/og-image.png',
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAVIGATION = {
  main: [
    { name: 'Dashboard', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: 'About', href: '/about' },
    { name: 'Sources', href: '/sources' },
  ],
  footer: [
    { name: 'About', href: '/about' },
    { name: 'Data Sources', href: '/sources' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
} as const;

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername/budget-dashboard',
  twitter: 'https://twitter.com/budgetdashboard',
  email: 'mailto:contact@budgetdashboard.com',
} as const;

// =============================================================================
// VISUALIZATION SETTINGS
// =============================================================================

/**
 * D3.js treemap and visualization configuration
 */
export const VIZ_CONFIG = {
  treemap: {
    minCellSize: 30, // Minimum cell size in pixels
    padding: 2, // Padding between cells
    cornerRadius: 4, // Rounded corners
    animationDuration: 300, // Transition duration (ms)
    colors: {
      // Color scale for departments (based on spending size)
      scale: [
        '#1e40af', // Deep blue (largest)
        '#3b82f6', // Blue
        '#60a5fa', // Light blue
        '#93c5fd', // Lighter blue
        '#dbeafe', // Lightest blue (smallest)
      ],
      hover: '#fbbf24', // Amber on hover
      selected: '#f59e0b', // Darker amber when selected
    },
  },
  formatting: {
    currencyDecimals: 2, // Decimal places for currency
    percentDecimals: 1, // Decimal places for percentages
    largeNumberThreshold: 1_000_000_000, // When to use B/M notation
  },
} as const;

// =============================================================================
// ANIMATION & UI
// =============================================================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DELAYS = {
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

// =============================================================================
// VALIDATION & ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  invalidFormat: 'Invalid format',
  serverError: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
  budgetNotFound: 'Budget item not found',
  comparisonNotFound: 'Comparison not found',
  syncFailed: 'Failed to sync data from USAspending',
} as const;

export const SUCCESS_MESSAGES = {
  comparisonSaved: 'Comparison saved successfully',
  comparisonShared: 'Share link copied to clipboard',
  dataSynced: 'Budget data synchronized successfully',
} as const;

// =============================================================================
// DATA REFRESH & CACHING
// =============================================================================

/**
 * Data refresh intervals and cache settings
 */
export const DATA_CONFIG = {
  // How often to check for USAspending updates (ms)
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours

  // Cache TTL for API responses (seconds)
  cacheTTL: {
    summary: 3600, // 1 hour
    department: 1800, // 30 minutes
    agency: 900, // 15 minutes
    search: 300, // 5 minutes
  },

  // Stale-while-revalidate times (seconds)
  staleWhileRevalidate: {
    summary: 86400, // 24 hours
    department: 43200, // 12 hours
    agency: 21600, // 6 hours
  },
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Feature flags for gradual rollout
 */
export const FEATURES = {
  comparisonBuilder: true, // User-created comparisons
  adminPanel: true, // Admin interface
  socialSharing: true, // Share to social media
  searchAutocomplete: true, // Autocomplete in search
  spotlightCards: true, // Editorial spotlight content
  historicalData: false, // Multi-year budget data (future)
  exportData: false, // CSV/JSON export (future)
} as const;
