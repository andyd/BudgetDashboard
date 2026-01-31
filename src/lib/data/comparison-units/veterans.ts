export interface ComparisonUnit {
  id: string;
  name: string;
  nameSingular: string;
  cost: number;
  category: "veterans";
  icon: string;
  source: string;
  description: string;
}

export const VETERANS_UNITS: ComparisonUnit[] = [
  {
    id: "va-healthcare-annual",
    name: "VA healthcare veteran years",
    nameSingular: "VA healthcare veteran year",
    cost: 15000,
    category: "veterans",
    icon: "Stethoscope",
    source: "VA Budget and Financial Reports 2024",
    description: "Average annual cost of VA healthcare per enrolled veteran",
  },
  {
    id: "gi-bill-tuition-benefit",
    name: "GI Bill tuition benefits",
    nameSingular: "GI Bill tuition benefit",
    cost: 25000,
    category: "veterans",
    icon: "GraduationCap",
    source: "VA Education Benefits 2024",
    description: "Average annual GI Bill tuition and fees benefit payment",
  },
  {
    id: "veteran-disability-annual",
    name: "veteran disability payment years",
    nameSingular: "veteran disability payment year",
    cost: 20000,
    category: "veterans",
    icon: "Award",
    source: "VA Disability Compensation 2024",
    description:
      "Average annual VA disability compensation payment per veteran",
  },
  {
    id: "veteran-housing-assistance",
    name: "veteran housing assistance grants",
    nameSingular: "veteran housing assistance grant",
    cost: 10000,
    category: "veterans",
    icon: "Home",
    source: "VA Housing Assistance Programs 2024",
    description: "Average veteran housing assistance benefit amount",
  },
];
