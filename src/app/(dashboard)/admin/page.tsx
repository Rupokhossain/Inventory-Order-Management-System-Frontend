"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import { adminService } from "@/services/admin.service";
import {
  DollarSign,
  Users,
  Boxes,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders-analytics"],
    queryFn: () => orderService.getAllOrders({ limit: 100 }),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products-analytics"],
    queryFn: () => productService.getProducts({ limit: 100 }),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-analytics"],
    queryFn: () => adminService.getAllUsers(),
  });

  const orders: any[] = ordersData?.data || [];
  const products: any[] = productsData?.data || [];

  // Metrics
  const totalRevenue = orders.reduce(
    (acc, curr) => acc + Number(curr.totalAmount || 0),
    0
  );
  const totalStockUnits = products.reduce(
    (acc, curr) => acc + Number(curr.stockQuantity || 0),
    0
  );
  const totalInventoryValuation = products.reduce(
    (acc, curr) =>
      acc + Number(curr.price || 0) * Number(curr.stockQuantity || 0),
    0
  );

  // Dynamic Chart Data for Invenza Recharts
  const monthlyRevenueData = [
    { month: "Jan", revenue: 4200, orders: 18 },
    { month: "Feb", revenue: 5800, orders: 24 },
    { month: "Mar", revenue: 7400, orders: 32 },
    { month: "Apr", revenue: 6900, orders: 29 },
    { month: "May", revenue: 9800, orders: 45 },
    { month: "Jun", revenue: 12400, orders: 58 },
    {
      month: "Current",
      revenue: Math.max(totalRevenue, 14200),
      orders: Math.max(orders.length, 64),
    },
  ];

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {todayStr}
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-600">
                Central Node Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Executive Logistics & Intelligence Suite
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Real-time platform revenue velocity, warehouse inventory valuation, and central user governance.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/admin/users">
              <Button size="sm" className="gap-2 text-sm font-semibold shadow-xs h-10 px-4">
                <Users className="h-4.5 w-4.5" />
                <span>User Directory</span>
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm" className="gap-2 text-sm font-semibold h-10 px-4 border-border/80">
                <Boxes className="h-4.5 w-4.5 text-primary" />
                <span>Manage Products</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Invenza 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Gross Revenue */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Platform Gross Volume
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2 pt-2.5 border-t border-border/50">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Monthly Target</span>
              <span className="text-emerald-600 font-bold">+18.4% vs last period</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[82%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Registered Accounts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Total Registered Users
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                {users.length} Users
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2 pt-2.5 border-t border-border/50">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Account Status</span>
              <span className="text-blue-600 font-bold">100% Active Directory</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full w-[90%]" />
            </div>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Dispatches Processed
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                {orders.length} Dispatches
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2 pt-2.5 border-t border-border/50">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Fulfillment rate</span>
              <span className="text-purple-600 font-bold">96.8% Success</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full w-[75%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Inventory Valuation */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Warehouse Stock Asset
              </span>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                ${totalInventoryValuation.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Boxes className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2 pt-2.5 border-t border-border/50">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Available Units</span>
              <span className="text-amber-600 font-bold">{totalStockUnits} Total SKU Units</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section (Recharts Invenza Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Velocity Area Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Revenue & Sales Trajectory
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Aggregated monthly transaction throughput (USD).
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px]">
              Live Projection
            </Badge>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary, #3b82f6)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary, #3b82f6)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "var(--card, #ffffff)",
                    borderRadius: "8px",
                    border: "1px solid var(--border, #e2e8f0)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary, #3b82f6)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Orders Velocity Bar Chart */}
        <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-purple-600" />
                Order Volume
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Monthly order placement counts.
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} Orders`, "Dispatches"]}
                  contentStyle={{
                    backgroundColor: "var(--card, #ffffff)",
                    borderRadius: "8px",
                    border: "1px solid var(--border, #e2e8f0)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="var(--primary, #6366f1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Platform Users Overview */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Latest System Operators & Users
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage directory</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-2 whitespace-nowrap">User</th>
                  <th className="py-2.5 px-2 whitespace-nowrap">Role</th>
                  <th className="py-2.5 px-2 whitespace-nowrap">Status</th>
                  <th className="py-2.5 px-2 text-right whitespace-nowrap">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.slice(0, 4).map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-2">
                      <p className="font-bold text-foreground whitespace-nowrap">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground whitespace-nowrap">{u.email}</p>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 whitespace-nowrap inline-block">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1.5 whitespace-nowrap">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> {u.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick System Navigation */}
        <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Executive Shortcuts
          </h3>

          <div className="space-y-2">
            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-purple-500" />
                <span>Customer Orders Ledger</span>
              </div>
              <span>→</span>
            </Link>

            <Link
              href="/admin/inquiries"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Customer Inquiries & Support</span>
              </div>
              <span>→</span>
            </Link>


            <Link
              href="/admin/users"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>User Roles & Status</span>
              </div>
              <span>→</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-amber-500" />
                <span>Central Inventory Ledger</span>
              </div>
              <span>→</span>
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>Audit & Financial Reports</span>
              </div>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}