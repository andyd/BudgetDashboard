/**
 * Healthcare Spending Data - HHS Budget Breakdown
 * Source: Department of Health and Human Services FY2024 estimates
 * All amounts in billions unless otherwise specified
 */

export interface HealthcareProgram {
  name: string;
  amount: number; // in billions
  description: string;
  beneficiaries?: number; // number of people covered
  perBeneficiaryCost?: number; // annual cost per person
  category: 'entitlement' | 'discretionary' | 'grant';
  subcategories?: HealthcareSubcategory[];
}

export interface HealthcareSubcategory {
  name: string;
  amount: number;
  description: string;
}

export const HEALTHCARE_SPENDING_DATA: HealthcareProgram[] = [
  {
    name: 'Medicare',
    amount: 900,
    description: 'Federal health insurance for people 65+ and certain younger people with disabilities',
    beneficiaries: 65_000_000,
    perBeneficiaryCost: 13_846,
    category: 'entitlement',
    subcategories: [
      {
        name: 'Part A - Hospital Insurance',
        amount: 330,
        description: 'Inpatient hospital care, skilled nursing facility, hospice, home health'
      },
      {
        name: 'Part B - Medical Insurance',
        amount: 380,
        description: 'Doctor visits, outpatient care, medical supplies, preventive services'
      },
      {
        name: 'Part C - Medicare Advantage',
        amount: 120,
        description: 'Private plan alternative that includes Parts A and B coverage'
      },
      {
        name: 'Part D - Prescription Drugs',
        amount: 70,
        description: 'Prescription drug coverage through private plans'
      }
    ]
  },
  {
    name: 'Medicaid',
    amount: 600,
    description: 'Federal share of joint federal-state program providing health coverage to low-income individuals',
    beneficiaries: 85_000_000,
    perBeneficiaryCost: 7_059,
    category: 'entitlement',
    subcategories: [
      {
        name: 'Medical Services',
        amount: 420,
        description: 'Physician services, hospital care, pharmacy, medical equipment'
      },
      {
        name: 'Long-term Care',
        amount: 130,
        description: 'Nursing homes, home and community-based services'
      },
      {
        name: 'DSH Payments',
        amount: 30,
        description: 'Disproportionate Share Hospital payments for hospitals serving low-income patients'
      },
      {
        name: 'Administrative Costs',
        amount: 20,
        description: 'Program administration and oversight'
      }
    ]
  },
  {
    name: 'National Institutes of Health (NIH)',
    amount: 48,
    description: 'Medical research agency conducting and funding biomedical research',
    category: 'discretionary',
    subcategories: [
      {
        name: 'Cancer Research (NCI)',
        amount: 7.2,
        description: 'National Cancer Institute - cancer research and training'
      },
      {
        name: 'Heart, Lung & Blood (NHLBI)',
        amount: 4.1,
        description: 'Research on cardiovascular and respiratory diseases'
      },
      {
        name: 'Allergy & Infectious Disease (NIAID)',
        amount: 6.8,
        description: 'Research on infectious, immunologic, and allergic diseases'
      },
      {
        name: 'General Medical Sciences (NIGMS)',
        amount: 3.2,
        description: 'Basic biomedical research and research training'
      },
      {
        name: 'Other Institutes',
        amount: 26.7,
        description: '23 other institutes and centers covering various health areas'
      }
    ]
  },
  {
    name: "Children's Health Insurance Program (CHIP)",
    amount: 20,
    description: 'Federal funding for state programs covering uninsured children in families with incomes too high for Medicaid',
    beneficiaries: 7_000_000,
    perBeneficiaryCost: 2_857,
    category: 'entitlement'
  },
  {
    name: 'Health Resources and Services Administration (HRSA)',
    amount: 15,
    description: 'Improving access to healthcare services for underserved populations',
    category: 'discretionary',
    subcategories: [
      {
        name: 'Community Health Centers',
        amount: 6.5,
        description: 'Funding for federally qualified health centers serving underserved areas'
      },
      {
        name: 'Ryan White HIV/AIDS Program',
        amount: 2.4,
        description: 'HIV/AIDS care and treatment services'
      },
      {
        name: 'Maternal and Child Health',
        amount: 2.0,
        description: 'Programs supporting mothers, children, and families'
      },
      {
        name: 'Health Workforce Programs',
        amount: 1.8,
        description: 'Training and recruitment of health professionals'
      },
      {
        name: 'Other Programs',
        amount: 2.3,
        description: 'Organ transplantation, rural health, poison control'
      }
    ]
  },
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    amount: 12,
    description: 'National public health agency protecting America from health, safety and security threats',
    category: 'discretionary',
    subcategories: [
      {
        name: 'Infectious Disease',
        amount: 3.8,
        description: 'Disease surveillance, outbreak response, immunization programs'
      },
      {
        name: 'Chronic Disease Prevention',
        amount: 1.5,
        description: 'Programs addressing heart disease, cancer, diabetes, obesity'
      },
      {
        name: 'Environmental Health',
        amount: 0.8,
        description: 'Tracking environmental health hazards'
      },
      {
        name: 'Injury Prevention',
        amount: 0.7,
        description: 'Opioid overdose prevention, motor vehicle safety'
      },
      {
        name: 'Global Health',
        amount: 0.6,
        description: 'International disease surveillance and response'
      },
      {
        name: 'Public Health Infrastructure',
        amount: 4.6,
        description: 'Lab capacity, data systems, workforce training, emergency preparedness'
      }
    ]
  },
  {
    name: 'Substance Abuse and Mental Health Services Administration (SAMHSA)',
    amount: 8,
    description: 'Advancing behavioral health nationwide through treatment and prevention services',
    category: 'discretionary',
    subcategories: [
      {
        name: 'Mental Health Programs',
        amount: 3.5,
        description: 'Community mental health services, suicide prevention, crisis services'
      },
      {
        name: 'Substance Abuse Prevention',
        amount: 2.2,
        description: 'Prevention programs, state grants, community initiatives'
      },
      {
        name: 'Substance Abuse Treatment',
        amount: 2.0,
        description: 'Opioid treatment programs, recovery support services'
      },
      {
        name: 'Health Surveillance',
        amount: 0.3,
        description: 'Data collection on mental health and substance use'
      }
    ]
  },
  {
    name: 'Indian Health Service (IHS)',
    amount: 7,
    description: 'Providing federal health services to American Indians and Alaska Natives',
    beneficiaries: 2_600_000,
    perBeneficiaryCost: 2_692,
    category: 'discretionary',
    subcategories: [
      {
        name: 'Clinical Services',
        amount: 4.2,
        description: 'Direct healthcare services at IHS facilities'
      },
      {
        name: 'Preventive Health',
        amount: 1.2,
        description: 'Public health nursing, health education, community programs'
      },
      {
        name: 'Facilities Construction',
        amount: 0.9,
        description: 'Construction and maintenance of health facilities'
      },
      {
        name: 'Contract Support',
        amount: 0.7,
        description: 'Tribal self-governance program support'
      }
    ]
  },
  {
    name: 'Food and Drug Administration (FDA)',
    amount: 7,
    description: 'Protecting public health by ensuring safety of food, drugs, medical devices, and cosmetics',
    category: 'discretionary',
    subcategories: [
      {
        name: 'Drug Safety and Innovation',
        amount: 2.5,
        description: 'New drug approvals, generic drug review, drug safety monitoring'
      },
      {
        name: 'Food Safety',
        amount: 1.8,
        description: 'Food safety inspections, standards, outbreak response'
      },
      {
        name: 'Medical Devices',
        amount: 1.2,
        description: 'Medical device approval and safety monitoring'
      },
      {
        name: 'Biologics',
        amount: 0.9,
        description: 'Vaccines, blood products, cell and gene therapies'
      },
      {
        name: 'Tobacco Regulation',
        amount: 0.6,
        description: 'Tobacco product regulation and enforcement'
      }
    ]
  }
];

