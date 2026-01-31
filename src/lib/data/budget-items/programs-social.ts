import type { BudgetSpendingItem } from "./departments";

export const SOCIAL_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-medicare",
    name: "Medicare",
    amount: 850_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Federal health insurance program for Americans aged 65 and older and certain younger people with disabilities.",
  },
  {
    id: "prog-medicaid",
    name: "Medicaid",
    amount: 600_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Joint federal-state program providing health coverage to low-income individuals, families, and people with disabilities.",
  },
  {
    id: "prog-ssdi",
    name: "Social Security Disability",
    amount: 150_000_000_000,
    tier: "program",
    parentId: "dept-ssa",
    fiscalYear: 2025,
    source: "Social Security Administration",
    description:
      "Federal insurance program providing monthly benefits to workers who become disabled and can no longer work.",
  },
  {
    id: "prog-snap",
    name: "SNAP Benefits",
    amount: 119_000_000_000,
    tier: "program",
    parentId: "dept-usda",
    fiscalYear: 2025,
    source: "USDA Food and Nutrition Service",
    description:
      "Supplemental Nutrition Assistance Program providing food-purchasing assistance to low-income individuals and families.",
  },
  {
    id: "prog-section8",
    name: "Section 8 Housing",
    amount: 30_000_000_000,
    tier: "program",
    parentId: "dept-hud",
    fiscalYear: 2025,
    source: "HUD Budget FY2025",
    description:
      "Housing Choice Voucher program providing rental assistance to low-income families, the elderly, and disabled individuals.",
  },
  {
    id: "prog-pell-grants",
    name: "Pell Grants",
    amount: 22_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal grants for undergraduate students with demonstrated financial need, typically not requiring repayment.",
  },
  {
    id: "prog-chip",
    name: "CHIP",
    amount: 18_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Children's Health Insurance Program providing low-cost health coverage to children in families who earn too much for Medicaid but cannot afford private coverage.",
  },
  {
    id: "prog-tanf",
    name: "TANF",
    amount: 16_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "HHS Administration for Children and Families",
    description:
      "Temporary Assistance for Needy Families providing cash assistance and work support to low-income families with children.",
  },
  {
    id: "prog-head-start",
    name: "Head Start",
    amount: 12_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "HHS Administration for Children and Families",
    description:
      "Comprehensive early childhood education, health, nutrition, and parent involvement services for low-income children and families.",
  },
  {
    id: "prog-wic",
    name: "WIC",
    amount: 6_000_000_000,
    tier: "program",
    parentId: "dept-usda",
    fiscalYear: 2025,
    source: "USDA Food and Nutrition Service",
    description:
      "Special Supplemental Nutrition Program for Women, Infants, and Children providing food, nutrition education, and healthcare referrals.",
  },
  {
    id: "prog-liheap",
    name: "LIHEAP",
    amount: 4_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "HHS Administration for Children and Families",
    description:
      "Low Income Home Energy Assistance Program helping low-income households pay for heating and cooling costs.",
  },
];
