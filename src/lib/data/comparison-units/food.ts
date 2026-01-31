export interface ComparisonUnit {
  id: string;
  name: string;
  nameSingular: string;
  cost: number;
  category: "food";
  icon: string;
  source: string;
  description: string;
}

export const FOOD_UNITS: ComparisonUnit[] = [
  {
    id: "family-grocery-bill-annual",
    name: "family grocery bills/year",
    nameSingular: "family grocery bill/year",
    cost: 12000,
    category: "food",
    icon: "ShoppingCart",
    source: "USDA Food Expenditure Data 2024",
    description:
      "Average annual grocery expenditure for a family of four in the United States",
  },
  {
    id: "school-meals-child-annual",
    name: "school meals for children/year",
    nameSingular: "school meals for child/year",
    cost: 1000,
    category: "food",
    icon: "Apple",
    source: "USDA National School Lunch Program 2024",
    description:
      "Average annual cost of school meals per child in the United States",
  },
  {
    id: "snap-benefits-person-annual",
    name: "SNAP benefits/person/year",
    nameSingular: "SNAP benefit/person/year",
    cost: 2400,
    category: "food",
    icon: "CreditCard",
    source: "USDA SNAP Data 2024",
    description: "Average annual SNAP (food stamp) benefits per person",
  },
  {
    id: "food-bank-meal",
    name: "food bank meals",
    nameSingular: "food bank meal",
    cost: 3,
    category: "food",
    icon: "Utensils",
    source: "Feeding America 2024",
    description: "Average cost to provide one meal through a food bank",
  },
  {
    id: "wic-benefits-family-annual",
    name: "WIC benefits/family/year",
    nameSingular: "WIC benefit/family/year",
    cost: 600,
    category: "food",
    icon: "Baby",
    source: "USDA WIC Program Data 2024",
    description:
      "Average annual WIC benefits for women, infants, and children per family",
  },
  {
    id: "senior-meal-delivery-annual",
    name: "senior meal deliveries/year",
    nameSingular: "senior meal delivery/year",
    cost: 3000,
    category: "food",
    icon: "Truck",
    source: "Administration for Community Living 2024",
    description: "Average annual cost of home-delivered meals for seniors",
  },
];