// Calculate total HHS spending
export const TOTAL_HHS_SPENDING = HEALTHCARE_SPENDING_DATA.reduce(
  (sum, program) => sum + program.amount,
  0
);

// Calculate total beneficiaries across programs
export const TOTAL_HEALTHCARE_BENEFICIARIES = HEALTHCARE_SPENDING_DATA.reduce(
  (sum, program) => sum + (program.beneficiaries || 0),
  0
);

// Average per-beneficiary cost across all programs
export const AVERAGE_PER_BENEFICIARY_COST = Math.round(
  (HEALTHCARE_SPENDING_DATA.reduce(
    (sum, program) => sum + (program.perBeneficiaryCost || 0) * (program.beneficiaries || 0),
    0
  ) / TOTAL_HEALTHCARE_BENEFICIARIES) || 0
);

// Breakdown by category
export const SPENDING_BY_CATEGORY = {
  entitlement: HEALTHCARE_SPENDING_DATA
    .filter(p => p.category === 'entitlement')
    .reduce((sum, p) => sum + p.amount, 0),
  discretionary: HEALTHCARE_SPENDING_DATA
    .filter(p => p.category === 'discretionary')
    .reduce((sum, p) => sum + p.amount, 0),
  grant: HEALTHCARE_SPENDING_DATA
    .filter(p => p.category === 'grant')
    .reduce((sum, p) => sum + p.amount, 0)
};

// Helper function to format currency
export const formatBillions = (amount: number): string => {
  return `$${amount.toFixed(1)}B`;
};

// Helper function to format per-beneficiary cost
export const formatPerBeneficiary = (cost: number): string => {
  return `$${cost.toLocaleString()}`;
};

// Helper function to get program by name
export const getProgramByName = (name: string): HealthcareProgram | undefined => {
  return HEALTHCARE_SPENDING_DATA.find(p => p.name === name);
};
