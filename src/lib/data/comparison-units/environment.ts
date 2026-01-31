/**
 * Environment-related comparison units
 * Items for comparing budget amounts to environmental initiatives
 */
import type { ComparisonUnit } from "@/types/comparison";

export const ENVIRONMENT_UNITS: ComparisonUnit[] = [
  {
    id: "env-solar-panel",
    name: "Solar Panel Installations",
    nameSingular: "Solar Panel Installation",
    costPerUnit: 20_000,
    category: "environment",
    description: "Residential solar panel system installation",
    icon: "☀️",
  },
  {
    id: "env-tree-planting",
    name: "Trees Planted",
    nameSingular: "Tree Planted",
    costPerUnit: 50,
    category: "environment",
    description: "Cost to plant and establish a new tree",
    icon: "🌳",
  },
  {
    id: "env-clean-water",
    name: "Households with Clean Water (annual)",
    nameSingular: "Household with Clean Water (annual)",
    costPerUnit: 500,
    period: "year",
    category: "environment",
    description: "Annual cost to provide clean water access to a household",
    icon: "💧",
  },
  {
    id: "env-wind-turbine",
    name: "Wind Turbines",
    nameSingular: "Wind Turbine",
    costPerUnit: 3_000_000,
    category: "environment",
    description: "Commercial-scale wind turbine installation",
    icon: "🌬️",
  },
  {
    id: "env-home-efficiency",
    name: "Home Energy Efficiency Upgrades",
    nameSingular: "Home Energy Efficiency Upgrade",
    costPerUnit: 7_500,
    category: "environment",
    description: "Comprehensive home energy efficiency improvements",
    icon: "🏡",
  },
];
