export interface ComparisonUnit {
  id: string;
  name: string;
  nameSingular: string;
  cost: number;
  category: "transportation";
  icon: string;
  source: string;
  description: string;
}

export const TRANSPORTATION_UNITS: ComparisonUnit[] = [
  {
    id: "used-car",
    name: "used cars",
    nameSingular: "used car",
    cost: 28000,
    category: "transportation",
    icon: "Car",
    source: "Kelley Blue Book 2024",
    description: "Average price of a used car in the United States",
  },
  {
    id: "year-of-gas",
    name: "years of gas",
    nameSingular: "year of gas",
    cost: 2500,
    category: "transportation",
    icon: "Fuel",
    source: "AAA Fuel Gauge Report 2024",
    description: "Average annual gasoline cost for a typical American driver",
  },
  {
    id: "monthly-transit-pass",
    name: "monthly transit passes",
    nameSingular: "monthly transit pass",
    cost: 100,
    category: "transportation",
    icon: "Ticket",
    source: "American Public Transportation Association 2024",
    description: "Average cost of a monthly public transit pass in US cities",
  },
  {
    id: "electric-vehicle",
    name: "electric vehicles",
    nameSingular: "electric vehicle",
    cost: 45000,
    category: "transportation",
    icon: "Zap",
    source: "Kelley Blue Book 2024",
    description: "Average price of a new electric vehicle in the United States",
  },
  {
    id: "public-bus",
    name: "public buses",
    nameSingular: "public bus",
    cost: 500000,
    category: "transportation",
    icon: "Bus",
    source: "Federal Transit Administration 2024",
    description: "Average cost of a standard 40-foot public transit bus",
  },
  {
    id: "mile-of-road-repair",
    name: "miles of road repair",
    nameSingular: "mile of road repair",
    cost: 1000000,
    category: "transportation",
    icon: "Construction",
    source: "American Society of Civil Engineers 2024",
    description: "Average cost to repair one mile of road in the United States",
  },
  {
    id: "ev-charging-station",
    name: "EV charging stations",
    nameSingular: "EV charging station",
    cost: 50000,
    category: "transportation",
    icon: "PlugZap",
    source: "Department of Energy 2024",
    description: "Average installation cost for a DC fast charging station",
  },
];
