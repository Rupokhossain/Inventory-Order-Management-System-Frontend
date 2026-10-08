"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import {
  Boxes,
  Search,
  DollarSign,
  AlertTriangle,
  Package,
  Layers,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Printer,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Tag,
  FolderPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<any | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form states for Add Product
  const [addName, setAddName] = useState("");
  const [addCategoryId, setAddCategoryId] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addStock, setAddStock] = useState("");
  const [addImageSource, setAddImageSource] = useState<"file" | "url">("file");
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addFilePreview, setAddFilePreview] = useState<string>("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [isQuickAddCategoryOpen, setIsQuickAddCategoryOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");

  // Form states for Edit Product
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageSource, setEditImageSource] = useState<"url" | "file">("url");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string>("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditQuickAddCategoryOpen, setIsEditQuickAddCategoryOpen] = useState(false);
  const [editQuickCategoryName, setEditQuickCategoryName] = useState("");

  // Form state for Stock Adjustment
  const [adjustQuantity, setAdjustQuantity] = useState("");

  // Form state for Manage Categories Modal
  const [newCategoryName, setNewCategoryName] = useState("");

  // Drag and drop states
  const [isAddDragging, setIsAddDragging] = useState(false);
  const [isEditDragging, setIsEditDragging] = useState(false);

  // Queries
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-inventory-ledger"],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  const products: any[] = response?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => productService.createProduct(payload),
    onSuccess: () => {
      toast.success("New SKU product published successfully to central catalog!");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetAddForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      productService.updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Product details updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update product");
    },
  });

  const stockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      productService.updateStock(id, quantity),
    onSuccess: () => {
      toast.success("Stock inventory level updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStockAdjustProduct(null);
      setAdjustQuantity("");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to adjust stock");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product permanently archived from central catalog!");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingProduct(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete product");
    },
  });

  // Category Mutations
  const categoryCreateMutation = useMutation({
    mutationFn: (name: string) => productService.createCategory({ name }),
    onSuccess: (data: any) => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryName("");
      setQuickCategoryName("");
      setEditQuickCategoryName("");
      setIsQuickAddCategoryOpen(false);
      setIsEditQuickAddCategoryOpen(false);
      if (data?.id) {
        if (isAddModalOpen) setAddCategoryId(data.id);
        if (editingProduct) setEditCategoryId(data.id);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create category");
    },
  });

  const categoryDeleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete category");
    },
  });

  // File Handlers
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "add" | "edit"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "add") {
      setAddFile(file);
      setAddFilePreview(previewUrl);
    } else {
      setEditFile(file);
      setEditFilePreview(previewUrl);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, type: "add" | "edit") => {
    e.preventDefault();
    if (type === "add") setIsAddDragging(false);
    else setIsEditDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "add") {
      setAddFile(file);
      setAddFilePreview(previewUrl);
    } else {
      setEditFile(file);
      setEditFilePreview(previewUrl);
    }
  };

  const resetAddForm = () => {
    setAddName("");
    setAddCategoryId("");
    setAddPrice("");
    setAddStock("");
    setAddImageUrl("");
    setAddFile(null);
    setAddFilePreview("");
    setAddImageSource("file");
    setAddDescription("");
    setIsQuickAddCategoryOpen(false);
    setQuickCategoryName("");
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setEditName(p.name || "");
    setEditCategoryId(p.categoryId || "");
    setEditPrice(String(p.price || ""));
    setEditImageUrl(p.imageUrl || "");
    setEditFile(null);
    setEditFilePreview("");
    setEditImageSource("url");
    setEditDescription(p.description || "");
    setIsEditQuickAddCategoryOpen(false);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!addCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!addPrice || Number(addPrice) <= 0) {
      toast.error("Valid positive price is required");
      return;
    }
    if (!addStock || Number(addStock) < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    const desc = addDescription.trim() || "Enterprise verified standard SKU catalog item.";
    if (desc.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    if (addImageSource === "file" && addFile) {
      const formData = new FormData();
      formData.append("name", addName.trim());
      formData.append("categoryId", addCategoryId);
      formData.append("price", String(addPrice));
      formData.append("stockQuantity", String(addStock));
      formData.append("description", desc);
      formData.append("image", addFile);
      createMutation.mutate(formData);
    } else {
      createMutation.mutate({
        name: addName.trim(),
        categoryId: addCategoryId,
        price: Number(addPrice),
        stockQuantity: Number(addStock),
        imageUrl: addImageUrl.trim() || undefined,
        description: desc,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editName.trim()) {
      toast.error("Product title cannot be empty");
      return;
    }
    if (!editPrice || Number(editPrice) <= 0) {
      toast.error("Valid positive price is required");
      return;
    }

    const desc = editDescription.trim();
    if (desc && desc.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    if (editImageSource === "file" && editFile) {
      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editCategoryId) formData.append("categoryId", editCategoryId);
      formData.append("price", String(editPrice));
      if (desc) formData.append("description", desc);
      formData.append("image", editFile);
      updateMutation.mutate({
        id: editingProduct.id,
        payload: formData,
      });
    } else {
      updateMutation.mutate({
        id: editingProduct.id,
        payload: {
          name: editName.trim(),
          categoryId: editCategoryId || undefined,
          price: Number(editPrice),
          imageUrl: editImageUrl.trim() || undefined,
          description: desc || undefined,
        },
      });
    }
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;
    const qty = Number(adjustQuantity);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      toast.error("Please enter a positive whole number of units to add");
      return;
    }

    stockMutation.mutate({
      id: stockAdjustProduct.id,
      quantity: qty,
    });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const isOutOfStock = (p.stockQuantity ?? 0) === 0;
    const isLowStock = (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5;
    const isInStock = (p.stockQuantity ?? 0) > 5;

    let matchesFilter = true;
    if (filterType === "LOW") matchesFilter = isLowStock;
    else if (filterType === "OUT") matchesFilter = isOutOfStock;
    else if (filterType === "HEALTHY") matchesFilter = isInStock;

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // KPI calculations
  const totalUnits = products.reduce(
    (acc, curr) => acc + Number(curr.stockQuantity || 0),
    0
  );
  const totalValuation = products.reduce(
    (acc, curr) =>
      acc + Number(curr.price || 0) * Number(curr.stockQuantity || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 5
  ).length;
  const outOfStockCount = products.filter(
    (p) => (p.stockQuantity ?? 0) === 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2.5 py-1 rounded-lg border border-border/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Back to Executive Suite</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="h-6 w-6 text-primary" />
            Central Warehouse Inventory & Catalog Control
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create, update, replenish, or archive product SKUs and manage catalog categories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Product Button */}
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </Button>

          {/* Manage Categories Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCategoryModalOpen(true)}
            className="gap-2 text-xs font-semibold hover:border-primary/50"
          >
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span>Categories</span>
          </Button>

          {/* Sync Stock Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sync Stock</span>
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print Ledger</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Valuation */}
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Total Valuation
            </span>
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 truncate">
              <CheckCircle2 className="h-3 w-3 shrink-0" /> Live asset value
            </span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Card 2: Total Units */}
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Total Units
            </span>
            <div className="text-xl sm:text-2xl font-black text-foreground truncate">
              {totalUnits.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold block truncate">
              Across {products.length} registered SKUs
            </span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Card 3: Low Stock */}
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Low Stock Alert
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 truncate">
              {lowStockCount} Items
            </div>
            <span className="text-[10px] text-amber-600 font-semibold block truncate">
              ≤ 5 units remaining
            </span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block truncate">
              Out of Stock
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 truncate">
              {outOfStockCount} Items
            </div>
            <span className="text-[10px] text-rose-600 font-semibold block truncate">
              Replenishment needed
            </span>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "All SKUs", count: products.length },
            {
              id: "HEALTHY",
              label: "In Stock (>5)",
              count: products.length - lowStockCount - outOfStockCount,
            },
            { id: "LOW", label: "Low Stock (≤5)", count: lowStockCount },
            { id: "OUT", label: "Depleted (0)", count: outOfStockCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 ${
                filterType === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground bg-muted/30 sm:bg-transparent"
              }`}
            >
              <span className="truncate">{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full shrink-0 ${
                  filterType === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter SKU or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Inventory Table / Mobile Cards */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Computing central warehouse valuation...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Boxes className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-sm font-bold text-foreground">No inventory items</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No SKU products match the specified criteria.
            </p>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 gap-2 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Product
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (md:hidden) */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredProducts.map((p) => {
                const stock = Number(p.stockQuantity ?? 0);
                const price = Number(p.price ?? 0);
                const valuation = stock * price;
                const isOutOfStock = stock === 0;
                const isLow = stock > 0 && stock <= 5;

                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 rounded-xl border border-border overflow-hidden bg-muted/30 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            p.imageUrl ||
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
                          }
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-foreground truncate">{p.name}</h4>
                          {isOutOfStock ? (
                            <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5 text-[10px] shrink-0">
                              Depleted
                            </Badge>
                          ) : isLow ? (
                            <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5 text-[10px] shrink-0">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5 text-[10px] shrink-0">
                              Healthy
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground truncate">
                            {p.category?.name || "Standard SKU"}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            #{p.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/50 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Price</span>
                        <span className="font-mono font-bold text-foreground">${price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Stock</span>
                        <span className="font-mono font-bold text-foreground">{stock} Units</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Valuation</span>
                        <span className="font-mono font-bold text-primary truncate block">${valuation.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30 gap-1.5"
                        onClick={() => {
                          setStockAdjustProduct(p);
                          setAdjustQuantity("");
                        }}
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>Replenish</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold text-foreground hover:text-primary hover:bg-primary/10 gap-1.5"
                        onClick={() => handleOpenEdit(p)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/30 gap-1.5"
                        onClick={() => setDeletingProduct(p)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">SKU & Item Details</th>
                    <th className="px-4 py-3 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 whitespace-nowrap">Unit Price</th>
                    <th className="px-4 py-3 whitespace-nowrap">Stock Units</th>
                    <th className="px-4 py-3 whitespace-nowrap">Total Valuation</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProducts.map((p) => {
                    const stock = Number(p.stockQuantity ?? 0);
                    const price = Number(p.price ?? 0);
                    const valuation = stock * price;
                    const isOutOfStock = stock === 0;
                    const isLow = stock > 0 && stock <= 5;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Product Name */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg border border-border overflow-hidden bg-muted/30 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  p.imageUrl ||
                                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
                                }
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-foreground text-xs block truncate max-w-[200px]">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                #{p.id.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {p.category?.name || "Standard SKU"}
                          </span>
                        </td>

                        {/* Unit Price */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-foreground">
                            ${price.toFixed(2)}
                          </span>
                        </td>

                        {/* Stock Units */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-bold text-foreground text-sm font-mono">
                            {stock} Units
                          </span>
                        </td>

                        {/* Valuation */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-primary text-sm">
                            ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isOutOfStock ? (
                            <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5 text-[10px]">
                              Depleted
                            </Badge>
                          ) : isLow ? (
                            <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5 text-[10px]">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5 text-[10px]">
                              Healthy
                            </Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Replenish Stock Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                              onClick={() => {
                                setStockAdjustProduct(p);
                                setAdjustQuantity("");
                              }}
                              title="Add / Replenish Stock Units"
                            >
                              <Layers className="h-3.5 w-3.5" />
                            </Button>

                            {/* Edit Details Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => handleOpenEdit(p)}
                              title="Edit Product Details"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() => setDeletingProduct(p)}
                              title="Archive / Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. ADD NEW PRODUCT MODAL */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={resetAddForm}
          />
          <div className="relative z-50 w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Add New Product SKU
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Register a new product with custom image upload or link
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={resetAddForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-3.5">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Product Title / Name *
                </label>
                <Input
                  placeholder="e.g. Ergonomic High-Back Executive Chair"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="text-xs bg-background"
                  required
                />
              </div>

              {/* Category & Quick Add */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddCategoryOpen(!isQuickAddCategoryOpen)}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{isQuickAddCategoryOpen ? "Close Quick Add" : "+ New Category"}</span>
                  </button>
                </div>

                {/* Inline Quick Add Category Box */}
                {isQuickAddCategoryOpen && (
                  <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 space-y-2 mb-2 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Quick Add New Category
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsQuickAddCategoryOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. Smart Electronics, Furniture..."
                        value={quickCategoryName}
                        onChange={(e) => setQuickCategoryName(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          categoryCreateMutation.isPending || !quickCategoryName.trim()
                        }
                        onClick={() => {
                          if (quickCategoryName.trim().length < 2) {
                            toast.error("Category name must be at least 2 characters");
                            return;
                          }
                          categoryCreateMutation.mutate(quickCategoryName.trim());
                        }}
                        className="h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold shrink-0"
                      >
                        {categoryCreateMutation.isPending ? "Adding..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}

                <select
                  value={addCategoryId}
                  onChange={(e) => setAddCategoryId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="" disabled>
                    Select Existing Category
                  </option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Initial Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Unit Price ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="e.g. 149.99"
                    value={addPrice}
                    onChange={(e) => setAddPrice(e.target.value)}
                    className="text-xs bg-background"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Initial Stock Units *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={addStock}
                    onChange={(e) => setAddStock(e.target.value)}
                    className="text-xs bg-background"
                    required
                  />
                </div>
              </div>

              {/* Image Source Selection: File Upload vs URL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    Product Image
                  </label>
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setAddImageSource("file")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        addImageSource === "file"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Upload className="h-3 w-3" />
                      <span>Choose File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddImageSource("url")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        addImageSource === "url"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {/* Option A: Upload File from Device */}
                {addImageSource === "file" && (
                  <div>
                    {!addFile ? (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsAddDragging(true);
                        }}
                        onDragLeave={() => setIsAddDragging(false)}
                        onDrop={(e) => handleDrop(e, "add")}
                        className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
                          isAddDragging
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/60 hover:bg-muted/30"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">
                          Click to browse device or drag & drop image
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          Supports PNG, JPG, WEBP (Max 10MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "add")}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-border bg-background shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={addFilePreview}
                              alt="Upload preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground block truncate max-w-[200px]">
                              {addFile.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {(addFile.size / 1024).toFixed(1)} KB • Ready to upload
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAddFile(null);
                            setAddFilePreview("");
                          }}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-500/10 font-semibold"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Option B: Enter Image URL */}
                {addImageSource === "url" && (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={addImageUrl}
                      onChange={(e) => setAddImageUrl(e.target.value)}
                      className="text-xs bg-background"
                    />
                    {addImageUrl && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 border border-border/60">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-background border shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={addImageUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as any).src =
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">
                          Image URL verified & loaded
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description (minimum 10 characters)
                </label>
                <textarea
                  rows={3}
                  minLength={10}
                  placeholder="Enter specifications, warehouse location or SKU notes..."
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetAddForm}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                  className="gap-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {createMutation.isPending ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Publish Product SKU</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. EDIT PRODUCT MODAL */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingProduct(null)}
          />
          <div className="relative z-50 w-full max-w-xl bg-card rounded-2xl border border-border shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Edit Product SKU
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Update catalog metadata, pricing, or replace image for #{editingProduct.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setEditingProduct(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-3.5">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Product Title *
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xs bg-background"
                  required
                />
              </div>

              {/* Category & Quick Add */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditQuickAddCategoryOpen(!isEditQuickAddCategoryOpen)
                    }
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>
                      {isEditQuickAddCategoryOpen ? "Close Quick Add" : "+ New Category"}
                    </span>
                  </button>
                </div>

                {/* Inline Quick Add Category Box */}
                {isEditQuickAddCategoryOpen && (
                  <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 space-y-2 mb-2 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Quick Add New Category
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditQuickAddCategoryOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="e.g. Smart Electronics, Furniture..."
                        value={editQuickCategoryName}
                        onChange={(e) => setEditQuickCategoryName(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          categoryCreateMutation.isPending || !editQuickCategoryName.trim()
                        }
                        onClick={() => {
                          if (editQuickCategoryName.trim().length < 2) {
                            toast.error("Category name must be at least 2 characters");
                            return;
                          }
                          categoryCreateMutation.mutate(editQuickCategoryName.trim());
                        }}
                        className="h-8 px-3 text-xs bg-primary text-primary-foreground font-semibold shrink-0"
                      >
                        {categoryCreateMutation.isPending ? "Adding..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}

                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Unit Price ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="text-xs bg-background"
                  required
                />
              </div>

              {/* Edit Image Source */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    Product Image
                  </label>
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setEditImageSource("url")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        editImageSource === "url"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>Image URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditImageSource("file")}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
                        editImageSource === "file"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload New File</span>
                    </button>
                  </div>
                </div>

                {/* Edit Option: Upload File */}
                {editImageSource === "file" && (
                  <div>
                    {!editFile ? (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsEditDragging(true);
                        }}
                        onDragLeave={() => setIsEditDragging(false)}
                        onDrop={(e) => handleDrop(e, "edit")}
                        className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
                          isEditDragging
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/60 hover:bg-muted/30"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">
                          Click to select new file or drag & drop
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          Replaces existing image on Cloudinary
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "edit")}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-border bg-background shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={editFilePreview}
                              alt="Upload preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground block truncate max-w-[200px]">
                              {editFile.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {(editFile.size / 1024).toFixed(1)} KB • New file selected
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditFile(null);
                            setEditFilePreview("");
                          }}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-500/10 font-semibold"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit Option: URL */}
                {editImageSource === "url" && (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="text-xs bg-background"
                    />
                    {editImageUrl && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 border border-border/60">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-background border shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={editImageUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as any).src =
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">
                          Image preview active
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateMutation.isPending}
                  className="gap-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. REPLENISH / ADJUST STOCK MODAL */}
      {/* ============================================================== */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setStockAdjustProduct(null)}
          />
          <div className="relative z-50 w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Replenish Warehouse Stock
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                    {stockAdjustProduct.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() => setStockAdjustProduct(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleStockSubmit} className="space-y-4 pt-3">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current Stock in Hub</span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {stockAdjustProduct.stockQuantity || 0} Units
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Quantity to Add / Inbound Units *
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 25"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="text-xs bg-background"
                  required
                />
                <p className="text-[10px] text-muted-foreground">
                  This will increment the live inventory stock for this SKU.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStockAdjustProduct(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={stockMutation.isPending}
                  className="gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {stockMutation.isPending ? "Updating..." : "Add to Stock"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. DELETE PRODUCT CONFIRMATION MODAL */}
      {/* ============================================================== */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeletingProduct(null)}
          />
          <div className="relative z-50 w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Archive / Delete Product
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action marks the product as deleted in the central database.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-foreground space-y-1">
              <span className="font-bold block truncate">{deletingProduct.name}</span>
              <span className="text-[11px] font-mono text-muted-foreground">
                SKU #{deletingProduct.id}
              </span>
              <p className="text-[11px] text-rose-600 pt-1">
                ⚠️ Customers will no longer be able to view, order, or purchase this product.
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingProduct(null)}
                className="text-xs"
              >
                Keep Product
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingProduct.id)}
                className="gap-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteMutation.isPending ? "Archiving..." : "Confirm Archive SKU"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MANAGE CATEGORIES MODAL */}
      {/* ============================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Catalog Categories
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create and organize product classification categories
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Create Category Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCategoryName.trim().length < 2) {
                  toast.error("Category name must be at least 2 characters");
                  return;
                }
                categoryCreateMutation.mutate(newCategoryName.trim());
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="New category name (e.g. Electronics, Ergonomics)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="text-xs bg-background h-9"
              />
              <Button
                type="submit"
                size="sm"
                disabled={categoryCreateMutation.isPending || !newCategoryName.trim()}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 shrink-0"
              >
                {categoryCreateMutation.isPending ? (
                  "Adding..."
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </>
                )}
              </Button>
            </form>

            {/* Categories List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between px-1">
                <span>Existing Categories ({categories.length})</span>
                <span>Products In Use</span>
              </div>
              {categories.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No categories found. Create your first category above!
                </div>
              ) : (
                categories.map((cat: any) => {
                  const productCount = products.filter(
                    (p) => p.categoryId === cat.id
                  ).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-xs font-semibold text-foreground">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono px-2 py-0.5"
                        >
                          {productCount} {productCount === 1 ? "SKU" : "SKUs"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={
                            productCount > 0 || categoryDeleteMutation.isPending
                          }
                          onClick={() => {
                            if (productCount > 0) {
                              toast.error(
                                "Cannot delete category because it has associated products"
                              );
                              return;
                            }
                            if (
                              window.confirm(
                                `Are you sure you want to delete category "${cat.name}"?`
                              )
                            ) {
                              categoryDeleteMutation.mutate(cat.id);
                            }
                          }}
                          className={`h-7 w-7 rounded-lg ${
                            productCount > 0
                              ? "opacity-30 cursor-not-allowed text-muted-foreground"
                              : "text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                          }`}
                          title={
                            productCount > 0
                              ? "Cannot delete category containing products"
                              : "Delete empty category"
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
