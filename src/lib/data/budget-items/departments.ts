export interface BudgetSpendingItem {
  id: string;
  name: string;
  amount: number;
  tier: "department" | "program" | "current-event";
  parentId?: string;
  fiscalYear: number;
  source: string;
  description: string;
}

export const DEPARTMENT_ITEMS: BudgetSpendingItem[] = [
  {
    id: "dept-defense",
    name: "Department of Defense",
    amount: 895_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Military personnel, operations, maintenance, procurement, research and development, and military construction.",
  },
  {
    id: "dept-hhs",
    name: "Health & Human Services",
    amount: 1_802_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Medicare, Medicaid, CHIP, NIH, CDC, FDA, and other health and social services programs.",
  },
  {
    id: "dept-ssa",
    name: "Social Security Administration",
    amount: 1_500_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Old-Age and Survivors Insurance (OASI), Disability Insurance (DI), and Supplemental Security Income (SSI).",
  },
  {
    id: "dept-treasury",
    name: "Treasury / Net Interest",
    amount: 1_050_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Interest payments on the national debt, IRS operations, and financial management of the federal government.",
  },
  {
    id: "dept-va",
    name: "Veterans Affairs",
    amount: 323_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Healthcare, benefits, and memorial services for veterans and their families.",
  },
  {
    id: "dept-usda",
    name: "Department of Agriculture",
    amount: 224_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "SNAP (food stamps), crop insurance, farm subsidies, rural development, and food safety programs.",
  },
  {
    id: "dept-dhs",
    name: "Homeland Security",
    amount: 116_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Border security, immigration enforcement, TSA, FEMA, Coast Guard, Secret Service, and cybersecurity.",
  },
  {
    id: "dept-dot",
    name: "Department of Transportation",
    amount: 105_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Highways, aviation, rail, transit, maritime, and pipeline safety programs.",
  },
  {
    id: "dept-hud",
    name: "Housing and Urban Development",
    amount: 70_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Public housing, Section 8 vouchers, FHA mortgage insurance, and community development programs.",
  },
  {
    id: "dept-state",
    name: "Department of State",
    amount: 60_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Diplomacy, foreign assistance, embassy operations, and international organizations.",
  },
  {
    id: "dept-energy",
    name: "Department of Energy",
    amount: 52_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Nuclear weapons maintenance, national laboratories, energy research, and renewable energy programs.",
  },
  {
    id: "dept-justice",
    name: "Department of Justice",
    amount: 40_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "FBI, DEA, ATF, federal prisons, U.S. Attorneys, and civil rights enforcement.",
  },
  {
    id: "dept-education",
    name: "Department of Education",
    amount: 35_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Pell Grants, student loans, Title I funding, special education, and education research.",
  },
  {
    id: "dept-nasa",
    name: "NASA",
    amount: 25_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Space exploration, aeronautics research, Earth science, and technology development.",
  },
  {
    id: "dept-epa",
    name: "Environmental Protection Agency",
    amount: 10_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Environmental regulation, pollution control, Superfund cleanup, and water infrastructure grants.",
  },
];
