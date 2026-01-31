import type { BudgetSpendingItem } from "./departments";

export const VETERANS_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-va-healthcare",
    name: "VA Healthcare",
    amount: 100_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Comprehensive healthcare services for eligible veterans including hospitals, clinics, and community care programs.",
  },
  {
    id: "prog-va-disability",
    name: "VA Disability Compensation",
    amount: 150_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Monthly tax-free payments to veterans with service-connected disabilities and their surviving dependents.",
  },
  {
    id: "prog-gi-bill",
    name: "GI Bill Education",
    amount: 15_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Education benefits for veterans and their dependents, covering tuition, housing, and books for college and vocational training.",
  },
  {
    id: "prog-va-housing",
    name: "VA Housing Loans",
    amount: 3_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Home loan guaranty program helping veterans purchase, build, or refinance homes with favorable terms and no down payment requirements.",
  },
  {
    id: "prog-va-mental-health",
    name: "VA Mental Health",
    amount: 10_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Mental health services including PTSD treatment, substance abuse programs, suicide prevention, and counseling for veterans.",
  },
  {
    id: "prog-veterans-cemeteries",
    name: "Veterans Cemeteries",
    amount: 400_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "National Cemetery Administration",
    description:
      "National cemeteries providing burial and memorial benefits to honor veterans and their eligible family members.",
  },
  {
    id: "prog-veteran-job-training",
    name: "Veteran Job Training",
    amount: 300_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Employment training and transition assistance programs helping veterans develop skills and find civilian careers.",
  },
  {
    id: "prog-caregiver-support",
    name: "Caregiver Support",
    amount: 2_000_000_000,
    tier: "program",
    parentId: "dept-va",
    fiscalYear: 2025,
    source: "Department of Veterans Affairs",
    description:
      "Stipends, training, and support services for family members caring for veterans with serious injuries or illnesses.",
  },
];
