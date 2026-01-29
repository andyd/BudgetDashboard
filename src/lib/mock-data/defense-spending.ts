/**
 * Defense Spending Mock Data
 *
 * Detailed breakdown of U.S. Department of Defense spending
 * Based on approximate FY2025 budget figures
 * Total DoD Budget: ~$895B
 */

export interface DefenseProgram {
  id: string;
  name: string;
  amount: number;
  description?: string;
  contractor?: string;
}

export interface DefenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  description: string;
  programs?: DefenseProgram[];
  subcategories?: DefenseCategory[];
}

export interface DefenseSpendingData {
  totalBudget: number;
  fiscalYear: number;
  lastUpdated: string;
  categories: DefenseCategory[];
}

export const DEFENSE_SPENDING_DATA: DefenseSpendingData = {
  totalBudget: 895_000_000_000, // $895B
  fiscalYear: 2025,
  lastUpdated: "2025-01-01",
  categories: [
    {
      id: "military-personnel",
      name: "Military Personnel",
      amount: 180_000_000_000, // $180B
      percentage: 21.2,
      description:
        "Salaries, benefits, and allowances for active duty, reserve, and National Guard personnel",
      subcategories: [
        {
          id: "active-duty-pay",
          name: "Active Duty Pay & Allowances",
          amount: 125_000_000_000,
          percentage: 69.4,
          description: "Base pay, housing, subsistence for active duty members",
        },
        {
          id: "reserve-guard",
          name: "Reserve & National Guard",
          amount: 35_000_000_000,
          percentage: 19.4,
          description: "Pay and benefits for reserve components",
        },
        {
          id: "retired-pay-accrual",
          name: "Retired Pay Accrual",
          amount: 20_000_000_000,
          percentage: 11.1,
          description: "Funding for future retirement obligations",
        },
      ],
    },
    {
      id: "operations-maintenance",
      name: "Operations & Maintenance",
      amount: 300_000_000_000, // $300B
      percentage: 35.3,
      description:
        "Day-to-day operations, training, maintenance of equipment and facilities",
      subcategories: [
        {
          id: "training-operations",
          name: "Training & Operations",
          amount: 120_000_000_000,
          percentage: 40.0,
          description:
            "Training exercises, operational deployments, fuel, and supplies",
        },
        {
          id: "equipment-maintenance",
          name: "Equipment Maintenance",
          amount: 85_000_000_000,
          percentage: 28.3,
          description:
            "Maintenance and repair of aircraft, ships, vehicles, and weapons systems",
        },
        {
          id: "base-operations",
          name: "Base Operations",
          amount: 55_000_000_000,
          percentage: 18.3,
          description:
            "Utilities, facility maintenance, security, and base services",
        },
        {
          id: "contracts-services",
          name: "Contracts & Services",
          amount: 40_000_000_000,
          percentage: 13.3,
          description: "Contracted services, IT support, and logistics",
        },
      ],
    },
    {
      id: "procurement",
      name: "Procurement",
      amount: 170_000_000_000, // $170B
      percentage: 20.0,
      description:
        "Acquisition of new weapons systems, equipment, and technology",
      subcategories: [
        {
          id: "aircraft",
          name: "Aircraft Procurement",
          amount: 65_000_000_000,
          percentage: 38.2,
          description: "Fixed-wing and rotary-wing aircraft for all services",
          programs: [
            {
              id: "f35",
              name: "F-35 Joint Strike Fighter",
              amount: 12_000_000_000,
              description: "Procurement of F-35A/B/C variants",
              contractor: "Lockheed Martin",
            },
            {
              id: "f15ex",
              name: "F-15EX Eagle II",
              amount: 2_500_000_000,
              description: "Advanced 4th generation fighter",
              contractor: "Boeing",
            },
            {
              id: "kc46",
              name: "KC-46 Pegasus Tanker",
              amount: 3_200_000_000,
              description: "Aerial refueling aircraft",
              contractor: "Boeing",
            },
            {
              id: "ch53k",
              name: "CH-53K Heavy Lift Helicopter",
              amount: 2_800_000_000,
              description: "Marine Corps heavy lift helicopter",
              contractor: "Sikorsky",
            },
            {
              id: "apache",
              name: "AH-64 Apache Helicopters",
              amount: 1_900_000_000,
              description: "Attack helicopter procurement and upgrades",
              contractor: "Boeing",
            },
            {
              id: "other-aircraft",
              name: "Other Aircraft Programs",
              amount: 42_600_000_000,
              description:
                "C-130J, V-22 Osprey, trainers, UAVs, and other aircraft",
            },
          ],
        },
        {
          id: "shipbuilding",
          name: "Shipbuilding & Maritime",
          amount: 32_000_000_000,
          percentage: 18.8,
          description: "Naval vessels and maritime systems",
          programs: [
            {
              id: "aircraft-carrier",
              name: "Aircraft Carrier (CVN-80/81)",
              amount: 8_500_000_000,
              description: "Ford-class aircraft carrier construction",
              contractor: "Huntington Ingalls Industries",
            },
            {
              id: "virginia-class",
              name: "Virginia-Class Submarines",
              amount: 7_200_000_000,
              description: "Attack submarine procurement (2 ships/year)",
              contractor: "General Dynamics, Huntington Ingalls",
            },
            {
              id: "columbia-class",
              name: "Columbia-Class Submarines",
              amount: 6_000_000_000,
              description: "Ballistic missile submarine program",
              contractor: "General Dynamics Electric Boat",
            },
            {
              id: "ddg51",
              name: "DDG-51 Arleigh Burke Destroyers",
              amount: 5_500_000_000,
              description: "Aegis destroyer procurement",
              contractor: "General Dynamics, Huntington Ingalls",
            },
            {
              id: "frigate",
              name: "Constellation-Class Frigate",
              amount: 2_300_000_000,
              description: "Guided-missile frigate program",
              contractor: "Fincantieri Marinette Marine",
            },
            {
              id: "other-ships",
              name: "Other Naval Programs",
              amount: 2_500_000_000,
              description:
                "Amphibious ships, support vessels, and ship modifications",
            },
          ],
        },
        {
          id: "ground-vehicles",
          name: "Ground Vehicles & Systems",
          amount: 28_000_000_000,
          percentage: 16.5,
          description: "Armored vehicles, trucks, and ground equipment",
          programs: [
            {
              id: "jltv",
              name: "Joint Light Tactical Vehicle (JLTV)",
              amount: 3_800_000_000,
              description: "Light tactical vehicle replacement for HMMWV",
              contractor: "Oshkosh Defense",
            },
            {
              id: "ampv",
              name: "Armored Multi-Purpose Vehicle (AMPV)",
              amount: 2_900_000_000,
              description: "Replacement for M113 tracked vehicles",
              contractor: "BAE Systems",
            },
            {
              id: "abrams-upgrades",
              name: "M1 Abrams Upgrades",
              amount: 2_500_000_000,
              description: "M1A2 SEPv3/v4 upgrades",
              contractor: "General Dynamics Land Systems",
            },
            {
              id: "bradley-upgrades",
              name: "Bradley Fighting Vehicle Upgrades",
              amount: 1_800_000_000,
              description: "M2A4 Bradley upgrades",
              contractor: "BAE Systems",
            },
            {
              id: "hemtt",
              name: "Heavy Tactical Vehicles",
              amount: 2_200_000_000,
              description: "HEMTT, PLS, and heavy truck procurement",
              contractor: "Oshkosh Defense",
            },
            {
              id: "other-ground",
              name: "Other Ground Systems",
              amount: 14_800_000_000,
              description: "Engineering equipment, trailers, support vehicles",
            },
          ],
        },
        {
          id: "missiles-munitions",
          name: "Missiles & Munitions",
          amount: 25_000_000_000,
          percentage: 14.7,
          description: "Guided missiles, rockets, and ammunition",
          programs: [
            {
              id: "patriot",
              name: "Patriot Missiles",
              amount: 3_500_000_000,
              description: "PAC-3 interceptors and system upgrades",
              contractor: "Raytheon",
            },
            {
              id: "jassm",
              name: "JASSM/LRASM",
              amount: 2_800_000_000,
              description: "Long-range strike missiles",
              contractor: "Lockheed Martin",
            },
            {
              id: "amraam",
              name: "AMRAAM Air-to-Air Missiles",
              amount: 2_400_000_000,
              description: "AIM-120 advanced medium-range missiles",
              contractor: "Raytheon",
            },
            {
              id: "sm6",
              name: "SM-6 Missiles",
              amount: 2_100_000_000,
              description: "Standard Missile-6 for air and missile defense",
              contractor: "Raytheon",
            },
            {
              id: "javelin",
              name: "Javelin Anti-Tank Missiles",
              amount: 1_800_000_000,
              description: "Shoulder-fired anti-tank weapons",
              contractor: "Raytheon, Lockheed Martin",
            },
            {
              id: "himars",
              name: "HIMARS & GMLRS",
              amount: 1_600_000_000,
              description: "High Mobility Artillery Rocket System",
              contractor: "Lockheed Martin",
            },
            {
              id: "precision-munitions",
              name: "Precision Guided Munitions",
              amount: 3_200_000_000,
              description: "JDAM, SDB, and other smart bombs",
            },
            {
              id: "other-munitions",
              name: "Other Munitions",
              amount: 7_600_000_000,
              description: "Conventional ammunition, rockets, torpedoes",
            },
          ],
        },
        {
          id: "other-procurement",
          name: "Other Procurement",
          amount: 20_000_000_000,
          percentage: 11.8,
          description:
            "Space systems, communications, electronics, and other equipment",
          programs: [
            {
              id: "satellite-systems",
              name: "Satellite Systems",
              amount: 6_500_000_000,
              description:
                "GPS III, communications satellites, and space systems",
            },
            {
              id: "cybersecurity",
              name: "Cybersecurity Equipment",
              amount: 4_200_000_000,
              description: "Network defense, secure communications",
            },
            {
              id: "electronics",
              name: "Electronics & Sensors",
              amount: 5_800_000_000,
              description: "Radars, targeting systems, electronic warfare",
            },
            {
              id: "misc-equipment",
              name: "Miscellaneous Equipment",
              amount: 3_500_000_000,
              description: "Support equipment, tools, and other procurement",
            },
          ],
        },
      ],
    },
    {
      id: "rdt-e",
      name: "Research, Development, Test & Evaluation",
      amount: 140_000_000_000, // $140B
      percentage: 16.5,
      description:
        "Development of next-generation weapons, technology, and innovation",
      subcategories: [
        {
          id: "advanced-aircraft",
          name: "Advanced Aircraft R&D",
          amount: 35_000_000_000,
          percentage: 25.0,
          description:
            "Next-generation fighters, bombers, and aviation technology",
          programs: [
            {
              id: "ngad",
              name: "Next Generation Air Dominance (NGAD)",
              amount: 8_500_000_000,
              description: "6th generation fighter development",
              contractor: "Classified",
            },
            {
              id: "b21",
              name: "B-21 Raider Development",
              amount: 6_200_000_000,
              description: "Next-generation stealth bomber R&D",
              contractor: "Northrop Grumman",
            },
            {
              id: "ccca",
              name: "Collaborative Combat Aircraft",
              amount: 4_800_000_000,
              description: "Autonomous loyal wingman UAVs",
              contractor: "Multiple contractors",
            },
            {
              id: "hypersonics-air",
              name: "Air-Breathing Hypersonics",
              amount: 3_500_000_000,
              description: "Hypersonic weapon and propulsion development",
            },
            {
              id: "other-aircraft-rd",
              name: "Other Aviation R&D",
              amount: 12_000_000_000,
              description: "Avionics, propulsion, materials research",
            },
          ],
        },
        {
          id: "missile-defense",
          name: "Missile Defense & Space",
          amount: 30_000_000_000,
          percentage: 21.4,
          description: "Ballistic missile defense and space capabilities",
          programs: [
            {
              id: "mda-systems",
              name: "Missile Defense Agency Programs",
              amount: 12_500_000_000,
              description: "GMD, Aegis, THAAD system development",
            },
            {
              id: "hypersonic-defense",
              name: "Hypersonic Defense",
              amount: 5_200_000_000,
              description: "Detection and defense against hypersonic threats",
            },
            {
              id: "space-systems-rd",
              name: "Space Systems Development",
              amount: 8_300_000_000,
              description: "Satellite constellations, space domain awareness",
            },
            {
              id: "directed-energy",
              name: "Directed Energy Weapons",
              amount: 4_000_000_000,
              description: "Laser and microwave weapon systems",
            },
          ],
        },
        {
          id: "cyber-ai",
          name: "Cyber & Artificial Intelligence",
          amount: 25_000_000_000,
          percentage: 17.9,
          description: "Cybersecurity, AI/ML, and information warfare",
          programs: [
            {
              id: "ai-ml",
              name: "Artificial Intelligence & Machine Learning",
              amount: 9_500_000_000,
              description:
                "AI-enabled weapons, autonomous systems, decision support",
            },
            {
              id: "cyber-ops",
              name: "Cyber Operations",
              amount: 8_200_000_000,
              description: "Offensive and defensive cyber capabilities",
            },
            {
              id: "quantum",
              name: "Quantum Technology",
              amount: 3_800_000_000,
              description: "Quantum computing, communications, and sensing",
            },
            {
              id: "electronic-warfare-rd",
              name: "Electronic Warfare R&D",
              amount: 3_500_000_000,
              description: "Next-generation EW systems and countermeasures",
            },
          ],
        },
        {
          id: "naval-systems-rd",
          name: "Naval Systems R&D",
          amount: 20_000_000_000,
          percentage: 14.3,
          description: "Advanced naval platforms and undersea systems",
          programs: [
            {
              id: "unmanned-systems",
              name: "Unmanned Maritime Systems",
              amount: 6_500_000_000,
              description: "Autonomous surface and underwater vehicles",
            },
            {
              id: "submarine-tech",
              name: "Advanced Submarine Technology",
              amount: 5_200_000_000,
              description: "Stealth, propulsion, and weapons systems",
            },
            {
              id: "naval-aviation-rd",
              name: "Naval Aviation Development",
              amount: 4_800_000_000,
              description: "Carrier-based aircraft and systems",
            },
            {
              id: "shipboard-systems",
              name: "Shipboard Systems",
              amount: 3_500_000_000,
              description: "Radar, weapons, and combat systems",
            },
          ],
        },
        {
          id: "science-technology",
          name: "Science & Technology",
          amount: 18_000_000_000,
          percentage: 12.9,
          description: "Basic research and early-stage technology development",
          programs: [
            {
              id: "darpa",
              name: "DARPA Programs",
              amount: 7_200_000_000,
              description:
                "Defense Advanced Research Projects Agency initiatives",
            },
            {
              id: "materials-research",
              name: "Advanced Materials",
              amount: 3_800_000_000,
              description: "Composites, metamaterials, and nanotechnology",
            },
            {
              id: "biotechnology",
              name: "Biotechnology & Human Performance",
              amount: 2_500_000_000,
              description: "Medical advances and human enhancement",
            },
            {
              id: "basic-research",
              name: "Basic Research",
              amount: 4_500_000_000,
              description: "University partnerships and fundamental science",
            },
          ],
        },
        {
          id: "other-rd",
          name: "Other R&D Programs",
          amount: 12_000_000_000,
          percentage: 8.6,
          description: "Ground systems, logistics, and support technology",
        },
      ],
    },
    {
      id: "military-construction",
      name: "Military Construction",
      amount: 15_000_000_000, // $15B
      percentage: 1.8,
      description:
        "Construction of facilities, infrastructure, and family housing",
      subcategories: [
        {
          id: "base-infrastructure",
          name: "Base Infrastructure",
          amount: 8_500_000_000,
          percentage: 56.7,
          description: "Hangars, maintenance facilities, training ranges",
        },
        {
          id: "hospitals-medical",
          name: "Medical Facilities",
          amount: 2_200_000_000,
          percentage: 14.7,
          description: "Hospitals, clinics, and medical treatment facilities",
        },
        {
          id: "family-housing-construction",
          name: "Family Housing Construction",
          amount: 2_000_000_000,
          percentage: 13.3,
          description: "New housing for military families",
        },
        {
          id: "nato-overseas",
          name: "NATO & Overseas Construction",
          amount: 1_800_000_000,
          percentage: 12.0,
          description: "Construction at overseas bases",
        },
        {
          id: "guard-reserve-construction",
          name: "Guard & Reserve Facilities",
          amount: 500_000_000,
          percentage: 3.3,
          description: "National Guard and Reserve construction",
        },
      ],
    },
    {
      id: "family-housing",
      name: "Family Housing Operations",
      amount: 2_000_000_000, // $2B
      percentage: 0.2,
      description: "Operations and maintenance of military family housing",
      subcategories: [
        {
          id: "housing-operations",
          name: "Housing Operations & Maintenance",
          amount: 1_200_000_000,
          percentage: 60.0,
          description:
            "Utilities, repairs, and maintenance of existing housing",
        },
        {
          id: "privatization-support",
          name: "Privatization Support",
          amount: 500_000_000,
          percentage: 25.0,
          description: "Support for privatized housing initiatives",
        },
        {
          id: "housing-services",
          name: "Housing Services",
          amount: 300_000_000,
          percentage: 15.0,
          description: "Management and support services",
        },
      ],
    },
    {
      id: "other-dod",
      name: "Other DoD Programs",
      amount: 43_000_000_000, // $43B
      percentage: 5.1,
      description: "Defense-wide activities, agencies, and special programs",
      subcategories: [
        {
          id: "defense-health",
          name: "Defense Health Program",
          amount: 15_000_000_000,
          percentage: 34.9,
          description: "Military healthcare system operations",
        },
        {
          id: "sof-activities",
          name: "Special Operations Forces",
          amount: 13_000_000_000,
          percentage: 30.2,
          description: "USSOCOM operations and procurement",
        },
        {
          id: "defense-agencies",
          name: "Defense Agencies",
          amount: 8_000_000_000,
          percentage: 18.6,
          description: "DIA, NSA, NGA, and other defense agencies",
        },
        {
          id: "contingency-ops",
          name: "Overseas Contingency Operations",
          amount: 4_000_000_000,
          percentage: 9.3,
          description: "Ongoing operations and contingencies",
        },
        {
          id: "other-defense-wide",
          name: "Other Defense-Wide",
          amount: 3_000_000_000,
          percentage: 7.0,
          description: "Miscellaneous defense-wide programs",
        },
      ],
    },
  ],
};

/**
 * Helper function to get total by category
 */
export function getCategoryTotal(categoryId: string): number {
  const category = DEFENSE_SPENDING_DATA.categories.find(
    (c) => c.id === categoryId,
  );
  return category?.amount || 0;
}

/**
 * Helper function to get all programs across categories
 */
export function getAllPrograms(): DefenseProgram[] {
  const programs: DefenseProgram[] = [];

  DEFENSE_SPENDING_DATA.categories.forEach((category) => {
    category.subcategories?.forEach((subcategory) => {
      if (subcategory.programs) {
        programs.push(...subcategory.programs);
      }
    });
  });

  return programs;
}

/**
 * Helper function to get top N programs by spending
 */
export function getTopPrograms(n: number = 10): DefenseProgram[] {
  return getAllPrograms()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

/**
 * Format currency for display
 */
export function formatDefenseAmount(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}
