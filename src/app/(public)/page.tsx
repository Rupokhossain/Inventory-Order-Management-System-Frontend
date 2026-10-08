import Link from "next/link";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  BarChart3,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Invenza v2.0 Engine • Real-Time Inventory Control</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Intelligent Inventory Control &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Instant Order Fulfillment
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Enterprise-grade warehouse inventory, automated batch tracking, and real-time order processing tailored for modern commerce and logistics.
            </p>

            {/* Hero Quick Search Bar */}
            <form
              action="/products"
              method="GET"
              className="w-full max-w-lg flex items-center gap-2 pt-1"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  name="search"
                  placeholder="Search products by name or SKU..."
                  className="pl-10 h-11 bg-background/90 shadow-sm"
                />
              </div>
              <Button type="submit" className="h-11 px-5 gap-1.5 shadow-sm">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </form>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Link href="/products">
                <Button size="lg" className="gap-2 text-base px-6 h-12 shadow-md">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2 text-base px-6 h-12">
                  <Zap className="h-4 w-4 text-amber-500" />
                  One-Click Demo Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Invenza-Style Interactive Live Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-foreground">
                  Warehouse Live Status (Central Hub)
                </span>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Live Sync
              </Badge>
            </div>

            {/* Mini Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Total Sales</span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">$17,584</div>
                <div className="text-xs text-emerald-500 font-medium mt-1">↑ 12.5% vs last month</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Active Orders</span>
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">128 Orders</div>
                <div className="text-xs text-primary font-medium mt-1">45 pending dispatch</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Qty in Hand</span>
                  <Package className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">1,420 Items</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">Across 14 categories</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
                  <span>Low Stock Alert</span>
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-rose-500">03 Items</div>
                <div className="text-xs text-rose-500 font-medium mt-1">Needs reordering</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST METRICS BAR */}
      <section className="border-y border-border bg-card/60 py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-foreground">1,200+</div>
              <div className="text-sm text-muted-foreground mt-1">Tracked SKU Products</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime & Reliability</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground">15,000+</div>
              <div className="text-sm text-muted-foreground mt-1">Delivered Orders</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground">3 Roles</div>
              <div className="text-sm text-muted-foreground mt-1">Admin, Manager & Customer</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Built for High-Velocity Inventory Operations
            </h2>
            <p className="text-muted-foreground text-base">
              Everything you need to manage warehouses, process complex orders, and maintain 100% stock accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Real-Time Stock Tracking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automatic inventory deductions upon order confirmation. Instant alerts when stock levels fall below critical thresholds.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">3-Tier RBAC Workflows</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dedicated dashboards for Admins, Managers, and Customers with strict route protection and role-based UI actions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 w-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Secure Payment Gateway</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Integrated with Stripe and bKash test payment gateways with automated invoice generation and status updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}