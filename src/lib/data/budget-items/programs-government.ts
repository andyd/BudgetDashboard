import type { BudgetSpendingItem } from "./departments";

/**
 * Government Operations Budget Items
 * Federal government operational costs that are often debated
 */
export const GOVERNMENT_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-congressional-operations",
    name: "Congressional Operations",
    amount: 5_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Total operating budget for the U.S. Congress including staff, facilities, and support services.",
  },
  {
    id: "prog-congressional-salaries",
    name: "Congressional Salaries",
    amount: 100_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Congressional Research Service",
    description:
      "Combined annual salaries for all 535 members of Congress at $174,000 each.",
  },
  {
    id: "prog-secret-service",
    name: "Secret Service",
    amount: 3_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Presidential and dignitary protection, financial crimes investigation, and cybersecurity operations.",
  },
  {
    id: "prog-white-house-operations",
    name: "White House Operations",
    amount: 450_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Executive Office of the President Budget",
    description:
      "Annual operating budget for the Executive Office of the President including staff, maintenance, and operations.",
  },
  {
    id: "prog-presidential-travel",
    name: "Presidential Travel",
    amount: 100_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Government Accountability Office",
    description:
      "Annual costs for presidential domestic and international travel including Air Force One, Secret Service, and logistics.",
  },
  {
    id: "prog-air-force-one",
    name: "Air Force One Fleet",
    amount: 200_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "U.S. Air Force",
    description:
      "Annual operating and maintenance costs for the Air Force One fleet including fuel, crew, and security.",
  },
];
