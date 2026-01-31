import type { BudgetSpendingItem } from "./departments";

export const DEFENSE_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "program-f35",
    name: "F-35 Fighter Program",
    amount: 13_200_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Procurement, development, and sustainment of the F-35 Lightning II Joint Strike Fighter aircraft.",
  },
  {
    id: "program-aircraft-carrier",
    name: "Aircraft Carrier",
    amount: 13_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Construction and acquisition of Ford-class nuclear-powered aircraft carriers.",
  },
  {
    id: "program-nuclear-weapons",
    name: "Nuclear Weapons Maintenance",
    amount: 20_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Maintenance, modernization, and sustainment of the U.S. nuclear weapons stockpile and delivery systems.",
  },
  {
    id: "program-military-personnel",
    name: "Military Personnel",
    amount: 180_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Pay, allowances, and benefits for active duty military personnel across all branches.",
  },
  {
    id: "program-military-healthcare",
    name: "Military Healthcare",
    amount: 55_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "TRICARE health insurance, military hospitals, clinics, and medical services for service members and dependents.",
  },
  {
    id: "program-overseas-operations",
    name: "Overseas Operations",
    amount: 60_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Overseas contingency operations, forward-deployed forces, and international military activities.",
  },
  {
    id: "program-missile-defense",
    name: "Missile Defense",
    amount: 12_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Missile Defense Agency programs including ground-based interceptors, THAAD, Aegis, and space-based sensors.",
  },
  {
    id: "program-cyber-command",
    name: "Cyber Command",
    amount: 15_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "U.S. Cyber Command operations, cybersecurity, and offensive and defensive cyber capabilities.",
  },
  {
    id: "program-special-operations",
    name: "Special Operations",
    amount: 14_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "U.S. Special Operations Command forces, equipment, training, and counter-terrorism operations.",
  },
  {
    id: "program-military-construction",
    name: "Military Construction",
    amount: 10_000_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description:
      "Construction and renovation of military bases, facilities, and family housing worldwide.",
  },
];
