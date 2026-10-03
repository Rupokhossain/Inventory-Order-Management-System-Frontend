"use client";
import { useState, useEffect, Suspense } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  AlertCircle,
  Sparkles,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/useCartStore";

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addItem = useCartStore((state) => state.addItem);

  // ১. URL State Synchronization
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  // Controlled Input State (ওয়ার্নিং ফিক্স করার জন্য)
  const [searchValue, setSearchValue] = useState(currentSearch);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(currentSearch);
  }, [currentSearch]);

  // ২. UI সর্টিং ভ্যালুকে Prisma ব্যাকএন্ডের আসল ফিল্ডে রূপান্তর (Prisma Error রোধ করতে)
  let sortBy = "createdAt";
  let sortOrder: "asc" | "desc" = "desc";

  if (currentSort === "price-low") {
    sortBy = "price";
    sortOrder = "asc";
  } else if (currentSort === "price-high") {
    sortBy = "price";
    sortOrder = "desc";
  } else if (currentSort === "name") {
    sortBy = "name";
    sortOrder = "asc";
  } else if (currentSort === "newest") {
    sortBy = "createdAt";
    sortOrder = "desc";
  }

  // ৩. URL Filter পরিবর্তন হ্যান্ডলার
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // ৪. ক্যাটাগরি ফেচ
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  // ৫. ব্যাকএন্ডের প্রোডাক্টস ফেচ
  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", currentSearch, currentCategory, sortBy, sortOrder],
    queryFn: () =>
      productService.getProducts({
        searchTerm: currentSearch || undefined,
        categoryId: currentCategory !== "all" ? currentCategory : undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: 1,
        limit: 20,
      }),
  });

  const products: Product[] = productResponse?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Warehouse Live Feed</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Inventory Catalog & Supply
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse verified warehouse stock, live quantities, and order
            fulfillment items.
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-sm px-3.5 py-1">
          {products.length} Products Available
        </Badge>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, SKU..."
            className="pl-10 h-10"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              updateQuery("search", e.target.value);
            }}
          />
        </div>

        <div>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentCategory}
            onChange={(e) => updateQuery("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={currentSort}
            onChange={(e) => updateQuery("sort", e.target.value)}
          >
            <option value="newest">Newest Arrival</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="animate-pulse flex flex-col justify-between overflow-hidden"
            >
              <div className="h-48 bg-muted w-full" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/4 mt-4" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="text-center py-16 border rounded-xl border-dashed">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-3" />
          <h3 className="text-lg font-semibold text-foreground">
            Failed to load inventory
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Unable to connect to the backend server. Please check if your
            backend is running on port 5000.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-16 border rounded-xl border-dashed">
          <PackageCheck className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-foreground">
            No Products Found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search criteria or filter to find what you are
            looking for.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // Prisma ডাটাবেজের stockQuantity এবং imageUrl হ্যান্ডলিং
            const availableStock = product.stockQuantity ?? product.stock ?? 0;
            const productImage =
              product.imageUrl ||
              (product.images && product.images.length > 0
                ? product.images[0]
                : null) ||
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80";
            const isOutOfStock = availableStock <= 0;
            const isLowStock = availableStock > 0 && availableStock <= 5;

            return (
              <Card
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden border-border/60 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="relative h-48 w-full bg-muted overflow-hidden">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      {isOutOfStock ? (
                        <Badge
                          variant="destructive"
                          className="text-xs font-medium"
                        >
                          Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium">
                          Low Stock: {availableStock}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-background/90 backdrop-blur-sm"
                        >
                          Stock: {availableStock}
                        </Badge>
                      )}
                    </div>
                    {product.category?.name && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <Badge
                          variant="outline"
                          className="text-[11px] bg-background/90 backdrop-blur-sm"
                        >
                          {product.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-foreground text-base line-clamp-1 hover:text-primary transition-colors break-words [overflow-wrap:anywhere]"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px] break-words [overflow-wrap:anywhere]">
                      {product.description ||
                        "High-quality inventory supply item verified for warehouse dispatch."}
                    </p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xl font-bold text-foreground">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-4 pt-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Link href={`/products/${product.id}`}>Details</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-xs gap-1.5"
                    disabled={isOutOfStock}
                    onClick={() => addItem(product, 1)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading products catalog...</p>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

