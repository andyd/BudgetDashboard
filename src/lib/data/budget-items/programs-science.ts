import type { BudgetSpendingItem } from "./departments";

export const SCIENCE_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-nih",
    name: "NIH Research",
    amount: 48_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "National Institutes of Health",
    description:
      "Biomedical and public health research across 27 institutes and centers, supporting scientific discoveries to improve health and save lives.",
  },
  {
    id: "prog-nasa",
    name: "NASA Total",
    amount: 25_000_000_000,
    tier: "program",
    parentId: "dept-nasa",
    fiscalYear: 2025,
    source: "NASA Budget FY2025",
    description:
      "Space exploration, aeronautics research, Earth science, planetary science, and technology development programs.",
  },
  {
    id: "prog-nsf",
    name: "NSF",
    amount: 9_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "National Science Foundation",
    description:
      "National Science Foundation funding for fundamental research and education across all fields of science and engineering.",
  },
  {
    id: "prog-cdc",
    name: "CDC",
    amount: 9_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "Centers for Disease Control and Prevention",
    description:
      "Disease prevention, health promotion, emergency preparedness, and public health surveillance programs.",
  },
  {
    id: "prog-noaa",
    name: "NOAA",
    amount: 6_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "National Oceanic and Atmospheric Administration",
    description:
      "Weather forecasting, ocean and atmospheric research, fisheries management, and coastal conservation programs.",
  },
  {
    id: "prog-doe-science",
    name: "DOE Science",
    amount: 8_000_000_000,
    tier: "program",
    parentId: "dept-energy",
    fiscalYear: 2025,
    source: "Department of Energy Office of Science",
    description:
      "Basic research in physics, chemistry, biology, and materials science at national laboratories and universities.",
  },
  {
    id: "prog-epa-research",
    name: "EPA Research",
    amount: 500_000_000,
    tier: "program",
    parentId: "dept-epa",
    fiscalYear: 2025,
    source: "Environmental Protection Agency",
    description:
      "Environmental science research supporting air quality, water quality, chemical safety, and ecosystem protection.",
  },
  {
    id: "prog-national-parks",
    name: "National Parks",
    amount: 4_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "National Park Service",
    description:
      "Operation, maintenance, and preservation of 400+ national parks, monuments, and historic sites across the United States.",
  },
  {
    id: "prog-smithsonian",
    name: "Smithsonian",
    amount: 1_000_000_000,
    tier: "program",
    fiscalYear: 2025,
    source: "Smithsonian Institution",
    description:
      "World's largest museum, education, and research complex with 21 museums, the National Zoo, and research facilities.",
  },
];
