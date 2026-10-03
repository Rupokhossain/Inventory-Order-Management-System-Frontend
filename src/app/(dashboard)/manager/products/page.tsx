"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  DollarSign,
  Boxes,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Trash2,
  Edit,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Upload,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ManagerProductsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Wizard Form State
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  // Category Quick-Add State
  const [isQuickAddCategoryOpen, setIsQuickAddCategoryOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");

  // File Upload State
  const [imageSourceType, setImageSourceType] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Stock update modal state
  const [adjustingProduct, setAdjustingProduct] = useState<any | null>(null);
  const [newStockQty, setNewStockQty] = useState<number>(0);

  // Queries
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["manager-products"],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  const products: any[] = productsData?.data || [];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "ALL" ? true : p.categoryId === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === ""
        ? true
        : p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: (payload: any) => productService.createProduct(payload),
    onSuccess: () => {
      toast.success("New product published successfully to warehouse catalog!");
      queryClient.invalidateQueries({ queryKey: ["manager-products"] });
      resetWizard();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create product");
    },
  });

  // Update Stock Mutation
  const stockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      productService.updateStock(id, quantity),
    onSuccess: () => {
      toast.success("Stock quantity updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["manager-products"] });
      setAdjustingProduct(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update stock");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product removed from warehouse system!");
      queryClient.invalidateQueries({ queryKey: ["manager-products"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete product");
    },
  });

  // Category Create Mutation
  const categoryCreateMutation = useMutation({
    mutationFn: (name: string) => productService.createCategory({ name }),
    onSuccess: (data: any) => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setQuickCategoryName("");
      setIsQuickAddCategoryOpen(false);
      if (data?.id) {
        setFormCategoryId(data.id);
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create category");
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setFormName("");
    setFormCategoryId("");
    setFormDescription("");
    setFormPrice("");
    setFormStock("");
    setFormImageUrl("");
    setImageFile(null);
    setImagePreviewUrl(null);
    setImageSourceType("file");
    setIsQuickAddCategoryOpen(false);
    setQuickCategoryName("");
    setIsWizardOpen(false);
  };

  // Step 1 Validation
  const canProceedStep1 =
    formName.trim().length >= 2 &&
    formCategoryId !== "" &&
    formDescription.trim().length >= 10;

  // Step 2 Validation
  const canProceedStep2 =
    Number(formPrice) > 0 &&
    formStock !== "" &&
    Number(formStock) >= 0 &&
    Number.isInteger(Number(formStock));

  const handleCreateSubmit = () => {
    if (!canProceedStep1 || !canProceedStep2) {
      toast.error("Please complete all required fields properly");
      return;
    }

    if (imageSourceType === "file" && imageFile) {
      const formData = new FormData();
      formData.append("name", formName.trim());
      formData.append("categoryId", formCategoryId);
      formData.append("description", formDescription.trim());
      formData.append("price", String(formPrice));
      formData.append("stockQuantity", String(formStock));
      formData.append("image", imageFile);
      createMutation.mutate(formData);
    } else {
      createMutation.mutate({
        name: formName.trim(),
        categoryId: formCategoryId,
        description: formDescription.trim(),
        price: Number(formPrice),
        stockQuantity: Number(formStock),
        imageUrl:
          formImageUrl.trim() ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      });
    }
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find((c: any) => c.id === id);
    return cat ? cat.name : "General Category";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Warehouse Product Inventory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage SKU listings, batch levels, unit pricing, and multi-step catalogue creation.
          </p>
        </div>
        <Button
          onClick={() => {
            if (categories.length > 0 && !formCategoryId) {
              setFormCategoryId(categories[0].id);
            }
            setIsWizardOpen(true);
          }}
          size="sm"
          className="gap-2 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product (Wizard)</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search SKU or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Products Table (Invenza SaaS Style) */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {isProductsLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="animate-spin h-7 w-7 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              Loading warehouse stock records...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No products found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No items match your filter criteria. Click the button above to launch the Product Creation Wizard.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-4 py-3">Product Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Inventory Stock</th>
                  <th className="px-4 py-3">Stock Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const isLow = (p.stockQuantity ?? 0) <= 5;
                  const isOutOfStock = (p.stockQuantity ?? 0) === 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Product Item info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-lg border border-border/80 overflow-hidden bg-muted/30 shrink-0 relative">
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
                          <div className="min-w-0">
                            <span className="font-bold text-foreground text-xs block truncate max-w-[220px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              SKU: #{p.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {p.category?.name || getCategoryName(p.categoryId)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-foreground text-sm">
                          ${Number(p.price || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Stock Level with progress bar */}
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-foreground">
                              {p.stockQuantity ?? 0} Units
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOutOfStock
                                  ? "bg-rose-500 w-full"
                                  : isLow
                                  ? "bg-amber-500 w-[25%]"
                                  : "bg-emerald-500 w-[80%]"
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {isOutOfStock ? (
                          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5">
                            Out of Stock
                          </Badge>
                        ) : isLow ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5">
                            In Stock
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px] font-semibold gap-1"
                            onClick={() => {
                              setAdjustingProduct(p);
                              setNewStockQty(p.stockQuantity ?? 0);
                            }}
                          >
                            <Boxes className="h-3 w-3" />
                            <span>Stock</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to remove ${p.name}?`
                                )
                              ) {
                                deleteMutation.mutate(p.id);
                              }
                            }}
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
        )}
      </div>

      {/* QUICK STOCK ADJUST MODAL */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                Adjust Stock Quantity
              </h3>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {adjustingProduct.name}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Current warehouse stock: {adjustingProduct.stockQuantity ?? 0}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                New Available Quantity
              </label>
              <Input
                type="number"
                min="0"
                value={newStockQty}
                onChange={(e) => setNewStockQty(Number(e.target.value))}
                className="text-sm font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setAdjustingProduct(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs font-semibold"
                disabled={stockMutation.isPending}
                onClick={() =>
                  stockMutation.mutate({
                    id: adjustingProduct.id,
                    quantity: newStockQty,
                  })
                }
              >
                {stockMutation.isPending ? "Updating..." : "Confirm Stock"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-STEP ADD PRODUCT WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-xs">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Add Product — Multi-Step Wizard
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Step {wizardStep} of 3:{" "}
                    {wizardStep === 1
                      ? "Basic Identity & Category"
                      : wizardStep === 2
                      ? "Pricing & Warehouse Stock"
                      : "Media & Final Verification"}
                  </p>
                </div>
              </div>
              <button
                onClick={resetWizard}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border ${
                    wizardStep === 1
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : wizardStep > 1
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {wizardStep > 1 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>1</span>
                  )}
                  <span>1. Details</span>
                </div>

                <div
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border ${
                    wizardStep === 2
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : wizardStep > 2
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {wizardStep > 2 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>2</span>
                  )}
                  <span>2. Inventory</span>
                </div>

                <div
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border ${
                    wizardStep === 3
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <span>3</span>
                  <span>3. Review</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: BASIC INFORMATION */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Product Title / Name *
                  </label>
                  <Input
                    placeholder="e.g. Ergonomic Industrial Office Chair"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="text-xs bg-background"
                  />
                  {formName.trim().length > 0 && formName.trim().length < 2 && (
                    <p className="text-[10px] text-rose-500">
                      Product name must be at least 2 characters.
                    </p>
                  )}
                </div>

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
                          placeholder="e.g. Smart Electronics, Laptops..."
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
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="" disabled>
                      {categories.length === 0
                        ? "No categories found — Click '+ New Category' above"
                        : "Select warehouse category"}
                    </option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Product Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide detailed technical specifications, dimensions, and materials (min 10 characters)..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Minimum 10 characters required</span>
                    <span>{formDescription.length} / 1000</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PRICING & STOCK */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      Unit Price (USD / BDT) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="e.g. 149.99"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="text-xs bg-background font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Base unit price before regional taxes
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Boxes className="h-3.5 w-3.5 text-primary" />
                      Warehouse Stock Quantity *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 50"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="text-xs bg-background font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Physical units available at central hub
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Stock quantity below 5 units will automatically trigger the low-stock alert pill in managerial dispatches.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: MEDIA & FINAL REVIEW */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      Product Showcase Media *
                    </label>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg border border-border bg-muted/30">
                      <button
                        type="button"
                        onClick={() => setImageSourceType("file")}
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          imageSourceType === "file"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceType("url")}
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                          imageSourceType === "url"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageSourceType === "file" ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                        isDragging
                          ? "border-primary bg-primary/10 scale-[0.99]"
                          : imageFile
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-border hover:border-primary/50 bg-muted/10 hover:bg-muted/20"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileSelect(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {imageFile ? (
                        <div className="flex items-center justify-center gap-3">
                          {imagePreviewUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreviewUrl}
                              alt="Thumbnail preview"
                              className="h-12 w-12 rounded-lg object-cover border border-emerald-500/40 shadow-xs"
                            />
                          )}
                          <div className="text-left">
                            <p className="text-xs font-bold text-foreground truncate max-w-[200px]">
                              {imageFile.name}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-medium">
                              {(imageFile.size / 1024).toFixed(1)} KB • Ready for upload
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
                          <p className="text-xs font-semibold text-foreground">
                            Drop product photo here or click to browse
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Supports PNG, JPG, WebP up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="text-xs bg-background"
                      />
                      <div className="flex gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-[10px] h-6 px-2"
                          onClick={() =>
                            setFormImageUrl(
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
                            )
                          }
                        >
                          Sample Headphone
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-[10px] h-6 px-2"
                          onClick={() =>
                            setFormImageUrl(
                              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60"
                            )
                          }
                        >
                          Sample Camera
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Review Card */}
                <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground pb-2 border-b border-border/60">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Review Specification Before Catalog Dispatch
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg border border-border overflow-hidden bg-muted/40 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          imagePreviewUrl ||
                          formImageUrl.trim() ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60"
                        }
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {formName}
                      </h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {formDescription}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="font-bold text-primary font-mono">
                          ${Number(formPrice).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground font-semibold">
                          {formStock} in stock
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                          {getCategoryName(formCategoryId)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              {wizardStep > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWizard}
                  className="text-xs"
                >
                  Cancel
                </Button>
              )}

              {wizardStep < 3 ? (
                <Button
                  size="sm"
                  disabled={
                    (wizardStep === 1 && !canProceedStep1) ||
                    (wizardStep === 2 && !canProceedStep2)
                  }
                  onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={createMutation.isPending}
                  onClick={handleCreateSubmit}
                  className="gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {createMutation.isPending
                      ? "Publishing..."
                      : "Confirm & Publish Product"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
