/**
 * Public Services Comparison Units
 * Salaries and costs for public service roles and infrastructure
 */
import type { ComparisonUnit } from "@/types/comparison";

export const PUBLIC_SERVICES_UNITS: ComparisonUnit[] = [
  {
    id: "firefighter-salary",
    name: "Firefighter Salaries",
    nameSingular: "Firefighter Salary",
    costPerUnit: 55_000,
    period: "year",
    category: "public-services",
    description: "Annual salary for a firefighter",
    icon: "firefighter",
  },
  {
    id: "police-officer-salary",
    name: "Police Officer Salaries",
    nameSingular: "Police Officer Salary",
    costPerUnit: 65_000,
    period: "year",
    category: "public-services",
    description: "Annual salary for a police officer",
    icon: "police",
  },
  {
    id: "911-dispatcher-salary",
    name: "911 Dispatcher Salaries",
    nameSingular: "911 Dispatcher Salary",
    costPerUnit: 45_000,
    period: "year",
    category: "public-services",
    description: "Annual salary for a 911 dispatcher",
    icon: "headset",
  },
  {
    id: "mile-of-broadband",
    name: "Miles of Broadband",
    nameSingular: "Mile of Broadband",
    costPerUnit: 30_000,
    period: "unit",
    category: "public-services",
    description: "Cost to install one mile of broadband infrastructure",
    icon: "wifi",
  },
  {
    id: "library-annual-budget",
    name: "Library Annual Budgets",
    nameSingular: "Library Annual Budget",
    costPerUnit: 500_000,
    period: "year",
    category: "public-services",
    description: "Annual operating budget for a public library",
    icon: "library",
  },
  {
    id: "park-ranger-salary",
    name: "Park Ranger Salaries",
    nameSingular: "Park Ranger Salary",
    costPerUnit: 45_000,
    period: "year",
    category: "public-services",
    description: "Annual salary for a park ranger",
    icon: "tree",
  },
];
