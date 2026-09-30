"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/useCartStore";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration safety
  if (!mounted) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-72 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();
  const estimatedShipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const estimatedTax = subtotal * 0.05; 
  const totalAmount = subtotal + estimatedShipping + estimatedTax;

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full text-primary mb-6">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm leading-relaxed">
          Looks like you haven&apos;t added any warehouse inventory supplies to your cart yet. Explore our live catalog to fulfill your supply orders.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Inventory Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Warehouse Order Cart
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review allocated stock, modify quantities, and confirm dispatch batches.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <Badge variant="outline" className="text-xs sm:text-sm px-3.5 py-1">
            {totalItems} {totalItems === 1 ? "Item" : "Items"} Allocated
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive h-8"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const availableStock = product.stockQuantity ?? product.stock ?? 999;
            const productImage =
              product.imageUrl ||
              (product.images && product.images.length > 0 ? product.images[0] : null) ||
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80";
            const itemTotal = Number(product.price) * quantity;

            return (
              <Card
                key={product.id}
                className="overflow-hidden border-border/70 hover:border-border transition-all"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-lg overflow-hidden border border-border/80 bg-muted"
                  >
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover object-center"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    {product.category?.name && (
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {product.category.name}
                      </Badge>
                    )}
                    <Link
                      href={`/products/${product.id}`}
                      className="block font-bold text-foreground hover:text-primary transition-colors text-base truncate"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Unit Price: <span className="font-semibold text-foreground">${Number(product.price).toFixed(2)}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Warehouse Stock Limit: <span className="text-foreground font-medium">{availableStock}</span>
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-9 text-center font-bold text-xs">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= availableStock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className="text-base font-extrabold text-foreground">
                      ${itemTotal.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(product.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="space-y-4">
          <Card className="border-border/80 shadow-sm bg-card">
            <CardHeader className="p-5 border-b border-border/60">
              <CardTitle className="text-lg font-bold text-foreground">
                Dispatch Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Logistics & Freight</span>
                <span>
                  {estimatedShipping === 0 ? (
                    <Badge variant="secondary" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Free Shipping
                    </Badge>
                  ) : (
                    <span className="font-semibold text-foreground">${estimatedShipping.toFixed(2)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated VAT / Tax (5%)</span>
                <span className="font-semibold text-foreground">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-foreground">Total Payable</span>
                  <p className="text-[11px] text-muted-foreground">Includes applicable local dispatch taxes</p>
                </div>
                <span className="text-2xl font-extrabold text-foreground">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full gap-2 text-sm font-semibold shadow-md"
                onClick={() => router.push("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Logistics Trust Guarantee */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Enterprise Grade Order Protection</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All transactions are encrypted with 256-bit TLS security. Direct integration with official payment gateways (Stripe & bKash sandbox).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
