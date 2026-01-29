"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

interface ComparisonUnit {
  id: string;
  name: string;
  costPerUnit: string;
  source: string | null;
  sourceUrl: string | null;
  category: string | null;
}

interface UnitFormData {
  name: string;
  costPerUnit: string;
  source: string;
  sourceUrl: string;
  category: string;
}

const emptyFormData: UnitFormData = {
  name: "",
  costPerUnit: "",
  source: "",
  sourceUrl: "",
  category: "",
};

export default function UnitsPage() {
  const [units, setUnits] = React.useState<ComparisonUnit[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<ComparisonUnit | null>(null);
  const [deletingUnit, setDeletingUnit] = React.useState<ComparisonUnit | null>(null);
  const [formData, setFormData] = React.useState<UnitFormData>(emptyFormData);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof UnitFormData, string>>>({});

  // Fetch units on mount
  React.useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/units");
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error("Failed to fetch units:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UnitFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.costPerUnit.trim()) {
      errors.costPerUnit = "Cost per unit is required";
    } else {
      const costValue = parseFloat(formData.costPerUnit);
      if (isNaN(costValue)) {
        errors.costPerUnit = "Cost per unit must be a valid number";
      } else if (costValue <= 0) {
        errors.costPerUnit = "Cost per unit must be a positive number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const url = editingUnit ? `/api/units/${editingUnit.id}` : "/api/units";
      const method = editingUnit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          costPerUnit: formData.costPerUnit,
          source: formData.source || null,
          sourceUrl: formData.sourceUrl || null,
          category: formData.category || null,
        }),
      });

      if (response.ok) {
        await fetchUnits();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Failed to save unit:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingUnit) return;

    try {
      const response = await fetch(`/api/units/${deletingUnit.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUnits();
        setDeleteDialogOpen(false);
        setDeletingUnit(null);
      }
    } catch (error) {
      console.error("Failed to delete unit:", error);
    }
  };

  const handleEdit = (unit: ComparisonUnit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      costPerUnit: unit.costPerUnit,
      source: unit.source || "",
      sourceUrl: unit.sourceUrl || "",
      category: unit.category || "",
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUnit(null);
    setFormData(emptyFormData);
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUnit(null);
    setFormData(emptyFormData);
    setFormErrors({});
  };

  const handleDeleteClick = (unit: ComparisonUnit) => {
    setDeletingUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (field: keyof UnitFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Comparison Units</h1>
          <p className="text-muted-foreground mt-1">
            Manage comparison units for budget visualizations
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading units...</p>
        </div>
      ) : units.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No comparison units found</p>
          <Button onClick={handleAddNew} variant="outline">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create your first unit
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cost Per Unit</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{formatCurrency(unit.costPerUnit)}</TableCell>
                  <TableCell>
                    {unit.source ? (
                      unit.sourceUrl ? (
                        <a
                          href={unit.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {unit.source}
                        </a>
                      ) : (
                        unit.source
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {unit.category || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(unit)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(unit)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? "Edit Comparison Unit" : "Add New Comparison Unit"}
              </DialogTitle>
              <DialogDescription>
                {editingUnit
                  ? "Update the details of this comparison unit."
                  : "Create a new comparison unit for budget visualizations."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Teacher Salaries"
                  aria-invalid={!!formErrors.name}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="costPerUnit">
                  Cost Per Unit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPerUnit}
                  onChange={(e) => handleInputChange("costPerUnit", e.target.value)}
                  placeholder="e.g., 65000"
                  aria-invalid={!!formErrors.costPerUnit}
                />
                {formErrors.costPerUnit && (
                  <p className="text-sm text-destructive">{formErrors.costPerUnit}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => handleInputChange("source", e.target.value)}
                  placeholder="e.g., Bureau of Labor Statistics"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input
                  id="sourceUrl"
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => handleInputChange("sourceUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Education, Infrastructure"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingUnit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comparison Unit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingUnit?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletingUnit(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
