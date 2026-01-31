import type { BudgetSpendingItem } from "./departments";

export const CURRENT_EVENT_ITEMS: BudgetSpendingItem[] = [
  {
    id: "event-trump-inaugural-balls",
    name: "Trump Inaugural Balls",
    amount: 25_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Presidential Inaugural Committee",
    description:
      "Private funding for official inaugural balls and celebration events following the presidential inauguration.",
  },
  {
    id: "event-presidential-travel",
    name: "Presidential Travel Annual",
    amount: 100_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Government Accountability Office",
    description:
      "Annual costs for presidential domestic and international travel including Secret Service, staff, and logistics.",
  },
  {
    id: "event-white-house-operations",
    name: "White House Operations",
    amount: 50_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Executive Office of the President Budget",
    description:
      "Annual operating budget for the White House including staff salaries, maintenance, utilities, and daily operations.",
  },
  {
    id: "event-congressional-salaries",
    name: "Congressional Salaries Total",
    amount: 100_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Congressional Research Service",
    description:
      "Combined annual salaries for all 535 members of Congress including Senators and Representatives.",
  },
  {
    id: "event-air-force-one",
    name: "Air Force One Operating Cost",
    amount: 200_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "U.S. Air Force",
    description:
      "Annual operating and maintenance costs for Air Force One fleet including fuel, crew, and security.",
  },
  {
    id: "event-presidential-golf",
    name: "Presidential Golf Trips",
    amount: 15_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Government Accountability Office",
    description:
      "Estimated annual cost of presidential golf outings including travel, security, and logistics.",
  },
  {
    id: "event-state-dinner",
    name: "State Dinner Cost",
    amount: 500_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "White House Historical Association",
    description:
      "Average cost per state dinner including catering, entertainment, decorations, and security.",
  },
  {
    id: "event-cabinet-travel",
    name: "Cabinet Secretary Travel",
    amount: 20_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Office of Inspector General",
    description:
      "Annual travel costs for Cabinet-level officials including flights, security, and accommodations.",
  },
];
