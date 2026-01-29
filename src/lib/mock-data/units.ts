/**
 * Mock comparison units data
 * In production, this would come from the database
 */
import type { ComparisonUnit } from '@/types/comparison';

export const mockUnits: ComparisonUnit[] = [
  // Infrastructure
  {
    id: '1',
    name: 'Eiffel Towers',
    nameSingular: 'Eiffel Tower',
    costPerUnit: 1_500_000_000, // $1.5B construction cost (inflation adjusted)
    category: 'infrastructure',
    description: 'Iconic steel tower in Paris, France',
    icon: '🗼',
  },
  {
    id: '2',
    name: 'Golden Gate Bridges',
    nameSingular: 'Golden Gate Bridge',
    costPerUnit: 1_900_000_000, // ~$1.9B in today's dollars
    category: 'infrastructure',
    description: 'Suspension bridge in San Francisco',
    icon: '🌉',
  },
  {
    id: '3',
    name: 'Olympic Swimming Pools',
    nameSingular: 'Olympic Swimming Pool',
    costPerUnit: 50_000_000, // $50M for world-class pool
    category: 'infrastructure',
    description: '50m x 25m Olympic-size pool',
    icon: '🏊',
  },
  {
    id: '4',
    name: 'Football Fields',
    nameSingular: 'Football Field',
    costPerUnit: 5_000_000, // $5M for quality field with facilities
    category: 'infrastructure',
    description: 'Standard NFL-sized football field',
    icon: '🏈',
  },

  // Vehicles
  {
    id: '5',
    name: 'F-35 Fighter Jets',
    nameSingular: 'F-35 Fighter Jet',
    costPerUnit: 100_000_000, // ~$100M per aircraft
    category: 'vehicles',
    description: 'Advanced stealth multirole fighter',
    icon: '✈️',
  },
  {
    id: '6',
    name: 'M1 Abrams Tanks',
    nameSingular: 'M1 Abrams Tank',
    costPerUnit: 9_000_000, // ~$9M per tank
    category: 'vehicles',
    description: 'Main battle tank of the US Army',
    icon: '🪖',
  },
  {
    id: '7',
    name: 'Tesla Model 3s',
    nameSingular: 'Tesla Model 3',
    costPerUnit: 40_000, // Base price ~$40k
    category: 'vehicles',
    description: 'Popular electric sedan',
    icon: '🚗',
  },

  // Buildings
  {
    id: '8',
    name: 'New Public Schools',
    nameSingular: 'New Public School',
    costPerUnit: 50_000_000, // ~$50M for 500-student school
    category: 'buildings',
    description: 'Modern K-12 public school building',
    icon: '🏫',
  },
  {
    id: '9',
    name: 'Public Libraries',
    nameSingular: 'Public Library',
    costPerUnit: 15_000_000, // ~$15M for mid-sized library
    category: 'buildings',
    description: 'Community library with modern facilities',
    icon: '📚',
  },
  {
    id: '10',
    name: 'Community Health Centers',
    nameSingular: 'Community Health Center',
    costPerUnit: 25_000_000, // ~$25M for health center
    category: 'buildings',
    description: 'Primary care facility',
    icon: '🏥',
  },

  // Everyday Items
  {
    id: '11',
    name: 'Cups of Coffee',
    nameSingular: 'Cup of Coffee',
    costPerUnit: 5, // $5 for a latte
    category: 'everyday',
    description: 'Average specialty coffee drink',
    icon: '☕',
  },
  {
    id: '12',
    name: 'Big Macs',
    nameSingular: 'Big Mac',
    costPerUnit: 5.5, // ~$5.50 average
    category: 'everyday',
    description: "McDonald's signature burger",
    icon: '🍔',
  },
  {
    id: '13',
    name: 'Movie Tickets',
    nameSingular: 'Movie Ticket',
    costPerUnit: 15, // ~$15 average
    category: 'everyday',
    description: 'Standard cinema admission',
    icon: '🎬',
  },
  {
    id: '14',
    name: 'iPhones',
    nameSingular: 'iPhone',
    costPerUnit: 1000, // ~$1000 for Pro model
    category: 'everyday',
    description: 'Latest iPhone Pro model',
    icon: '📱',
  },

  // Miscellaneous
  {
    id: '15',
    name: 'Teacher Salaries (annual)',
    nameSingular: 'Teacher Salary (annual)',
    costPerUnit: 65_000, // Median US teacher salary
    category: 'misc',
    description: 'Median annual teacher salary',
    icon: '👨‍🏫',
  },
  {
    id: '16',
    name: 'Nurse Salaries (annual)',
    nameSingular: 'Nurse Salary (annual)',
    costPerUnit: 85_000, // Median RN salary
    category: 'misc',
    description: 'Median annual registered nurse salary',
    icon: '👩‍⚕️',
  },
  {
    id: '17',
    name: 'Median US Household Income (annual)',
    nameSingular: 'Median US Household Income (annual)',
    costPerUnit: 75_000, // ~$75k median
    category: 'misc',
    description: 'US median household income',
    icon: '🏠',
  },
];

/**
 * Get all units, optionally filtered by category
 */
export function getUnits(category?: string): ComparisonUnit[] {
  if (!category) {
    return mockUnits;
  }
  return mockUnits.filter((unit) => unit.category === category);
}

/**
 * Get a single unit by ID
 */
export function getUnitById(id: string): ComparisonUnit | undefined {
  return mockUnits.find((unit) => unit.id === id);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(mockUnits.map((unit) => unit.category)));
}
