import type { BudgetSpendingItem } from "./departments";

/**
 * Waste & Inefficiency Budget Items
 * Government waste, fraud, and inefficiency as documented by GAO and inspectors general
 */
export const WASTE_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-improper-payments",
    name: "Improper Payments",
    amount: 236_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Government Accountability Office",
    description:
      "Payments made in error, to ineligible recipients, or in incorrect amounts across federal programs including Medicare, Medicaid, and unemployment insurance.",
  },
  {
    id: "prog-expired-programs",
    name: "Expired Authorizations Still Funded",
    amount: 516_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Programs whose congressional authorization has expired but continue to receive appropriations, some expired for over 10 years.",
  },
  {
    id: "prog-duplicative-programs",
    name: "Duplicative Programs",
    amount: 100_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Government Accountability Office",
    description:
      "Estimated cost of overlapping and duplicative federal programs identified in annual GAO reports.",
  },
  {
    id: "prog-tax-gap",
    name: "Tax Gap (Uncollected Taxes)",
    amount: 600_000_000_000,
    tier: "program",
    parentId: "dept-treasury",
    fiscalYear: 2025,
    source: "Internal Revenue Service",
    description:
      "The difference between taxes owed and taxes actually collected, largely due to underreporting, non-filing, and underpayment.",
  },
  {
    id: "prog-pentagon-unaccounted",
    name: "Pentagon Failed Audit",
    amount: 3_800_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense Office of Inspector General",
    description:
      "Total assets the Pentagon cannot fully account for after failing its sixth consecutive audit.",
  },
  {
    id: "prog-farm-subsidies",
    name: "Farm Subsidies",
    amount: 30_000_000_000,
    tier: "program",
    parentId: "dept-usda",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Agricultural subsidies including crop insurance, commodity programs, and conservation payments, often benefiting large agribusinesses.",
  },
  {
    id: "prog-fossil-fuel-subsidies",
    name: "Fossil Fuel Subsidies",
    amount: 20_000_000_000,
    tier: "program",
    parentId: "dept-energy",
    fiscalYear: 2025,
    source: "Environmental and Energy Study Institute",
    description:
      "Tax breaks and direct subsidies to oil, gas, and coal industries including production credits and royalty relief.",
  },
  {
    id: "prog-corporate-tax-breaks",
    name: "Corporate Tax Expenditures",
    amount: 150_000_000_000,
    tier: "program",
    parentId: "dept-treasury",
    fiscalYear: 2025,
    source: "Joint Committee on Taxation",
    description:
      "Tax breaks, loopholes, and deductions that reduce corporate tax liability below statutory rates.",
  },
];
