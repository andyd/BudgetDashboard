"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface BudgetItem {
  id: string;
  name: string;
  slug: string;
  amount: string;
}

interface SpotlightContent {
  id: string;
  budgetItemId: string;
  title: string;
  description: string;
  createdAt: string;
  budgetItem?: BudgetItem;
}

interface SpotlightFormData {
  budgetItemId: string;
  title: string;
  description: string;
  sources: string;
}

export default function AdminSpotlightsPage() {
  const [spotlights, setSpotlights] = useState<SpotlightContent[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState<SpotlightContent | null>(null);
  const [deletingSpotlight, setDeletingSpotlight] = useState<SpotlightContent | null>(null);

  const [formData, setFormData] = useState<SpotlightFormData>({
    budgetItemId: "",
    title: "",
    description: "",
    sources: "",
  });

  // Fetch spotlights and budget items on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch spotlights
      const spotlightsRes = await fetch("/api/spotlights");
      if (spotlightsRes.ok) {
        const spotlightsData = await spotlightsRes.json();
        setSpotlights(spotlightsData);
      }

      // Fetch budget items
      const budgetItemsRes = await fetch("/api/budget");
      if (budgetItemsRes.ok) {
        const budgetItemsData = await budgetItemsRes.json();
        setBudgetItems(budgetItemsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (spotlight?: SpotlightContent) => {
    if (spotlight) {
      setEditingSpotlight(spotlight);
      setFormData({
        budgetItemId: spotlight.budgetItemId,
        title: spotlight.title,
        description: spotlight.description,
        sources: "", // Sources would need to be extracted from description or stored separately
      });
    } else {
      setEditingSpotlight(null);
      setFormData({
        budgetItemId: "",
        title: "",
        description: "",
        sources: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSpotlight(null);
    setFormData({
      budgetItemId: "",
      title: "",
      description: "",
      sources: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.budgetItemId || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = editingSpotlight
        ? `/api/spotlights/${editingSpotlight.id}`
        : "/api/spotlights";

      const method = editingSpotlight ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budgetItemId: formData.budgetItemId,
          title: formData.title,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save spotlight");
      }

      toast.success(
        editingSpotlight
          ? "Spotlight updated successfully"
          : "Spotlight created successfully"
      );

      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error("Error saving spotlight:", error);
      toast.error("Failed to save spotlight");
    }
  };

  const handleDelete = async () => {
    if (!deletingSpotlight) return;

    try {
      const response = await fetch(`/api/spotlights/${deletingSpotlight.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete spotlight");
      }

      toast.success("Spotlight deleted successfully");
      setIsDeleteDialogOpen(false);
      setDeletingSpotlight(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting spotlight:", error);
      toast.error("Failed to delete spotlight");
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getBudgetItemName = (budgetItemId: string) => {
    const item = budgetItems.find((item) => item.id === budgetItemId);
    return item?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spotlight Content</h1>
          <p className="text-muted-foreground mt-2">
            Manage editorial spotlight content for budget items
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSpotlight ? "Edit Spotlight" : "Add New Spotlight"}
              </DialogTitle>
              <DialogDescription>
                Create editorial content that explains budget items in detail.
                Supports basic markdown formatting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetItem">Budget Item *</Label>
                  <Select
                    value={formData.budgetItemId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, budgetItemId: value })
                    }
                  >
                    <SelectTrigger id="budgetItem">
                      <SelectValue placeholder="Select a budget item" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What does this program do?"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Explain the budget item in detail. Supports basic markdown: **bold**, *italic*, [links](url), etc."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={8}
                    required
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use markdown for formatting. This will be rendered on the
                    spotlight panel.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sources">Sources</Label>
                  <Textarea
                    id="sources"
                    placeholder="List sources (one per line)"
                    value={formData.sources}
                    onChange={(e) =>
                      setFormData({ ...formData, sources: e.target.value })
                    }
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add URLs or citations for fact-checking and transparency.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSpotlight ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {spotlights.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No spotlight content yet. Create your first one.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Spotlight
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Spotlights ({spotlights.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Budget Item</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[40%]">Description Preview</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spotlights.map((spotlight) => (
                  <TableRow key={spotlight.id}>
                    <TableCell>
                      <Badge variant="secondary">
                        {getBudgetItemName(spotlight.budgetItemId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {spotlight.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {truncateText(spotlight.description)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(spotlight.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(spotlight)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingSpotlight(spotlight);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this spotlight content? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingSpotlight && (
            <div className="py-4">
              <p className="font-medium">{deletingSpotlight.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Budget Item: {getBudgetItemName(deletingSpotlight.budgetItemId)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingSpotlight(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
