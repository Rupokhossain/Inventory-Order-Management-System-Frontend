/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import {
  ShieldCheck,
  Wrench,
  UserCheck,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserRole } from "@/types/auth";

// Zod Login Schema
const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null);

  // Email format validation
  const validateEmailFormat = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError("Email address is required.");
      return false;
    }
    const check = z.string().email("Please enter a valid email address (e.g. name@example.com)").safeParse(trimmed);
    if (!check.success) {
      setEmailError(check.error.issues[0]?.message || "Invalid email format.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  // 1. Manual Login Handler with Zod Validation
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmailFormat(email);

    // Client-side Zod validation
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success || !isEmailValid) {
      const firstIssue = validationResult.error?.issues[0];
      const firstError = firstIssue?.message || emailError || "Invalid credentials.";
      if (firstIssue?.path.includes("email")) {
        setEmailError(firstIssue.message);
      }
      toast.error(firstError);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const user = res.data.user;
      const token = res.data.accessToken;
      setAuth(user, token);

      toast.success(`Welcome back, ${user.name || "User"}!`);
      redirectByRole(user.role);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Login failed. Please check your credentials.";
      if (
        errorMessage.toLowerCase().includes("user not found") ||
        errorMessage.toLowerCase().includes("email")
      ) {
        setEmailError(errorMessage);
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 2. One-Click Demo Login Handler for 3 Roles
  const handleDemoLogin = async (role: UserRole, demoEmail: string, demoPass: string) => {
    try {
      setDemoLoadingRole(role);
      const res = await authService.login({ email: demoEmail, password: demoPass });

      const user = res.data.user;
      const token = res.data.accessToken;
      setAuth(user, token);

      toast.success(`Logged in successfully as ${role}!`);
      redirectByRole(role);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || `Failed to sign in as ${role}`;
      toast.error(errorMsg);
    } finally {
      setDemoLoadingRole(null);
    }
  };

  // 3. Route Redirection Based on Role
  const redirectByRole = (role: UserRole) => {
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "MANAGER") {
      router.push("/manager");
    } else {
      router.push("/dashboard/orders");
    }
  };

  return (
    <Card className="border-border shadow-xl">
      <CardHeader className="space-y-2">
        {/* Back to Home Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Store</span>
          </Link>
          <Link
            href="/products"
            className="text-xs text-primary hover:underline font-medium"
          >
            Browse Catalog
          </Link>
        </div>

        <div className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your inventory and order dispatch dashboard
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className={emailError ? "text-rose-600" : ""}>
                Email Address
              </Label>
              {email.length > 3 && !emailError && (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Valid email
                </span>
              )}
            </div>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-3 h-4 w-4 transition-colors ${
                  emailError ? "text-rose-500" : "text-muted-foreground"
                }`}
              />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`pl-9 text-sm transition-all ${
                  emailError
                    ? "border-rose-500 focus-visible:ring-rose-500 bg-rose-50/20 text-rose-950 dark:text-rose-200"
                    : ""
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmailFormat(e.target.value);
                }}
                onBlur={(e) => {
                  if (e.target.value.trim().length > 0) {
                    validateEmailFormat(e.target.value);
                  }
                }}
                required
              />
            </div>
            {emailError && (
              <p className="text-[12px] text-rose-500 font-medium flex items-center gap-1.5 mt-1">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-10 gap-2 font-medium" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">
              ⚡ Quick Demo Login (Evaluators)
            </span>
          </div>
        </div>

        {/* 3 ONE-CLICK DEMO LOGIN BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Admin Demo Button */}
          <Button
            type="button"
            variant="outline"
            className="h-auto py-2.5 px-3 flex flex-col items-center gap-1 border-primary/30 hover:bg-primary/5 hover:border-primary text-xs"
            onClick={() => handleDemoLogin("ADMIN", "rh.siam999@gmail.com", "siam11**##@@!!11A")}
            disabled={demoLoadingRole !== null}
          >
            {demoLoadingRole === "ADMIN" ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-primary" />
            )}
            <span className="font-semibold text-foreground">Admin Demo</span>
            <span className="text-[10px] text-muted-foreground">Full Control</span>
          </Button>

          {/* Manager Demo Button */}
          <Button
            type="button"
            variant="outline"
            className="h-auto py-2.5 px-3 flex flex-col items-center gap-1 border-amber-500/30 hover:bg-amber-500/5 hover:border-amber-500 text-xs"
            onClick={() => handleDemoLogin("MANAGER", "manager@ioms.com", "Manager123!@#")}
            disabled={demoLoadingRole !== null}
          >
            {demoLoadingRole === "MANAGER" ? (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            ) : (
              <Wrench className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-semibold text-foreground">Manager Demo</span>
            <span className="text-[10px] text-muted-foreground">Operations</span>
          </Button>

          {/* Customer Demo Button */}
          <Button
            type="button"
            variant="outline"
            className="h-auto py-2.5 px-3 flex flex-col items-center gap-1 border-emerald-500/30 hover:bg-emerald-500/5 hover:border-emerald-500 text-xs"
            onClick={() => handleDemoLogin("CUSTOMER", "siam121483@gmail.com", "siam11**##@@AA")}
            disabled={demoLoadingRole !== null}
          >
            {demoLoadingRole === "CUSTOMER" ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-emerald-500" />
            )}
            <span className="font-semibold text-foreground">Customer Demo</span>
            <span className="text-[10px] text-muted-foreground">Orders & Cart</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}