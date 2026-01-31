import type { BudgetSpendingItem } from "./departments";

export const HOMELAND_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-ice-total",
    name: "ICE Total Budget",
    amount: 9_520_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Immigration and Customs Enforcement total operations including enforcement, removal, and detention.",
  },
  {
    id: "prog-ice-detention",
    name: "ICE Detention Operations",
    amount: 3_500_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Custody operations for detained individuals including facilities, transportation, and medical care.",
  },
  {
    id: "prog-ice-ero",
    name: "ICE Enforcement & Removal",
    amount: 5_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Enforcement and Removal Operations including arrests, deportation flights, and fugitive operations.",
  },
  {
    id: "prog-cbp-border-patrol",
    name: "CBP Border Patrol",
    amount: 18_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Customs and Border Protection patrol operations, surveillance, and border security between ports of entry.",
  },
  {
    id: "prog-tsa",
    name: "TSA",
    amount: 10_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Transportation Security Administration airport screening, air marshals, and transportation security.",
  },
  {
    id: "prog-coast-guard",
    name: "Coast Guard",
    amount: 14_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Maritime law enforcement, search and rescue, port security, and coastal defense operations.",
  },
  {
    id: "prog-fema",
    name: "FEMA",
    amount: 30_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Federal Emergency Management Agency disaster relief, preparedness grants, and flood insurance.",
  },
  {
    id: "prog-border-wall",
    name: "Border Wall Construction",
    amount: 1_200_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Construction and maintenance of physical barriers along the U.S.-Mexico border.",
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
      "Presidential and dignitary protection, financial crimes investigation, and cybersecurity.",
  },
  {
    id: "prog-cisa",
    name: "Cybersecurity (CISA)",
    amount: 3_000_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description:
      "Cybersecurity and Infrastructure Security Agency protecting critical infrastructure and federal networks.",
  },
];
