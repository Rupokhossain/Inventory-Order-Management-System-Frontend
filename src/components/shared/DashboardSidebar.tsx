"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  LayoutDashboard,
  Users,
  Boxes,
  FileText,
  Truck,
  PlusCircle,
  ShoppingBag,
  LogOut,
  User,
  CreditCard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps = {}) {
  const pathname = usePathname();
  const { user, role, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin Navigation Groups
  const adminSections: NavSection[] = [
    {
      title: "EXECUTIVE SUITE",
      items: [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "User Directory", href: "/admin/users", icon: Users },
      ],
    },
    {
      title: "LOGISTICS & STOCK",
      items: [
        { name: "Products & Inventory", href: "/admin/inventory", icon: Boxes },
        { name: "Audit & Reports", href: "/admin/reports", icon: FileText },
      ],
    },
  ];

  // Manager Navigation Groups
  const managerSections: NavSection[] = [
    {
      title: "OPERATIONS",
      items: [
        { name: "Overview", href: "/manager", icon: LayoutDashboard },
        { name: "Product Inventory", href: "/manager/products", icon: PlusCircle },
        { name: "Dispatch & Orders", href: "/manager/orders", icon: Truck },
      ],
    },
    {
      title: "QUICK ACCESS",
      items: [
        { name: "Public Catalog", href: "/products", icon: ExternalLink },
      ],
    },
  ];

  // Customer Navigation Groups
  const customerSections: NavSection[] = [
    {
      title: "MY WORKSPACE",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "FINANCE & BILLING",
      items: [
        { name: "Payment History", href: "/dashboard/payments", icon: CreditCard },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
        { name: "Profile Settings", href: "/dashboard/profile", icon: User },
        { name: "Storefront", href: "/products", icon: ExternalLink },
      ],
    },
  ];

  const sections =
    role === "ADMIN"
      ? adminSections
      : role === "MANAGER"
      ? managerSections
      : customerSections;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
          <Package className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight tracking-tight">IOMS.</span>
          <span
            suppressHydrationWarning
            className="text-[10px] text-primary font-semibold tracking-wider uppercase"
          >
            {mounted && role ? `${role} PORTAL` : "FULFILLMENT HUB"}
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/manager" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive ? (
                      <ChevronRight className="h-3.5 w-3.5 opacity-80" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Info & Sign Out Footer */}
      <div className="p-4 border-t border-border bg-muted/20 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1 rounded-lg bg-card border border-border/60">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 overflow-hidden border border-border/80">
            {mounted && (user?.avatar || (user as any)?.profileImg) ? (
              <img
                src={user?.avatar || (user as any)?.profileImg}
                alt={user?.name || "User Avatar"}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <span suppressHydrationWarning>
                {mounted && user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </span>
            )}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p suppressHydrationWarning className="text-xs font-bold truncate text-foreground">
                {mounted && user?.name ? user.name : "Signed User"}
              </p>
              {mounted && (user?.role || role) && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-primary/10 text-primary uppercase shrink-0">
                  {user?.role || role}
                </span>
              )}
            </div>
            <p suppressHydrationWarning className="text-[10px] text-muted-foreground truncate">
              {mounted && user?.email ? user.email : ""}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20 text-xs font-semibold h-8"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}