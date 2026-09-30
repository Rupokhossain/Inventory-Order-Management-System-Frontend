"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Upload,
  Camera,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function CustomerProfilePage() {
  const { user, token, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => authService.getProfile(),
  });

  const [name, setName] = useState(user?.name || "");
  const [profileImg, setProfileImg] = useState(
    (user as any)?.profileImg || user?.avatar || ""
  );
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
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

  // Sync state when fresh profile data arrives from DB
  useEffect(() => {
    const freshUser = profileResponse?.data || profileResponse;
    if (freshUser && freshUser.id) {
      if (freshUser.name) setName(freshUser.name);
      if (freshUser.profileImg) setProfileImg(freshUser.profileImg);
      if (token) {
        setAuth(
          {
            id: freshUser.id,
            name: freshUser.name || "Customer User",
            email: freshUser.email,
            role: freshUser.role || "CUSTOMER",
            avatar: freshUser.profileImg,
          },
          token
        );
      }
    } else if (user) {
      if (user.name) setName(user.name);
      if ((user as any)?.profileImg || user?.avatar) {
        setProfileImg((user as any)?.profileImg || user?.avatar || "");
      }
    }
  }, [profileResponse, user, token, setAuth]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 350;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        setProfileImg(optimizedBase64);
        toast.success("Image loaded! Click 'Save Profile Details' to apply.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await authService.updateProfile({
        name: name.trim(),
        profileImg: profileImg || undefined,
      });

      const updated = res?.data || res;

      // Invalidate queries so TanStack cache updates everywhere
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-profile-sync"] });

      // Update Zustand and persistent storage immediately
      if (token) {
        setAuth(
          {
            id: updated?.id || user?.id || "",
            name: updated?.name || name.trim(),
            email: updated?.email || user?.email || "",
            role: updated?.role || user?.role || "CUSTOMER",
            avatar: updated?.profileImg || profileImg,
          },
          token
        );
      }

      toast.success("Profile information and avatar updated successfully!");
    } catch (err: any) {
      toast.error(
        err?.message || "Failed to update profile. Please verify your connection."
      );
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
      toast.success("Security password updated successfully!");
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
            Manage your personal identity, avatar image, shipping addresses, and security credentials.
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
                    Update your legal name and profile picture.
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-semibold">
                Active Verified
              </Badge>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Photo Upload Section */}
              <div className="space-y-2 p-4 rounded-xl border border-border/80 bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-primary" />
                    Profile Picture / Avatar
                  </label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                        uploadMode === "file"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Device File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                        uploadMode === "url"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                  {/* Photo Thumbnail */}
                  <div className="relative h-16 w-16 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-xs">
                    {profileImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImg}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-primary text-lg">
                        {name ? name.slice(0, 2).toUpperCase() : "US"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {uploadMode === "file" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Hidden Native File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2 text-xs font-semibold bg-background shadow-2xs hover:bg-muted"
                        >
                          <Upload className="h-3.5 w-3.5 text-primary" />
                          <span>Choose Image from Computer</span>
                        </Button>

                        {profileImg && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setProfileImg("")}
                            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 h-8 px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </Button>
                        )}
                        <span className="text-[10px] text-muted-foreground block w-full">
                          Supports PNG, JPG, or WEBP (Max 2MB).
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="relative">
                          <LinkIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder="https://images.unsplash.com/photo-..."
                            value={profileImg}
                            onChange={(e) => setProfileImg(e.target.value)}
                            className="pl-8 text-xs bg-background"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Paste a public direct image link.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Full Legal Name *
                  </label>
                  <Input
                    required
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

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdatingProfile}
                  className="gap-2 text-xs font-semibold shadow-xs"
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
                  className="gap-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
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
            <div className="relative mx-auto w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-inner overflow-hidden">
              {profileImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImg}
                  alt={name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                name?.slice(0, 2).toUpperCase() || "US"
              )}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">
                {name || user?.name || "Customer User"}
              </h3>
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
