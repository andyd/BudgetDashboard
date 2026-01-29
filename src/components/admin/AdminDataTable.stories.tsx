"use client"

/**
 * AdminDataTable Storybook/Interactive Examples
 *
 * These can be used as a live component playground or converted
 * to Storybook stories if you add Storybook to the project.
 */

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type ColumnConfig } from "./AdminDataTable"

// Sample data type
interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "discontinued"
  createdAt: Date
}

// Generate sample data
const generateProducts = (count: number): Product[] => {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Toys"]
  const statuses: Product["status"][] = ["active", "inactive", "discontinued"]

  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 365)),
  }))
}

// Story 1: Basic Table
export function BasicTable() {
  const products = generateProducts(5)

  const columns: ColumnConfig<Product>[] = [
    { key: "name", label: "Product Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Basic Table</h2>
        <p className="text-muted-foreground">
          Simple table with sortable columns
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={products}
        onEdit={(product) => alert(`Edit: ${product.name}`)}
        onDelete={(product) => alert(`Delete: ${product.name}`)}
      />
    </div>
  )
}

// Story 2: Custom Rendering
export function CustomRendering() {
  const products = generateProducts(10)

  const columns: ColumnConfig<Product>[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (product) => (
        <div>
          <div className="font-semibold">{product.name}</div>
          <div className="text-muted-foreground text-xs">ID: {product.id}</div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (product) => (
        <Badge variant="outline">{product.category}</Badge>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      className: "text-right font-mono",
      headerClassName: "text-right",
      render: (product) => (
        <span className="font-semibold">
          ${product.price.toLocaleString()}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      className: "text-center",
      headerClassName: "text-center",
      render: (product) => (
        <Badge
          variant={
            product.stock > 50
              ? "default"
              : product.stock > 10
                ? "secondary"
                : "destructive"
          }
        >
          {product.stock}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (product) => (
        <Badge
          variant={
            product.status === "active"
              ? "default"
              : product.status === "inactive"
                ? "secondary"
                : "outline"
          }
        >
          {product.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Custom Rendering</h2>
        <p className="text-muted-foreground">
          Table with custom cell renderers and badges
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={products}
        onEdit={(product) => console.log("Edit:", product)}
        onDelete={(product) => console.log("Delete:", product)}
        pageSize={5}
      />
    </div>
  )
}

// Story 3: Loading State
export function LoadingState() {
  const columns: ColumnConfig<Product>[] = [
    { key: "name", label: "Product Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Loading State</h2>
        <p className="text-muted-foreground">
          Table showing skeleton loading animation
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={[]}
        isLoading={true}
      />
    </div>
  )
}

// Story 4: Empty State
export function EmptyState() {
  const columns: ColumnConfig<Product>[] = [
    { key: "name", label: "Product Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Empty State</h2>
        <p className="text-muted-foreground">
          Table with no data showing custom empty state
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={[]}
        emptyMessage="No products found"
        emptyDescription="Get started by adding your first product to the inventory."
      />
    </div>
  )
}

// Story 5: Large Dataset with Pagination
export function LargeDataset() {
  const products = generateProducts(50)

  const columns: ColumnConfig<Product>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      className: "font-mono text-muted-foreground",
    },
    { key: "name", label: "Product", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "price",
      label: "Price",
      sortable: true,
      className: "text-right font-mono",
      render: (product) => `$${product.price.toLocaleString()}`,
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (product) => product.createdAt.toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Large Dataset (50 items)</h2>
        <p className="text-muted-foreground">
          Table with pagination showing 10 items per page
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={products}
        onEdit={(product) => console.log("Edit:", product)}
        onDelete={(product) => console.log("Delete:", product)}
        pageSize={10}
      />
    </div>
  )
}

// Story 6: Interactive CRUD Example
export function InteractiveCRUD() {
  const [products, setProducts] = useState<Product[]>(generateProducts(8))

  const handleEdit = (product: Product) => {
    const newName = prompt("New name:", product.name)
    if (newName) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, name: newName } : p))
      )
    }
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Delete ${product.name}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    }
  }

  const columns: ColumnConfig<Product>[] = [
    { key: "name", label: "Product", sortable: true },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (product) => (
        <Badge variant="outline">{product.category}</Badge>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      className: "text-right",
      render: (product) => `$${product.price.toLocaleString()}`,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      className: "text-center",
      render: (product) => (
        <Badge variant={product.stock > 20 ? "default" : "destructive"}>
          {product.stock}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Interactive CRUD</h2>
        <p className="text-muted-foreground">
          Try editing or deleting items (items: {products.length})
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={5}
        emptyMessage="All products deleted"
        emptyDescription="Click 'Add Product' to create a new product."
      />
    </div>
  )
}

// Story 7: Read-only Table
export function ReadOnlyTable() {
  const products = generateProducts(6)

  const columns: ColumnConfig<Product>[] = [
    { key: "name", label: "Product", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
  ]

  return (
    <div className="space-y-4 p-8">
      <div>
        <h2 className="text-2xl font-bold">Read-Only Table</h2>
        <p className="text-muted-foreground">
          Table without actions column
        </p>
      </div>
      <AdminDataTable
        columns={columns}
        data={products}
        enableActions={false}
        pageSize={10}
      />
    </div>
  )
}
