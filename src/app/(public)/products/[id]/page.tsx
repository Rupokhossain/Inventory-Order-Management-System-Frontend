"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productService } from "@/services/product.service";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });

  // ২. ক্যাটাগরির অন্যান্য প্রোডাক্ট অথবা ক্যাটালগের অন্যান্য প্রোডাক্ট
  const { data: relatedResponse } = useQuery({
    queryKey: ["related-products", product?.categoryId],
    queryFn: () =>
      productService.getProducts({
        categoryId: product?.categoryId,
        limit: 4,
      }),
    enabled: !!product?.categoryId,
  });

  const { data: fallbackResponse } = useQuery({
    queryKey: ["fallback-catalog-products"],
    queryFn: () => productService.getProducts({ limit: 6 }),
  });

  const categoryRelated = (relatedResponse?.data || []).filter(
    (p) => p.id !== productId
  );

  const displayRelated =
    categoryRelated.length > 0
      ? categoryRelated
      : (fallbackResponse?.data || []).filter((p) => p.id !== productId).slice(0, 4);

  const [activeTab, setActiveTab] = useState<"specs" | "logistics" | "policy">("specs");

  const availableStock = product?.stockQuantity ?? product?.stock ?? 0;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const productImage =
    product?.imageUrl ||
    (product?.images && product.images.length > 0 ? product.images[0] : null) ||
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80";

  // কোয়ান্টিটি ইনক্রিমেন্ট/ডিক্রিমেন্ট
  const handleIncrease = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Maximum available warehouse stock is ${availableStock}`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // কার্টে যোগ করা
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addItem(product, quantity);
  };

  // সরাসরি Buy Now (কার্টে যোগ করে কার্ট পেজে রিডাইরেক্ট)
  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
    addItem(product, quantity);
    router.push("/cart");
  };

  // কপি লিঙ্ক
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  // লোডিং স্টেট (Skeleton)
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-6 w-32 bg-muted rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[450px] bg-muted rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-24 bg-muted rounded animate-pulse" />
            <div className="h-12 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // এরর বা প্রোডাক্ট না পাওয়া গেলে
  if (isError || !product) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full text-destructive mb-4">
          <XCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">
          The requested product ID does not exist or has been removed from warehouse inventory.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push("/products")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inventory Catalog</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Inventory
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
        {/* Left Column: Product Image using next/image */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-sm group">
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Stock Badge Overlay */}
            <div className="absolute top-4 right-4 z-10">
              {isOutOfStock ? (
                <Badge variant="destructive" className="px-3 py-1 font-semibold text-xs shadow-md">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 font-semibold text-xs shadow-md">
                  Low Stock: Only {availableStock} Left
                </Badge>
              ) : (
                <Badge variant="secondary" className="px-3 py-1 font-semibold text-xs bg-background/90 backdrop-blur-md shadow-md">
                  Ready to Dispatch ({availableStock} units)
                </Badge>
              )}
            </div>

            {product.category?.name && (
              <div className="absolute bottom-4 left-4 z-10">
                <Badge variant="outline" className="bg-background/90 backdrop-blur-md text-xs font-medium">
                  {product.category.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Logistics Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-card/60">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-foreground">Fast Dispatch</p>
                <p className="text-muted-foreground">Within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-card/60">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-foreground">Verified Stock</p>
                <p className="text-muted-foreground">Direct inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-card/60">
              <RotateCcw className="h-5 w-5 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-foreground">Easy Return</p>
                <p className="text-muted-foreground">7 days policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enterprise Warehouse Verified</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-extrabold text-foreground">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground border-l border-border pl-4">
                  SKU: <span className="font-mono text-foreground font-semibold">{product.id.slice(0, 10).toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-border py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Product Overview
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {product.description ||
                  "This high-grade inventory item has been quality-checked and stored in regulated warehouse facilities. Available for rapid packing and logistics distribution."}
              </p>
            </div>

            {/* Live Inventory Status Box */}
            <Card className="border-border/60 bg-muted/40">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-primary" />
                    Warehouse Availability:
                  </span>
                  {isOutOfStock ? (
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Low Stock ({availableStock} units left)
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {availableStock} Units in Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary" />
                    Classification:
                  </span>
                  <span className="font-semibold text-foreground">
                    {product.category?.name || "General Supplies"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-sm">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={handleIncrease}
                      disabled={quantity >= availableStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Subtotal:{" "}
                    <strong className="text-foreground text-sm font-bold">
                      ${(Number(product.price) * quantity).toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 gap-2 text-sm font-semibold"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 text-sm font-semibold"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0"
                onClick={handleShare}
                title="Share Product"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16 border-t border-border pt-10">
        <div className="flex border-b border-border gap-6">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "specs"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Specifications & Details
          </button>
          <button
            onClick={() => setActiveTab("logistics")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "logistics"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Warehouse & Logistics
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "policy"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Shipping & Return Policy
          </button>
        </div>

        <div className="py-6">
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">SKU Code</span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {product.id.slice(0, 10).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">Full System ID</span>
                <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                  {product.id}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">Category Classification</span>
                <span className="text-xs font-semibold text-foreground">
                  {product.category?.name || "General Supplies"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">Warehouse Inventory Status</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {availableStock} Units Available
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">Storage Location</span>
                <span className="text-xs font-semibold text-foreground">
                  Central Distribution Hub, Bay #4
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card">
                <span className="text-xs text-muted-foreground font-medium">Verification</span>
                <span className="text-xs font-semibold text-primary">
                  100% Authentic & Barcode Audited
                </span>
              </div>
            </div>
          )}

          {activeTab === "logistics" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Order Dispatch & Packing SLA
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All confirmed orders received before 4:00 PM BST are immediately routed to our automated warehouse fulfillment pipeline. Items undergo optical barcode scanning, physical inspection, and anti-static protective bubble wrapping before container dispatch.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Chain of Custody & Security
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every batch dispatch is stamped with an internal cryptographic order manifest. Serial numbers are logged directly to the dispatch registry to guarantee zero tampering during transit.
                </p>
              </div>
            </div>
          )}

          {activeTab === "policy" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  7-Day Replacement Policy
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If an item arrives damaged or with factory defects, report it within 7 days of delivery. Our customer support team will process an instant warehouse exchange or return voucher.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  1-Year Manufacturer Warranty
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Covered under official brand service support. Official purchase receipts and serial numbers can be downloaded directly from your customer order dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related / More Products Section */}
      {displayRelated.length > 0 && (
        <div className="mt-12 border-t border-border pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {categoryRelated.length > 0
                  ? "Related Supplies in this Category"
                  : "More Warehouse Supplies & Equipment"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Explore more high-demand inventory items currently in stock.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-primary text-xs font-medium hover:underline gap-1"
            >
              <span>View All Inventory</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayRelated.map((rel) => {
              const relImage =
                rel.imageUrl ||
                (rel.images && rel.images.length > 0 ? rel.images[0] : null) ||
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80";

              return (
                <Card
                  key={rel.id}
                  className="group flex flex-col justify-between overflow-hidden border-border/60 hover:shadow-md transition-all"
                >
                  <Link href={`/products/${rel.id}`} className="block">
                    <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
                      <Image
                        src={relImage}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-sm font-bold text-foreground mt-1">
                        ${Number(rel.price).toFixed(2)}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}