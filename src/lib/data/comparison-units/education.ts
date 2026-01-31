export interface ComparisonUnit {
  id: string;
  name: string;
  nameSingular: string;
  cost: number;
  category: "education";
  icon: string;
  source: string;
  description: string;
}

export const EDUCATION_UNITS: ComparisonUnit[] = [
  {
    id: "teacher-salary",
    name: "teacher salaries",
    nameSingular: "teacher salary",
    cost: 68000,
    category: "education",
    icon: "GraduationCap",
    source: "Bureau of Labor Statistics 2024",
    description:
      "Average annual salary for a public school teacher in the United States",
  },
  {
    id: "public-college-tuition-year",
    name: "years of public college tuition",
    nameSingular: "year of public college tuition",
    cost: 10500,
    category: "education",
    icon: "School",
    source: "College Board Trends in College Pricing 2024",
    description:
      "Average annual tuition and fees at a public four-year college for in-state students",
  },
  {
    id: "childcare-preschool-year",
    name: "years of childcare/preschool",
    nameSingular: "year of childcare/preschool",
    cost: 12000,
    category: "education",
    icon: "Baby",
    source: "Child Care Aware of America 2024",
    description:
      "Average annual cost of center-based childcare or preschool in the United States",
  },
  {
    id: "pell-grant-max",
    name: "maximum Pell Grants",
    nameSingular: "maximum Pell Grant",
    cost: 7395,
    category: "education",
    icon: "Award",
    source: "U.S. Department of Education 2024-25",
    description:
      "Maximum annual Federal Pell Grant award for eligible undergraduate students",
  },
  {
    id: "school-lunch-year",
    name: "years of school lunches",
    nameSingular: "year of school lunches",
    cost: 1000,
    category: "education",
    icon: "UtensilsCrossed",
    source: "USDA National School Lunch Program 2024",
    description:
      "Approximate annual cost of school lunches for one student (180 school days)",
  },
  {
    id: "student-loan-average-debt",
    name: "average student loan debts",
    nameSingular: "average student loan debt",
    cost: 37000,
    category: "education",
    icon: "FileText",
    source: "Federal Reserve 2024",
    description:
      "Average federal student loan debt for borrowers in the United States",
  },
  {
    id: "public-school-per-pupil-spending",
    name: "years of per-pupil public school spending",
    nameSingular: "year of per-pupil public school spending",
    cost: 15000,
    category: "education",
    icon: "BookOpen",
    source: "National Center for Education Statistics 2024",
    description:
      "Average annual public school spending per student in the United States",
  },
  {
    id: "school-bus",
    name: "school buses",
    nameSingular: "school bus",
    cost: 100000,
    category: "education",
    icon: "Bus",
    source: "School Bus Fleet Magazine 2024",
    description: "Average cost of a new full-size yellow school bus",
  },
  {
    id: "community-college-year",
    name: "years of community college",
    nameSingular: "year of community college",
    cost: 3800,
    category: "education",
    icon: "Building2",
    source: "College Board Trends in College Pricing 2024",
    description:
      "Average annual tuition and fees at a public two-year community college",
  },
  {
    id: "head-start-slot",
    name: "Head Start program slots",
    nameSingular: "Head Start program slot",
    cost: 12000,
    category: "education",
    icon: "Users",
    source: "Office of Head Start 2024",
    description:
      "Average annual federal cost per child enrolled in Head Start early childhood program",
  },
];
