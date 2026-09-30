import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, ShieldCheck, Bell } from "lucide-react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar navigation */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-md hover:bg-muted"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
                Customer Fulfillment & Order Tracking Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-background text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">My Cart</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
