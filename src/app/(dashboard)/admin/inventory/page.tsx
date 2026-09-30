"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ArrowUpRight,
  RefreshCw,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminInventoryPage() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["admin-inventory-ledger"],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const products: any[] = response?.data || [];

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
          p.id?.toLowerCase().includes(searchQuery.toLowerCase());

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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Boxes className="h-6 w-6 text-primary" />
            Central Warehouse Inventory Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time multi-SKU stock valuation, batch levels, and shortage reorder alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Ledger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Stock
          </Button>
        </div>
      </div>

      {/* KPI Cards Row (Invenza 4-Card Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Valuation
            </span>
            <div className="text-2xl font-black text-foreground">
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Live asset value
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Units In Hub
            </span>
            <div className="text-2xl font-black text-foreground">
              {totalUnits} Units
            </div>
            <span className="text-[10px] text-muted-foreground">
              Across {products.length} SKUs
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Boxes className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className="text-2xl font-black text-amber-600">
              {lowStockCount} Items
            </div>
            <span className="text-[10px] text-amber-600 font-semibold">
              ≤ 5 units remaining
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="text-2xl font-black text-rose-600">
              {outOfStockCount} Items
            </div>
            <span className="text-[10px] text-rose-600 font-semibold">
              Replenishment needed
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
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

      {/* Inventory Table */}
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
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border font-bold">
                <tr>
                  <th className="px-4 py-3">SKU & Item Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Units in Hub</th>
                  <th className="px-4 py-3">Total Asset Valuation</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const stock = Number(p.stockQuantity || 0);
                  const price = Number(p.price || 0);
                  const valuation = stock * price;
                  const isOutOfStock = stock === 0;
                  const isLow = stock > 0 && stock <= 5;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Product Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg border border-border overflow-hidden bg-muted/30 shrink-0">
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
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {p.category?.name || "Standard SKU"}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-foreground">
                          ${price.toFixed(2)}
                        </span>
                      </td>

                      {/* Stock Units */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-foreground text-sm font-mono">
                          {stock} Units
                        </span>
                      </td>

                      {/* Valuation */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-primary text-sm">
                          ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-right">
                        {isOutOfStock ? (
                          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold px-2 py-0.5">
                            Depleted
                          </Badge>
                        ) : isLow ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold px-2 py-0.5">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold px-2 py-0.5">
                            Healthy
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
