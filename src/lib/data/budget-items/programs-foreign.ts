import type { BudgetSpendingItem } from "./departments";

/**
 * Foreign Spending Budget Items
 * International aid, military assistance, and diplomatic operations
 */
export const FOREIGN_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-foreign-military-aid",
    name: "Foreign Military Aid",
    amount: 18_000_000_000,
    tier: "program",
    parentId: "dept-state",
    fiscalYear: 2025,
    source: "Department of State Budget",
    description:
      "Military assistance, weapons, and training provided to foreign allies and partners.",
  },
  {
    id: "prog-military-aid-israel",
    name: "Military Aid to Israel",
    amount: 3_800_000_000,
    tier: "program",
    parentId: "dept-state",
    fiscalYear: 2025,
    source: "Congressional Research Service",
    description:
      "Annual military assistance to Israel, the largest recipient of U.S. foreign military aid.",
  },
  {
    id: "prog-military-aid-egypt",
    name: "Military Aid to Egypt",
    amount: 1_300_000_000,
    tier: "program",
    parentId: "dept-state",
    fiscalYear: 2025,
    source: "Congressional Research Service",
    description:
      "Annual military assistance to Egypt, the second-largest recipient of U.S. foreign military aid.",
  },
  {
    id: "prog-foreign-economic-aid",
    name: "Foreign Economic Aid",
    amount: 30_000_000_000,
    tier: "program",
    parentId: "dept-state",
    fiscalYear: 2025,
    source: "USAID Budget",
    description:
      "Non-military foreign assistance including development aid, humanitarian relief, and global health programs.",
  },
  {
    id: "prog-embassy-operations",
    name: "Embassy Operations",
    amount: 16_000_000_000,
    tier: "program",
    parentId: "dept-state",
    fiscalYear: 2025,
    source: "Department of State Budget",
    description:
      "Operating costs for U.S. embassies, consulates, and diplomatic missions in over 270 locations worldwide.",
  },
];
