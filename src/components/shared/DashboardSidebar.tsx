"use client";

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
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuthStore();

  // ১. অ্যাডমিনের মেনু
  const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users Management", href: "/admin/users", icon: Users },
    { name: "Central Inventory", href: "/admin/inventory", icon: Boxes },
    { name: "Reports & Audit", href: "/admin/reports", icon: FileText },
  ];

  // ২. ম্যানেজারের মেনু
  const managerLinks = [
    { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { name: "Product Management", href: "/manager/products", icon: PlusCircle },
    { name: "Order Processing", href: "/manager/orders", icon: Truck },
  ];

  // ৩. কাস্টমারের মেনু
  const customerLinks = [
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Payment History", href: "/dashboard/payments", icon: CreditCard },
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
  ];

  const currentLinks =
    role === "ADMIN" ? adminLinks : role === "MANAGER" ? managerLinks : customerLinks;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-lg leading-none">IOMS.</span>
          <span className="block text-[10px] text-primary font-semibold tracking-wider uppercase">
            {role || "DASHBOARD"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-border bg-muted/20 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
            {user?.name?.slice(0, 2).toUpperCase() || "US"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate text-foreground">{user?.name || "User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20"
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