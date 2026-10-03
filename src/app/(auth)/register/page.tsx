/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import {
  Loader2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
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

// Frontend Zod Registration Schema mirroring backend security rules
const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters long.")
      .max(50, "Full name cannot exceed 50 characters."),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(32, "Password cannot exceed 32 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z).")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z).")
      .regex(/[0-9]/, "Password must contain at least one number (0-9).")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character (e.g. @, #, $, !)."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Field validation helper
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate email explicitly
    const isEmailValid = validateEmailFormat(email);

    // 2. Zod Full Validation
    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success || !isEmailValid) {
      const firstIssue = validationResult.error?.issues[0];
      const firstError = firstIssue?.message || emailError || "Please check form requirements.";
      if (firstIssue?.path.includes("email")) {
        setEmailError(firstIssue.message);
      }
      toast.error(firstError);
      return;
    }

    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      await authService.register({
        name: name.trim(),
        email: cleanEmail,
        password,
      });

      toast.success("Verification code sent! Please verify your email.");
      router.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Registration failed. Please try again.";
      if (
        errorMessage.toLowerCase().includes("user already exists") ||
        errorMessage.toLowerCase().includes("email")
      ) {
        setEmailError(errorMessage);
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-xl relative">
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
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Join IOMS to track orders and manage inventory purchases
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="e.g. John Doe"
                className="pl-9 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="e.g. name@example.com"
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
            <Label htmlFor="password">Password</Label>
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

            {/* Live Password Strength Indicator */}
            {password.length > 0 && (
              <div className="p-2.5 rounded-lg border border-border/80 bg-muted/30 text-[11px] space-y-1 mt-1.5">
                <span className="font-semibold text-muted-foreground block mb-0.5">
                  Password Requirements:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className={`flex items-center gap-1 ${hasMinLen ? "text-emerald-600 font-semibold" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3 w-3" /> Min 8 characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-600 font-semibold" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3 w-3" /> 1 uppercase (A-Z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-600 font-semibold" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3 w-3" /> 1 lowercase (a-z)
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber && hasSpecial ? "text-emerald-600 font-semibold" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3 w-3" /> Number & symbol (@#$)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Passwords do not match
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-10 gap-2 font-medium" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}