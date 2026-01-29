/**
 * ICE Spending Data
 * U.S. Immigration and Customs Enforcement Budget Breakdown
 *
 * Focus Area: Detailed breakdown of enforcement, detention, and operational costs
 * Sources: DHS Budget documentation, Congressional appropriations
 */

export interface ICESpendingCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  yoyChange: number;
  yoyChangePercent: number;
  description: string;
  subcategories?: ICESpendingSubcategory[];
}

export interface ICESpendingSubcategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  description: string;
  metrics?: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
}

export interface ICEHistoricalData {
  year: number;
  totalBudget: number;
  enforcement: number;
  detention: number;
  investigations: number;
  avgDailyDetention: number;
  deportations: number;
}

export interface ICESpendingData {
  fiscalYear: number;
  totalBudget: number;
  lastUpdated: string;
  categories: ICESpendingCategory[];
  historicalData: ICEHistoricalData[];
  keyMetrics: {
    label: string;
    value: string | number;
    change?: string;
    description: string;
  }[];
}

export const ICE_SPENDING_DATA: ICESpendingData = {
  fiscalYear: 2025,
  totalBudget: 9_516_000_000, // $9.516 billion
  lastUpdated: "2025-01-29",

  categories: [
    {
      id: "enforcement-removal",
      name: "Enforcement and Removal Operations (ERO)",
      amount: 5_040_000_000,
      percentage: 53.0,
      yoyChange: 780_000_000,
      yoyChangePercent: 18.3,
      description:
        "Custody operations, transportation, removal, and alternatives to detention",
      subcategories: [
        {
          id: "detention-custody",
          name: "Detention and Custody Operations",
          amount: 3_420_000_000,
          percentage: 67.9,
          description:
            "Daily detention operations across ICE facilities and contracted centers",
          metrics: [
            {
              label: "Average Daily Population (ADP)",
              value: 41_500,
              unit: "detainees",
            },
            {
              label: "Daily Cost Per Detainee",
              value: 150.75,
              unit: "$/day",
            },
            {
              label: "Annual Cost Per Detainee",
              value: 55_024,
              unit: "$/year",
            },
            {
              label: "Detention Bed Days",
              value: "15.1 million",
              unit: "annually",
            },
          ],
        },
        {
          id: "transportation-removal",
          name: "Transportation and Removal",
          amount: 892_000_000,
          percentage: 17.7,
          description:
            "Air and ground transportation for detainees, removals, and deportation operations",
          metrics: [
            {
              label: "ICE Air Operations Flights",
              value: "4,200+",
              unit: "annually",
            },
            {
              label: "Average Removal Cost",
              value: 10_854,
              unit: "$/person",
            },
            {
              label: "Projected Removals",
              value: 142_000,
              unit: "FY2025",
            },
          ],
        },
        {
          id: "alternatives-detention",
          name: "Alternatives to Detention (ATD)",
          amount: 448_000_000,
          percentage: 8.9,
          description:
            "GPS monitoring, case management, and SmartLINK mobile app supervision",
          metrics: [
            {
              label: "Participants Monitored",
              value: 182_500,
              unit: "individuals",
            },
            {
              label: "Daily Cost Per Participant",
              value: 4.12,
              unit: "$/day",
            },
            {
              label: "Cost Savings vs Detention",
              value: "97.3%",
              unit: "lower",
            },
          ],
        },
        {
          id: "fugitive-operations",
          name: "Fugitive Operations",
          amount: 280_000_000,
          percentage: 5.6,
          description:
            "Apprehension teams, warrant execution, and enforcement operations",
          metrics: [
            {
              label: "Fugitive Operations Teams",
              value: 74,
              unit: "nationwide",
            },
            {
              label: "Administrative Arrests",
              value: "~170,000",
              unit: "projected FY2025",
            },
          ],
        },
      ],
    },
    {
      id: "homeland-security-investigations",
      name: "Homeland Security Investigations (HSI)",
      amount: 2_476_000_000,
      percentage: 26.0,
      yoyChange: 156_000_000,
      yoyChangePercent: 6.7,
      description:
        "Criminal investigations, counter-proliferation, transnational crime, and cybercrime",
      subcategories: [
        {
          id: "border-enforcement",
          name: "Border Enforcement Security Task Forces (BEST)",
          amount: 892_000_000,
          percentage: 36.0,
          description:
            "Multi-agency task forces targeting transnational criminal organizations",
          metrics: [
            {
              label: "BEST Task Forces",
              value: 86,
              unit: "locations",
            },
            {
              label: "Criminal Investigations",
              value: "27,000+",
              unit: "annually",
            },
          ],
        },
        {
          id: "human-trafficking",
          name: "Human Trafficking & Smuggling",
          amount: 618_000_000,
          percentage: 25.0,
          description:
            "Investigations into human trafficking, child exploitation, and smuggling networks",
          metrics: [
            {
              label: "Trafficking Arrests",
              value: "2,100+",
              unit: "FY2025",
            },
            {
              label: "Victims Identified/Assisted",
              value: "1,800+",
              unit: "annually",
            },
          ],
        },
        {
          id: "transnational-gangs",
          name: "Transnational Gang Enforcement",
          amount: 446_000_000,
          percentage: 18.0,
          description:
            "Operations targeting MS-13, cartels, and international gang networks",
          metrics: [
            {
              label: "Gang Member Arrests",
              value: "4,600+",
              unit: "FY2025",
            },
          ],
        },
        {
          id: "cyber-financial-crimes",
          name: "Cyber and Financial Crimes",
          amount: 372_000_000,
          percentage: 15.0,
          description:
            "Money laundering, trade-based money laundering, and cyber investigations",
          metrics: [
            {
              label: "Financial Seizures",
              value: "$1.2B+",
              unit: "FY2025",
            },
          ],
        },
        {
          id: "counter-proliferation",
          name: "Export Enforcement & Counter-Proliferation",
          amount: 148_000_000,
          percentage: 6.0,
          description:
            "Preventing illegal export of weapons, technology, and sensitive materials",
          metrics: [
            {
              label: "Export Violation Cases",
              value: "800+",
              unit: "annually",
            },
          ],
        },
      ],
    },
    {
      id: "management-administration",
      name: "Management and Administration",
      amount: 486_000_000,
      percentage: 5.1,
      yoyChange: 28_000_000,
      yoyChangePercent: 6.1,
      description:
        "Leadership, human resources, financial management, and mission support",
      subcategories: [
        {
          id: "personnel-training",
          name: "Personnel and Training",
          amount: 194_000_000,
          percentage: 39.9,
          description: "HR operations, recruitment, and training programs",
          metrics: [
            {
              label: "Total ICE Employees",
              value: "~21,000",
              unit: "FTEs",
            },
          ],
        },
        {
          id: "facilities-infrastructure",
          name: "Facilities and Infrastructure",
          amount: 146_000_000,
          percentage: 30.0,
          description:
            "Office space, operational facilities, and infrastructure maintenance",
        },
        {
          id: "it-systems",
          name: "IT Systems and Modernization",
          amount: 97_000_000,
          percentage: 20.0,
          description:
            "Technology infrastructure, case management systems, and modernization",
        },
        {
          id: "legal-services",
          name: "Legal Services",
          amount: 49_000_000,
          percentage: 10.1,
          description: "Office of Principal Legal Advisor support",
        },
      ],
    },
    {
      id: "facility-construction",
      name: "Detention Facility Construction & Expansion",
      amount: 842_000_000,
      percentage: 8.8,
      yoyChange: 612_000_000,
      yoyChangePercent: 266.1,
      description:
        "New facility construction, bed space expansion, and major renovations",
      subcategories: [
        {
          id: "new-facilities",
          name: "New Detention Centers",
          amount: 568_000_000,
          percentage: 67.5,
          description:
            "Construction of new ICE detention facilities to increase capacity",
          metrics: [
            {
              label: "New Beds Planned",
              value: "8,500+",
              unit: "beds",
            },
            {
              label: "Facilities Under Construction",
              value: 4,
              unit: "sites",
            },
          ],
        },
        {
          id: "facility-renovations",
          name: "Facility Upgrades and Renovations",
          amount: 186_000_000,
          percentage: 22.1,
          description:
            "Modernization of existing facilities, safety improvements, and compliance",
        },
        {
          id: "infrastructure-improvements",
          name: "Infrastructure and Security Enhancements",
          amount: 88_000_000,
          percentage: 10.4,
          description:
            "Security systems, medical facilities, and operational infrastructure",
        },
      ],
    },
    {
      id: "legal-proceedings",
      name: "Legal Proceedings Support",
      amount: 382_000_000,
      percentage: 4.0,
      yoyChange: 48_000_000,
      yoyChangePercent: 14.4,
      description:
        "Immigration court support, legal representation costs, and case processing",
      subcategories: [
        {
          id: "detention-legal-support",
          name: "Detention Legal Support",
          amount: 191_000_000,
          percentage: 50.0,
          description:
            "Legal coordination for detained individuals in proceedings",
        },
        {
          id: "removal-proceedings",
          name: "Removal Proceedings Management",
          amount: 115_000_000,
          percentage: 30.1,
          description:
            "Case management and coordination with immigration courts",
        },
        {
          id: "appeals-litigation",
          name: "Appeals and Litigation",
          amount: 76_000_000,
          percentage: 19.9,
          description:
            "Legal appeals, habeas corpus cases, and federal litigation",
        },
      ],
    },
    {
      id: "medical-health-services",
      name: "Medical and Health Services",
      amount: 290_000_000,
      percentage: 3.0,
      yoyChange: 34_000_000,
      yoyChangePercent: 13.3,
      description:
        "Healthcare for detainees, mental health services, and medical operations",
      subcategories: [
        {
          id: "medical-care",
          name: "Medical Care and Treatment",
          amount: 174_000_000,
          percentage: 60.0,
          description:
            "Primary care, emergency services, and ongoing medical treatment",
          metrics: [
            {
              label: "Healthcare Providers",
              value: "~450",
              unit: "contracted medical staff",
            },
          ],
        },
        {
          id: "mental-health",
          name: "Mental Health Services",
          amount: 87_000_000,
          percentage: 30.0,
          description:
            "Psychological services, crisis intervention, and counseling",
        },
        {
          id: "pharmaceutical",
          name: "Pharmaceutical and Medical Supplies",
          amount: 29_000_000,
          percentage: 10.0,
          description: "Medications, medical equipment, and supplies",
        },
      ],
    },
  ],

  historicalData: [
    {
      year: 2020,
      totalBudget: 8_058_000_000,
      enforcement: 4_240_000_000,
      detention: 2_810_000_000,
      investigations: 2_182_000_000,
      avgDailyDetention: 38_200,
      deportations: 185_884,
    },
    {
      year: 2021,
      totalBudget: 7_982_000_000,
      enforcement: 3_960_000_000,
      detention: 2_550_000_000,
      investigations: 2_207_000_000,
      avgDailyDetention: 22_100,
      deportations: 59_011,
    },
    {
      year: 2022,
      totalBudget: 8_149_000_000,
      enforcement: 4_108_000_000,
      detention: 2_680_000_000,
      investigations: 2_254_000_000,
      avgDailyDetention: 23_500,
      deportations: 72_177,
    },
    {
      year: 2023,
      totalBudget: 8_518_000_000,
      enforcement: 4_410_000_000,
      detention: 2_920_000_000,
      investigations: 2_298_000_000,
      avgDailyDetention: 31_200,
      deportations: 142_580,
    },
    {
      year: 2024,
      totalBudget: 8_736_000_000,
      enforcement: 4_260_000_000,
      detention: 2_840_000_000,
      investigations: 2_320_000_000,
      avgDailyDetention: 37_800,
      deportations: 155_400,
    },
    {
      year: 2025,
      totalBudget: 9_516_000_000,
      enforcement: 5_040_000_000,
      detention: 3_420_000_000,
      investigations: 2_476_000_000,
      avgDailyDetention: 41_500,
      deportations: 142_000, // projected
    },
  ],

  keyMetrics: [
    {
      label: "Total Budget Growth (2020-2025)",
      value: "18.1%",
      change: "+$1.46B",
      description: "5-year budget increase from $8.06B to $9.52B",
    },
    {
      label: "Average Daily Detention Population",
      value: "41,500",
      change: "+8.7%",
      description:
        "Increase from 37,800 in FY2025, significant rise from 22,100 in FY2021",
    },
    {
      label: "Daily Detention Cost Per Person",
      value: "$150.75",
      change: "+12.3%",
      description:
        "Up from $134.23 in FY2023, includes housing, food, medical care, security",
    },
    {
      label: "Annual Detention Cost Per Person",
      value: "$55,024",
      description: "Full-year cost including all services and operations",
    },
    {
      label: "Alternatives to Detention Daily Cost",
      value: "$4.12",
      description:
        "GPS monitoring and case management - 97.3% cheaper than detention",
    },
    {
      label: "Facility Construction Investment",
      value: "$842M",
      change: "+266%",
      description: "Major increase from $230M in FY2025 for expanded capacity",
    },
    {
      label: "Average Removal/Deportation Cost",
      value: "$10,854",
      description:
        "Per-person cost including transportation, processing, and country coordination",
    },
    {
      label: "ICE Air Operations",
      value: "4,200+ flights",
      description:
        "Annual charter and removal flights for deportations and transfers",
    },
    {
      label: "HSI Criminal Investigations",
      value: "27,000+",
      description:
        "Annual investigations into trafficking, smuggling, and transnational crime",
    },
    {
      label: "Total ICE Workforce",
      value: "~21,000",
      description: "Full-time equivalent employees across all divisions",
    },
    {
      label: "Enforcement Budget Share",
      value: "53%",
      description:
        "Over half of ICE budget dedicated to enforcement and removal operations",
    },
    {
      label: "YoY Budget Increase",
      value: "+8.9%",
      change: "+$780M",
      description:
        "FY2025 increase driven by detention expansion and facility construction",
    },
  ],
};

/**
 * Helper function to calculate total spending for a specific category
 */
export function getCategoryTotal(categoryId: string): number {
  const category = ICE_SPENDING_DATA.categories.find(
    (cat) => cat.id === categoryId,
  );
  return category?.amount || 0;
}

/**
 * Helper function to get year-over-year change percentage
 */
export function getYoYChangePercent(
  currentYear: number,
  previousYear: number,
): number {
  const current = ICE_SPENDING_DATA.historicalData.find(
    (d) => d.year === currentYear,
  );
  const previous = ICE_SPENDING_DATA.historicalData.find(
    (d) => d.year === previousYear,
  );

  if (!current || !previous) return 0;

  return (
    ((current.totalBudget - previous.totalBudget) / previous.totalBudget) * 100
  );
}

/**
 * Calculate projected annual detention costs
 */
export function calculateAnnualDetentionCost(
  avgDailyPopulation: number,
  dailyCostPerDetainee: number,
): number {
  return avgDailyPopulation * dailyCostPerDetainee * 365;
}

export default ICE_SPENDING_DATA;
