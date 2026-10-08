import Link from "next/link";
import { Package, ShieldCheck, Truck, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Feature Perks */}
      <div className="container mx-auto max-w-7xl px-4 py-8 border-b border-border/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/40 transition-all shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">Fast Order Fulfillment</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Automated inventory-to-shipping pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-emerald-500/40 transition-all shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">Enterprise Security</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Role-based access & encrypted payments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-purple-500/40 transition-all shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight">24/7 Supply Support</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Dedicated logistics & dispatch helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">IOMS.</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent Inventory & Order Management System. Real-time batch tracking, warehouse analytics, and automated order fulfillment.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Product Catalog</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About System</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ & Knowledge Base</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Dashboards</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
              <li><Link href="/manager" className="hover:text-primary transition-colors">Manager Dispatch</Link></li>
              <li><Link href="/dashboard/orders" className="hover:text-primary transition-colors">Customer Orders</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">One-Click Demo Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">System Status</h4>
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Services Operational
            </div>
            <p className="text-xs text-muted-foreground">
              Backend API connected to Vercel production server with PostgreSQL & Prisma ORM.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IOMS Inc. All rights reserved. B7A7 Fullstack Assignment.
        </div>
      </div>
    </footer>
  );
}