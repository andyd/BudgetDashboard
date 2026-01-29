/**
 * Mock Data
 *
 * Sample data for development and testing
 */

// Budget data
export { MOCK_BUDGET_DATA } from './budget';

// Comparison units
export { mockUnits, getUnits, getUnitById, getCategories } from './units';

// Featured comparisons
export {
  FEATURED_COMPARISONS,
  FEATURED_COMPARISON_CONTEXT,
  getFeaturedComparisons,
  getRandomFeaturedComparison,
  getFeaturedComparisonsByBudgetItem,
} from './featured-comparisons';

// Spotlight content
export type { SpotlightSource, SpotlightContent } from './spotlights';
export { SPOTLIGHT_CONTENT } from './spotlights';

// Healthcare spending data
export type {
  HealthcareProgram,
  HealthcareSubcategory,
} from './healthcare-spending';
export {
  HEALTHCARE_SPENDING_DATA,
  TOTAL_HHS_SPENDING,
  TOTAL_HEALTHCARE_BENEFICIARIES,
  AVERAGE_PER_BENEFICIARY_COST,
  SPENDING_BY_CATEGORY,
  formatBillions,
  formatPerBeneficiary,
  getProgramByName,
} from './healthcare-spending';

// ICE spending data
export type {
  ICESpendingCategory,
  ICESpendingSubcategory,
  ICEHistoricalData,
  ICESpendingData,
} from './ice-spending';
export {
  ICE_SPENDING_DATA,
  getCategoryTotal,
  getYoYChangePercent,
  calculateAnnualDetentionCost,
} from './ice-spending';
export { default as ICE_SPENDING_DATA_DEFAULT } from './ice-spending';
