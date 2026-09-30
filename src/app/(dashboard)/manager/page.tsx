"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import {
  Truck,
  PackageCheck,
  AlertCircle,
  Clock,
  Boxes,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ManagerDashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["manager-recent-orders"],
    queryFn: () => orderService.getAllOrders({ limit: 10 }),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["manager-products-overview"],
    queryFn: () => productService.getProducts({ limit: 50 }),
  });

  const orders: any[] = ordersData?.data || [];
  const products: any[] = productsData?.data || [];

  // Metrics
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const processingOrders = orders.filter((o) => o.status === "PROCESSING").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const lowStockProducts = products.filter((p) => (p.stockQuantity ?? 0) <= 5);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Invenza Hero Welcome Banner */}
      <div className="rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {todayStr}
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-600">
                Logistics Hub Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Manager Logistics & Warehouse Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Monitor incoming customer dispatches, manage warehouse SKU inventory, and control real-time packaging stages.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/manager/products">
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
                <Plus className="h-4 w-4" />
                <span>Add Product (Wizard)</span>
              </Button>
            </Link>
            <Link href="/manager/orders">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                <Truck className="h-4 w-4" />
                <span>Dispatch Pipeline</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Invenza 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending */}
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Verification
              </span>
              <div className="text-2xl font-black text-amber-600">
                {pendingOrders}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>Order Queue</span>
              <span className="text-amber-600 font-bold">Awaiting confirmation</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="bg-amber-500 h-full w-[45%]" />
            </div>
          </div>
        </div>

        {/* Card 2: In Dispatch */}
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Processing Dispatch
              </span>
              <div className="text-2xl font-black text-purple-600">
                {processingOrders}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>Packing & Route</span>
              <span className="text-purple-600 font-bold">Dispatched</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="bg-purple-500 h-full w-[65%]" />
            </div>
          </div>
        </div>

        {/* Card 3: Delivered */}
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Completed Today
              </span>
              <div className="text-2xl font-black text-emerald-600">
                {deliveredOrders}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>Fulfillment rate</span>
              <span className="text-emerald-600 font-bold">98.4% on-time</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[95%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Low Stock Warnings */}
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Low Stock Warnings
              </span>
              <div className="text-2xl font-black text-rose-600">
                {lowStockProducts.length.toString().padStart(2, "0")}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span>Warehouse Stock</span>
              <span className="text-rose-600 font-bold">Re-order required</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div className="bg-rose-500 h-full w-[35%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Orders Table & Low Stock Alert Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Dispatch Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Active Dispatch Queue
            </h3>
            <Link
              href="/manager/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage all orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
            {ordersLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Loading dispatches...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No orders recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          #{o.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground block">
                            {o.customer?.name || "Customer"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {o.customer?.email}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          ${Number(o.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {o.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href="/manager/orders">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Inspect
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Low Stock Warnings & Inventory Shortcuts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Low Stock Warnings
            </h3>
            <Link
              href="/manager/products"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Adjust
            </Link>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-3">
            {productsLoading ? (
              <p className="text-xs text-muted-foreground">Checking inventory...</p>
            ) : lowStockProducts.length === 0 ? (
              <div className="p-4 text-center space-y-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  Stock Healthy
                </p>
                <p className="text-[11px] text-muted-foreground">
                  All warehouse items exceed the 5-unit threshold.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-foreground truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-rose-600 font-semibold">
                        Only {p.stockQuantity ?? 0} units remaining
                      </p>
                    </div>
                    <Link href="/manager/products">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] h-6 px-2 text-rose-600 border-rose-500/30"
                      >
                        Restock
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <Link href="/manager/products">
                <Button className="w-full text-xs font-semibold gap-1.5" size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Launch Product Creation Wizard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}