"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 w-72 max-w-[85vw] bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Operations Hub
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-foreground hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 lg:h-18 border-b border-border bg-card/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Mobile Hamburger Menu Toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-10 w-10 shrink-0"
              onClick={() => setMobileOpen(true)}
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-xl border border-border/80 hover:bg-muted"
              title="Return to Public Storefront"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-xl border border-border/80 hover:bg-muted"
              title="View Product Catalog"
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>Catalog</span>
            </Link>

            <span className="text-muted-foreground/30 hidden lg:inline">|</span>

            <div className="hidden lg:flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-foreground truncate">
                Warehouse Fulfillment & Dispatch Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-background text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Live Storefront</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}