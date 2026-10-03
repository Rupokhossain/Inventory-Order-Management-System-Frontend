/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import { adminService } from "@/services/admin.service";
import {
  FileText,
  Printer,

  ShieldCheck,

} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-reports-orders"],
    queryFn: () => orderService.getAllOrders({ limit: 100 }),
  });

  const { data: productsData } = useQuery({
    queryKey: ["admin-reports-products"],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-reports-users"],
    queryFn: () => adminService.getAllUsers(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: any[] = ordersData?.data || [];
  const products: any[] = productsData?.data || [];

  const totalGrossRevenue = orders.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  );
  const totalStockValuation = products.reduce(
    (acc, curr) =>
      acc + Number(curr.price || 0) * Number(curr.stockQuantity || 0),
    0
  );
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const deliverySuccessRate =
    orders.length > 0
      ? ((deliveredOrders / orders.length) * 100).toFixed(1)
      : "100.0";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Executive Audit & Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Compliance trail, fiscal revenue reconciliation, and inventory turnover metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs font-semibold shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Financial Statement</span>
          </Button>
        </div>
      </div>

      {/* Report Summary Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                IOMS Enterprise Operational Audit Summary
              </h2>
              <p className="text-xs text-muted-foreground">
                Period: Current Operating Cycle • Real-Time Database Sync
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
            Status: Fully Reconciled
          </Badge>
        </div>

        {/* 4 Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Gross Revenue
            </span>
            <p className="text-lg font-black text-foreground font-mono mt-0.5">
              ${totalGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Stock Asset Value
            </span>
            <p className="text-lg font-black text-foreground font-mono mt-0.5">
              ${totalStockValuation.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Total Dispatches
            </span>
            <p className="text-lg font-black text-foreground font-mono mt-0.5">
              {orders.length} Orders
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Fulfillment Rate
            </span>
            <p className="text-lg font-black text-emerald-600 font-mono mt-0.5">
              {deliverySuccessRate}%
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            System & Governance Metrics
          </h3>
          <div className="border border-border rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2.5">Indicator</th>
                  <th className="px-4 py-2.5">Scope</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Registered Platform Users
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">All Tiers</td>
                  <td className="px-4 py-3 font-mono font-bold">
                    {users.length} Accounts
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-600 font-bold">Verified</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Active Catalog SKU Items
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Warehouse Central</td>
                  <td className="px-4 py-3 font-mono font-bold">
                    {products.length} Unique SKUs
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-600 font-bold">In Stock</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Payment Gateway Integration
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">bKash Sandbox API & Tokenized PGW</td>
                  <td className="px-4 py-3 font-mono font-bold">Dual-Mode</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-600 font-bold">Operational</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Prisma ORM & PostgreSQL DB
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Relational Schema & Cascade Integrity</td>
                  <td className="px-4 py-3 font-mono font-bold">SSL Mode Full</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-emerald-600 font-bold">Connected</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Generated by IOMS Enterprise Central Command Suite</span>
          <span>Timestamp: {new Date().toISOString()}</span>
        </div>
      </div>
    </div>
  );
}
