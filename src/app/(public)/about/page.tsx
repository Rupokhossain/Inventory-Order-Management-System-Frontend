import {
  Package,
  ShieldCheck,
  Truck,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          <Package className="h-3.5 w-3.5" />
          <span>ENTERPRISE SUPPLY CHAIN LOGISTICS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Architected for High-Volume Inventory & Real-Time Dispatches
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          IOMS provides enterprise-grade inventory tracking, automated dispatch pipelines, and cryptographic payment reconciliation for fast-growing commerce networks.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Cpu className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Automated Stock Sync
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Eliminate overselling with transactional stock reservation, rollback mechanics on unpaid orders, and real-time low-stock telemetry.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Role-Based Governance
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Strict RBAC separation across Super Admins, Logistics Managers, and Customers, enforced at both API middleware and UI routing layers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Multi-Stage Fulfillment
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            From initial placement to packaging, courier handoff, and doorstep delivery, every phase is tracked with instant receipt generation.
          </p>
        </div>
      </div>

      {/* Operational Numbers */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-primary">100%</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">
              Stock Integrity SLA
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-foreground">50ms</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">
              Median API Latency
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">3 Tiers</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">
              Admin, Manager & Customer
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-600">Dual-Mode</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1">
              bKash Sandbox & PGW
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-primary text-primary-foreground p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready to experience frictionless order dispatches?
        </h2>
        <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-xl mx-auto">
          Explore our real-time product inventory or sign in to test the manager and customer fulfillment dashboards.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/products">
            <Button
              variant="secondary"
              className="gap-2 font-bold shadow-md text-xs sm:text-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-xs sm:text-sm"
            >
              Demo Portals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
