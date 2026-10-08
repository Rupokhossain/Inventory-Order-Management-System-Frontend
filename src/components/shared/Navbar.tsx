"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAuthenticated, role, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardHref =
    role === "ADMIN" ? "/admin" : role === "MANAGER" ? "/manager" : "/dashboard";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    logout();
    toast.success("Successfully logged out");
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl">
            IOMS<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* Cart Button */}
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative h-9 w-9" title="Shopping Cart">
              <ShoppingCart className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Logged in User Suite (Desktop) */}
          {mounted && isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              {/* Dashboard Link */}
              <Link href={dashboardHref}>
                <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs text-xs h-9">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 border-border/80 h-9 font-medium"
                title="Log Out of Account"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button size="sm" className="gap-2 text-xs font-semibold h-9">
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          ))}

          {mounted && isAuthenticated ? (
            <div className="space-y-2 pt-3 border-t border-border">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90 font-semibold text-sm h-10 shadow-xs">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full gap-2 text-destructive hover:bg-destructive/10 border-destructive/30 font-semibold text-sm h-10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button className="w-full gap-2 font-semibold">
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}