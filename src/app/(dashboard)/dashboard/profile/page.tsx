"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  Calendar,
  Save,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [profileImg, setProfileImg] = useState(user?.profileImg || "");
  const [shippingAddress, setShippingAddress] = useState(
    "Flat 4B, Road 12, Banani, Dhaka-1213, Bangladesh"
  );
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.profileImg) setProfileImg(user.profileImg);
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const updated = await authService.updateProfile({ name, profileImg });
      if (user) {
        setUser({ ...user, name, profileImg });
      }
      toast.success("Profile information updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Account & Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal identity, shipping addresses, and security preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Personal Information
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Update your legal name and public avatar.
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-semibold">
                Active Verified
              </Badge>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Full Legal Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      disabled
                      value={user?.email || ""}
                      className="text-xs bg-muted/50 cursor-not-allowed opacity-80"
                    />
                    <ShieldCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Email is linked to authentication credentials and cannot be changed.
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Avatar Image URL (Optional)
                </label>
                <Input
                  value={profileImg}
                  onChange={(e) => setProfileImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs bg-background"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdatingProfile}
                  className="gap-2 text-xs font-semibold"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isUpdatingProfile ? "Saving..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
          </div>

          {/* Shipping Address Pre-fill Card */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Primary Delivery Address
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Auto-populated on standard checkout dispatches.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="text-xs bg-background"
                placeholder="Apartment, Street address, City, Postal Code"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Default dispatch destination
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-2.5"
                  onClick={() => toast.success("Primary shipping address updated!")}
                >
                  Save Address
                </Button>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Security & Password
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Update your secret credentials to prevent unauthorized account access.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="text-xs bg-background pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="text-xs bg-background pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="text-xs bg-background"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isChangingPassword}
                  className="gap-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {isChangingPassword ? "Updating..." : "Update Security Credentials"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Account Status & Shortcuts */}
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-5 space-y-4 text-center">
            <div className="relative mx-auto w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
              {profileImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImg}
                  alt={user?.name || "Avatar"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.name?.slice(0, 2).toUpperCase() || "US"
              )}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">{user?.name || "Customer User"}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-3 w-3" />
                ROLE: {user?.role || "CUSTOMER"}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 text-left space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Account Status</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Good Standing
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Auth Provider</span>
                <span className="font-mono uppercase text-foreground">Local DB</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Session Expiry</span>
                <span className="text-foreground">Cookie Synchronized</span>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-4 space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-1">
              Workspace Shortcuts
            </p>
            <Link
              href="/dashboard/orders"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>My Active Orders</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
            <Link
              href="/dashboard/payments"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                <span>Billing Ledger</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors text-xs font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Browse Live Catalog</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
