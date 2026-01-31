import type { BudgetSpendingItem } from "./departments";

export const INFRASTRUCTURE_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "program-highway-trust-fund",
    name: "Highway Trust Fund",
    amount: 60_000_000_000,
    tier: "program",
    parentId: "dept-dot",
    fiscalYear: 2025,
    source: "Department of Transportation FY2025 Budget",
    description:
      "Federal funding for highway construction, maintenance, and safety programs distributed to states.",
  },
  {
    id: "program-amtrak",
    name: "Amtrak",
    amount: 2_500_000_000,
    tier: "program",
    parentId: "dept-dot",
    fiscalYear: 2025,
    source: "Department of Transportation FY2025 Budget",
    description:
      "National passenger rail service operating intercity routes across the United States.",
  },
  {
    id: "program-faa",
    name: "FAA",
    amount: 20_000_000_000,
    tier: "program",
    parentId: "dept-dot",
    fiscalYear: 2025,
    source: "Department of Transportation FY2025 Budget",
    description:
      "Federal Aviation Administration managing air traffic control, aviation safety, and airport development.",
  },
  {
    id: "program-army-corps-engineers",
    name: "Army Corps of Engineers",
    amount: 8_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Civil works projects including flood control, navigation, ecosystem restoration, and water infrastructure.",
  },
  {
    id: "program-rural-broadband",
    name: "Rural Broadband",
    amount: 2_000_000_000,
    tier: "program",
    parentId: "dept-usda",
    fiscalYear: 2025,
    source: "Department of Agriculture FY2025 Budget",
    description:
      "Grants and loans to expand high-speed internet access in rural and underserved communities.",
  },
  {
    id: "program-water-infrastructure",
    name: "Water Infrastructure",
    amount: 5_000_000_000,
    tier: "program",
    parentId: "dept-epa",
    fiscalYear: 2025,
    source: "Environmental Protection Agency FY2025 Budget",
    description:
      "Clean Water and Drinking Water State Revolving Funds for water treatment and distribution systems.",
  },
  {
    id: "program-electric-grid",
    name: "Electric Grid",
    amount: 3_000_000_000,
    tier: "program",
    parentId: "dept-energy",
    fiscalYear: 2025,
    source: "Department of Energy FY2025 Budget",
    description:
      "Modernization and resilience programs for the national electric transmission and distribution grid.",
  },
  {
    id: "program-public-transit",
    name: "Public Transit",
    amount: 15_000_000_000,
    tier: "program",
    parentId: "dept-dot",
    fiscalYear: 2025,
    source: "Department of Transportation FY2025 Budget",
    description:
      "Federal Transit Administration grants for buses, rail, and other public transportation systems.",
  },
];
