/**
 * Editorial spotlight content for high-profile budget items
 * Provides context, controversy, and educational information
 */

export interface SpotlightSource {
  title: string;
  url: string;
  publisher: string;
}

export interface SpotlightContent {
  budgetItemId: string;
  title: string;
  description: string;
  keyFacts: {
    label: string;
    value: string;
  }[];
  controversy?: string;
  sources: SpotlightSource[];
}

export const SPOTLIGHT_CONTENT: SpotlightContent[] = [
  {
    budgetItemId: "f35-program",
    title: "F-35 Joint Strike Fighter Program",
    description:
      "The F-35 Lightning II is a family of fifth-generation stealth multirole fighters designed to perform ground attack and air superiority missions. It represents the most expensive weapons system in history, with development beginning in the 1990s and ongoing production and upgrades planned through the 2070s.",
    keyFacts: [
      {
        label: "Cost per Aircraft",
        value: "$80-115M depending on variant (F-35A, F-35B, F-35C)",
      },
      {
        label: "Total Program Cost",
        value:
          "$1.7 trillion over 60-year lifecycle (procurement, operations, sustainment)",
      },
      {
        label: "Development Timeline",
        value:
          "Started 1992, first flight 2006, initial operational capability 2015",
      },
      {
        label: "Fleet Size Goal",
        value:
          "2,456 aircraft for U.S. military, 600+ for international partners",
      },
    ],
    controversy:
      "The F-35 program has faced extensive criticism for cost overruns (originally projected at $233B for development and procurement, now exceeds $400B), technical delays, software issues, and maintenance challenges. The Pentagon's 2023 report noted that the aircraft still has over 800 unresolved deficiencies. Supporters argue its advanced capabilities justify costs, while critics question whether the single-platform approach was optimal.",
    sources: [
      {
        title: "F-35 Program Status and Fast Facts",
        url: "https://www.gao.gov/products/gao-23-106128",
        publisher: "Government Accountability Office",
      },
      {
        title: "F-35 Joint Strike Fighter Program",
        url: "https://www.f35.com/about",
        publisher: "Lockheed Martin",
      },
      {
        title: "Pentagon F-35 Sustainment Report",
        url: "https://www.dote.osd.mil/Portals/97/pub/reports/FY2023/",
        publisher: "Department of Defense",
      },
    ],
  },
  {
    budgetItemId: "ice-detention",
    title: "ICE Detention Operations",
    description:
      "Immigration and Customs Enforcement (ICE) operates a nationwide detention system for individuals in removal proceedings or awaiting immigration hearings. The system includes government-owned facilities, privately contracted detention centers, and intergovernmental service agreements with local jails.",
    keyFacts: [
      {
        label: "Daily Cost per Detainee",
        value: "$142-319 depending on facility type (2023 estimates)",
      },
      {
        label: "Current Capacity",
        value: "~41,500 detention beds authorized by Congress (FY2025)",
      },
      {
        label: "Average Daily Population",
        value: "~37,000 individuals (fluctuates based on border crossings)",
      },
      {
        label: "Facility Types",
        value:
          "Family Residential Centers, Contract Detention, Intergovernmental Service Agreements",
      },
    ],
    controversy:
      "ICE detention has been controversial due to reports of inadequate medical care, deaths in custody (over 200 since 2003), family separation policies, use of private prison contractors, conditions in facilities, and questions about whether detention is necessary for all immigration proceedings. The Biden administration initially pledged to reduce reliance on detention but faced operational challenges. Advocates argue for alternatives-to-detention programs that cost significantly less ($4.50-$40/day) while opponents emphasize border security needs.",
    sources: [
      {
        title: "Immigration Detention: Actions Needed to Improve Planning",
        url: "https://www.gao.gov/products/gao-21-149",
        publisher: "Government Accountability Office",
      },
      {
        title: "ICE Detention Management",
        url: "https://www.ice.gov/detain/detention-management",
        publisher: "U.S. Immigration and Customs Enforcement",
      },
      {
        title: "Fatal Neglect: How ICE Ignores Deaths in Detention",
        url: "https://www.aclu.org/report/fatal-neglect",
        publisher: "ACLU",
      },
    ],
  },
  {
    budgetItemId: "medicare",
    title: "Medicare: America's Health Insurance for Seniors",
    description:
      "Medicare is the federal health insurance program primarily for Americans aged 65 and older, and some younger people with disabilities or End-Stage Renal Disease. Established in 1965, it consists of four parts: Part A (hospital insurance), Part B (medical insurance), Part C (Medicare Advantage), and Part D (prescription drug coverage).",
    keyFacts: [
      {
        label: "Beneficiaries",
        value: "65.7 million Americans enrolled (2023)",
      },
      {
        label: "Annual Spending",
        value: "$839 billion in net outlays (FY2023)",
      },
      {
        label: "Coverage",
        value:
          "Hospital stays, doctor visits, preventive care, prescription drugs",
      },
      {
        label: "Trust Fund Status",
        value:
          "Hospital Insurance fund projected to be depleted by 2031 without legislative action",
      },
    ],
    controversy:
      "Medicare faces long-term financing challenges due to the aging baby boomer generation and rising healthcare costs. The Hospital Insurance Trust Fund is projected to run out by 2031, at which point incoming revenue would only cover 89% of costs. Political debates focus on whether to raise taxes, reduce benefits, increase eligibility age, or implement cost controls. The program also faces ongoing challenges with prescription drug pricing, Medicare Advantage oversight, and fraud prevention ($60B+ in improper payments annually).",
    sources: [
      {
        title: "2024 Annual Report of the Medicare Trustees",
        url: "https://www.cms.gov/oact/tr/2024",
        publisher: "Centers for Medicare & Medicaid Services",
      },
      {
        title: "Medicare at a Glance",
        url: "https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-program-statistics-reports",
        publisher: "CMS",
      },
      {
        title: "Medicare Spending and Financing",
        url: "https://www.kff.org/medicare/issue-brief/medicare-spending-and-financing-a-primer/",
        publisher: "Kaiser Family Foundation",
      },
    ],
  },
  {
    budgetItemId: "nih-research",
    title: "National Institutes of Health Research Funding",
    description:
      "The NIH is the nation's premier medical research agency, comprising 27 institutes and centers investigating diseases, conducting clinical trials, and funding external research at universities and medical centers nationwide. It is the largest public funder of biomedical research in the world.",
    keyFacts: [
      {
        label: "Annual Budget",
        value: "$47.5 billion (FY2025)",
      },
      {
        label: "Research Grants",
        value:
          "~50,000 competitive grants to 300,000+ researchers at 2,500+ institutions",
      },
      {
        label: "Major Initiatives",
        value:
          "Cancer Moonshot, BRAIN Initiative, All of Us Research Program, ARPA-H",
      },
      {
        label: "COVID-19 Response",
        value:
          "$6.5B+ supplemental funding for vaccine development, treatments, testing (2020-2023)",
      },
    ],
    controversy:
      "NIH funding debates center on whether budget increases keep pace with inflation and scientific opportunities, with research advocates noting that after adjusting for inflation, the 2023 budget was lower than 2003. Other controversies include the peer review process potentially favoring incremental research over innovation, geographic concentration of grants in wealthy institutions, animal research ethics, gain-of-function research safety, and questions about how quickly research translates to patient benefits. The COVID-19 pandemic highlighted both NIH's critical role in rapid vaccine development and tensions over lab leak theories and research transparency.",
    sources: [
      {
        title: "NIH Budget History",
        url: "https://officeofbudget.od.nih.gov/history.html",
        publisher: "National Institutes of Health",
      },
      {
        title: "NIH Research Portfolio Online Reporting Tools",
        url: "https://report.nih.gov/",
        publisher: "NIH",
      },
      {
        title: "Trends in Federal Funding for Research",
        url: "https://www.cbo.gov/publication/59620",
        publisher: "Congressional Budget Office",
      },
    ],
  },
  {
    budgetItemId: "aircraft-carrier",
    title: "Ford-Class Aircraft Carriers",
    description:
      "The Gerald R. Ford class is the newest generation of nuclear-powered aircraft carriers for the U.S. Navy, designed to replace the aging Nimitz class. These carriers feature electromagnetic aircraft launch systems, advanced arresting gear, dual-band radar, and improved flight deck efficiency allowing 25% more sorties per day.",
    keyFacts: [
      {
        label: "Cost to Build",
        value:
          "$13.3 billion per ship (including R&D for lead ship USS Gerald R. Ford)",
      },
      {
        label: "Annual Operating Cost",
        value: "~$700 million per carrier (crew, fuel, maintenance, air wing)",
      },
      {
        label: "Crew Size",
        value: "4,539 personnel (reduced from 5,000+ on Nimitz class)",
      },
      {
        label: "Current Fleet",
        value:
          "11 carriers total: 1 Ford-class operational, 2 under construction, 8 Nimitz-class",
      },
    ],
    controversy:
      "The Ford-class program has been criticized for massive cost overruns (originally projected at $10.5B per ship), years of delays, and technical problems with new systems including the electromagnetic catapult (EMALS), advanced arresting gear, and weapons elevators. USS Gerald R. Ford took 4 years after commissioning to become fully operational. Critics question whether such expensive platforms are vulnerable to modern anti-ship missiles and whether the budget could be better spent on smaller, distributed capabilities. The Navy argues carriers provide unmatched power projection, diplomatic presence, and crisis response capability that no alternative can match.",
    sources: [
      {
        title: "Ford-Class Aircraft Carrier Program",
        url: "https://www.gao.gov/products/gao-23-106470",
        publisher: "Government Accountability Office",
      },
      {
        title: "Aircraft Carriers - CVN",
        url: "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2169795/aircraft-carriers-cvn/",
        publisher: "U.S. Navy",
      },
      {
        title: "Navy Ford Class Aircraft Carrier Program",
        url: "https://crsreports.congress.gov/product/pdf/RS/RS20643",
        publisher: "Congressional Research Service",
      },
    ],
  },
];
