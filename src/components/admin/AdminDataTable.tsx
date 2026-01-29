"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Column configuration types
export type SortDirection = "asc" | "desc" | null

export interface ColumnConfig<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

// Table props
export interface AdminDataTableProps<T extends { id: string | number }> {
  columns: ColumnConfig<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onReorder?: (items: T[]) => void
  isLoading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  pageSize?: number
  enableActions?: boolean
  className?: string
}

// Pagination component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  totalItems: number
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-muted-foreground text-sm">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)

            if (!showPage) {
              // Show ellipsis
              if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span
                    key={page}
                    className="text-muted-foreground px-2 text-sm"
                  >
                    ...
                  </span>
                )
              }
              return null
            }

            return (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="min-w-[2.25rem]"
              >
                {page}
              </Button>
            )
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

// Empty state component
interface EmptyStateProps {
  message: string
  description?: string | undefined
}

function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-muted/50 mb-4 flex size-16 items-center justify-center rounded-full">
        <svg
          className="text-muted-foreground size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        {message || "No data available"}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-sm text-center text-sm">
          {description}
        </p>
      )}
    </div>
  )
}

// Loading skeleton
function LoadingSkeleton({ columns }: { columns: number }) {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

// Main component
export function AdminDataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage,
  emptyDescription,
  pageSize = 10,
  enableActions = true,
  className,
}: AdminDataTableProps<T>) {
  // Sorting state
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T]
      const bValue = b[sortColumn as keyof T]

      if (aValue === bValue) return 0

      const comparison =
        aValue < bValue ? -1 : aValue > bValue ? 1 : 0

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sort
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  // Actions column count
  const totalColumns = columns.length + (enableActions ? 1 : 0)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.sortable && "cursor-pointer select-none",
                    column.headerClassName
                  )}
                  onClick={
                    column.sortable
                      ? () => handleSort(column.key)
                      : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortColumn === column.key &&
                        sortDirection === "asc" ? (
                          <ChevronUp className="size-4" />
                        ) : sortColumn === column.key &&
                          sortDirection === "desc" ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <div className="text-muted-foreground/50 flex flex-col">
                            <ChevronUp className="-mb-1 size-3" />
                            <ChevronDown className="size-3" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              {enableActions && (
                <TableHead className="w-[70px] text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <LoadingSkeleton columns={totalColumns} />
          ) : paginatedData.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={totalColumns} className="h-[400px]">
                  <EmptyState
                    message={emptyMessage || "No data available"}
                    description={emptyDescription}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={column.className}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                  {enableActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item)}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDelete(item)}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {!isLoading && paginatedData.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={sortedData.length}
        />
      )}
    </div>
  )
}
