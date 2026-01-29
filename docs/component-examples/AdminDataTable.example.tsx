"use client"

/**
 * AdminDataTable Usage Examples
 *
 * This file demonstrates various ways to use the AdminDataTable component.
 * Copy and adapt these examples for your admin pages.
 */

import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type ColumnConfig } from "./AdminDataTable"

// Example 1: Basic usage with comparison units
interface ComparisonUnit {
  id: string
  name: string
  category: string
  value: number
  isActive: boolean
  createdAt: Date
}

export function ComparisonUnitsTable() {
  const units: ComparisonUnit[] = [
    {
      id: "1",
      name: "Boeing 747",
      category: "Aircraft",
      value: 400000000,
      isActive: true,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Statue of Liberty",
      category: "Landmark",
      value: 100000000,
      isActive: true,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "3",
      name: "Space Shuttle",
      category: "Spacecraft",
      value: 1700000000,
      isActive: false,
      createdAt: new Date("2024-01-10"),
    },
  ]

  const columns: ColumnConfig<ComparisonUnit>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (unit) => (
        <Badge variant="outline">{unit.category}</Badge>
      ),
    },
    {
      key: "value",
      label: "Value",
      sortable: true,
      render: (unit) => (
        <span className="font-mono">
          ${unit.value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (unit) => (
        <Badge variant={unit.isActive ? "default" : "secondary"}>
          {unit.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (unit) => (
        <span className="text-muted-foreground text-sm">
          {unit.createdAt.toLocaleDateString()}
        </span>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={units}
      onEdit={(unit) => {
        console.log("Edit unit:", unit)
        // Open edit dialog/modal
      }}
      onDelete={(unit) => {
        console.log("Delete unit:", unit)
        // Show confirmation dialog
      }}
      emptyMessage="No comparison units found"
      emptyDescription="Get started by creating your first comparison unit."
      pageSize={10}
    />
  )
}

// Example 2: With loading state
export function LoadingExample() {
  const columns: ColumnConfig<ComparisonUnit>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "value", label: "Value", sortable: true },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={[]}
      isLoading={true}
      pageSize={10}
    />
  )
}

// Example 3: Without actions column
export function ReadOnlyExample() {
  const units: ComparisonUnit[] = [
    {
      id: "1",
      name: "Example Item",
      category: "Test",
      value: 1000,
      isActive: true,
      createdAt: new Date(),
    },
  ]

  const columns: ColumnConfig<ComparisonUnit>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={units}
      enableActions={false}
      pageSize={10}
    />
  )
}

// Example 4: Custom styling
export function StyledExample() {
  const units: ComparisonUnit[] = [
    {
      id: "1",
      name: "Example",
      category: "Test",
      value: 1000,
      isActive: true,
      createdAt: new Date(),
    },
  ]

  const columns: ColumnConfig<ComparisonUnit>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "font-semibold",
      headerClassName: "bg-muted/50",
    },
    {
      key: "value",
      label: "Value",
      sortable: true,
      className: "text-right font-mono",
      headerClassName: "text-right",
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={units}
      className="rounded-xl shadow-lg"
      pageSize={10}
    />
  )
}

// Example 5: Minimal columns (ID-based data)
interface SimpleItem {
  id: number
  title: string
  count: number
}

export function SimpleExample() {
  const items: SimpleItem[] = [
    { id: 1, title: "Item One", count: 42 },
    { id: 2, title: "Item Two", count: 17 },
    { id: 3, title: "Item Three", count: 99 },
  ]

  const columns: ColumnConfig<SimpleItem>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      className: "w-[80px] font-mono text-muted-foreground",
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "count",
      label: "Count",
      sortable: true,
      className: "text-right font-mono",
      render: (item) => (
        <span className="font-semibold">{item.count}</span>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={items}
      onEdit={(item) => console.log("Edit:", item)}
      onDelete={(item) => console.log("Delete:", item)}
      pageSize={5}
    />
  )
}

// Example 6: Large dataset with pagination
export function LargeDatasetExample() {
  // Generate 50 items
  const items: SimpleItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    count: Math.floor(Math.random() * 100),
  }))

  const columns: ColumnConfig<SimpleItem>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "count", label: "Count", sortable: true },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={items}
      pageSize={10}
      onEdit={(item) => console.log("Edit:", item)}
      onDelete={(item) => console.log("Delete:", item)}
    />
  )
}
