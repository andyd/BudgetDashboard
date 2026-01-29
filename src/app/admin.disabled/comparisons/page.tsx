'use client';

import * as React from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FeaturedComparison {
  id: string;
  headline: string;
  budgetItem: string;
  unit: string;
  displayOrder: number;
  isFeatured: boolean;
}

export default function AdminComparisonsPage() {
  // Mock data - will be replaced with API calls
  const [comparisons, setComparisons] = React.useState<FeaturedComparison[]>([
    {
      id: '1',
      headline: 'Defense spending could buy every American a new iPhone',
      budgetItem: 'Department of Defense',
      unit: 'iPhone 15 Pro',
      displayOrder: 1,
      isFeatured: true,
    },
    {
      id: '2',
      headline: 'Medicare budget equals 500 billion Starbucks lattes',
      budgetItem: 'Medicare',
      unit: 'Starbucks Latte',
      displayOrder: 2,
      isFeatured: true,
    },
    {
      id: '3',
      headline: 'Education spending could give every student $10,000',
      budgetItem: 'Department of Education',
      unit: 'Student Grant ($10k)',
      displayOrder: 3,
      isFeatured: false,
    },
  ]);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedComparison, setSelectedComparison] =
    React.useState<FeaturedComparison | null>(null);

  // Edit form state
  const [editForm, setEditForm] = React.useState({
    headline: '',
    budgetItem: '',
    unit: '',
  });

  // Handle reorder up
  const handleMoveUp = (id: string) => {
    const index = comparisons.findIndex((c) => c.id === id);
    if (index > 0) {
      const newComparisons = [...comparisons];
      const current = newComparisons[index];
      const previous = newComparisons[index - 1];

      if (current && previous) {
        newComparisons[index] = previous;
        newComparisons[index - 1] = current;

        // Update display orders
        newComparisons.forEach((comp, idx) => {
          comp.displayOrder = idx + 1;
        });

        setComparisons(newComparisons);
      }
    }
  };

  // Handle reorder down
  const handleMoveDown = (id: string) => {
    const index = comparisons.findIndex((c) => c.id === id);
    if (index < comparisons.length - 1) {
      const newComparisons = [...comparisons];
      const current = newComparisons[index];
      const next = newComparisons[index + 1];

      if (current && next) {
        newComparisons[index] = next;
        newComparisons[index + 1] = current;

        // Update display orders
        newComparisons.forEach((comp, idx) => {
          comp.displayOrder = idx + 1;
        });

        setComparisons(newComparisons);
      }
    }
  };

  // Toggle featured status
  const handleToggleFeatured = (id: string) => {
    setComparisons((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, isFeatured: !comp.isFeatured } : comp
      )
    );
  };

  // Open edit dialog
  const handleEdit = (comparison: FeaturedComparison) => {
    setSelectedComparison(comparison);
    setEditForm({
      headline: comparison.headline,
      budgetItem: comparison.budgetItem,
      unit: comparison.unit,
    });
    setEditDialogOpen(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    if (selectedComparison) {
      setComparisons((prev) =>
        prev.map((comp) =>
          comp.id === selectedComparison.id
            ? { ...comp, ...editForm }
            : comp
        )
      );
      setEditDialogOpen(false);
      setSelectedComparison(null);
    }
  };

  // Open delete dialog
  const handleDeleteClick = (comparison: FeaturedComparison) => {
    setSelectedComparison(comparison);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (selectedComparison) {
      setComparisons((prev) =>
        prev.filter((comp) => comp.id !== selectedComparison.id)
      );
      setDeleteDialogOpen(false);
      setSelectedComparison(null);
    }
  };

  // Add new comparison (placeholder)
  const handleAddNew = () => {
    const newComparison: FeaturedComparison = {
      id: Date.now().toString(),
      headline: 'New comparison',
      budgetItem: 'Budget Item',
      unit: 'Unit',
      displayOrder: comparisons.length + 1,
      isFeatured: false,
    };
    setComparisons((prev) => [...prev, newComparison]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Featured Comparisons</h1>
          <p className="text-muted-foreground mt-2">
            Manage featured budget comparisons for the dashboard
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon />
          Add New
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Order</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Budget Item</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-[100px]">Featured</TableHead>
              <TableHead className="w-[200px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <p className="text-muted-foreground">
                    No comparisons yet. Click "Add New" to create one.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              comparisons.map((comparison, index) => (
                <TableRow key={comparison.id}>
                  <TableCell className="font-medium">
                    {comparison.displayOrder}
                  </TableCell>
                  <TableCell className="max-w-md">
                    {comparison.headline}
                  </TableCell>
                  <TableCell>{comparison.budgetItem}</TableCell>
                  <TableCell>{comparison.unit}</TableCell>
                  <TableCell>
                    <Switch
                      checked={comparison.isFeatured}
                      onCheckedChange={() =>
                        handleToggleFeatured(comparison.id)
                      }
                      aria-label="Toggle featured status"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(comparison.id)}
                        disabled={index === 0}
                        aria-label="Move up"
                      >
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(comparison.id)}
                        disabled={index === comparisons.length - 1}
                        aria-label="Move down"
                      >
                        <ArrowDownIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(comparison)}
                        aria-label="Edit"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(comparison)}
                        aria-label="Delete"
                      >
                        <TrashIcon className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comparison</DialogTitle>
            <DialogDescription>
              Update the headline, budget item, or unit for this comparison.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={editForm.headline}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, headline: e.target.value }))
                }
                placeholder="Enter headline"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budgetItem">Budget Item</Label>
              <Input
                id="budgetItem"
                value={editForm.budgetItem}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    budgetItem: e.target.value,
                  }))
                }
                placeholder="Enter budget item"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={editForm.unit}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, unit: e.target.value }))
                }
                placeholder="Enter unit"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comparison</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comparison? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedComparison && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium">{selectedComparison.headline}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {selectedComparison.budgetItem} → {selectedComparison.unit}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
