/**
 * Script to find duplicate budget item IDs
 */

import { ALL_BUDGET_ITEMS } from "../src/lib/data/budget-items/index";

const idCounts = new Map<string, number>();

ALL_BUDGET_ITEMS.forEach((item) => {
  const count = idCounts.get(item.id) || 0;
  idCounts.set(item.id, count + 1);
});

const duplicates = Array.from(idCounts.entries())
  .filter(([, count]) => count > 1)
  .map(([id, count]) => ({ id, count }));

console.log("Total items:", ALL_BUDGET_ITEMS.length);
console.log("Unique IDs:", idCounts.size);
console.log("\nDuplicate IDs:");
duplicates.forEach(({ id, count }) => {
  console.log(`  ${id}: appears ${count} times`);

  // Find the items with this ID
  const items = ALL_BUDGET_ITEMS.filter((item) => item.id === id);
  items.forEach((item, index) => {
    console.log(
      `    [${index + 1}] ${item.name} - $${item.amount.toLocaleString()}`,
    );
  });
});
