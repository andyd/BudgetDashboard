/**
 * Example usage of BudgetTooltip component
 *
 * This file demonstrates how to integrate BudgetTooltip with a treemap or other visualization.
 */

"use client";

import { useState } from "react";
import { BudgetTooltip } from "./BudgetTooltip";
import { BudgetItem } from "@/types/budget";

export function BudgetTreemapExample() {
  const [hoveredItem, setHoveredItem] = useState<BudgetItem | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Example budget items
  const exampleItems: BudgetItem[] = [
    {
      id: "dept-1",
      name: "Department of Defense",
      amount: 842_000_000_000,
      parentId: null,
      fiscalYear: 2024,
      percentOfParent: 15.2,
      yearOverYearChange: 3.5,
    },
    {
      id: "dept-2",
      name: "Department of Health and Human Services",
      amount: 1_520_000_000_000,
      parentId: null,
      fiscalYear: 2024,
      percentOfParent: 27.4,
      yearOverYearChange: -2.1,
    },
  ];

  const handleMouseMove = (event: React.MouseEvent, item: BudgetItem) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setHoveredItem(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Budget Treemap Example</h1>

      <div className="grid grid-cols-2 gap-4">
        {exampleItems.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
            onMouseMove={(e) => handleMouseMove(e, item)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-white font-semibold">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <BudgetTooltip item={hoveredItem} position={mousePosition} />
    </div>
  );
}
