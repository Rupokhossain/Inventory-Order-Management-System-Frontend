/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ShieldCheck,
  Loader2,
  Mail,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
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

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);

  // 6 separate digits for OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(300); // 5 minutes (matches backend Redis TTL)
  const [otpError, setOtpError] = useState<string | null>(null);

  // 5-minute countdown timer
  useEffect(() => {
    if (sessionTimer <= 0) return;
    const interval = setInterval(() => {
      setSessionTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionTimer]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // User pasted multiple characters into this box
      const pasted = cleanVal.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (index + i < 6) {
          newDigits[index + i] = char;
        }
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    } else {
      newDigits[index] = cleanVal;
      setOtpDigits(newDigits);
      setOtpError(null);
      // Auto move focus to next box
      if (cleanVal && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    pasteData.split("").forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);
    setOtpError(null);
    const focusIdx = Math.min(pasteData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  // Submit OTP Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const fullOtp = otpDigits.join("");

    if (!cleanEmail) {
      toast.error("Please provide your registered email address.");
      return;
    }

    if (fullOtp.length !== 6) {
      setOtpError("Please enter all 6 digits of the verification code.");
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setOtpError(null);

      const res = await authService.verifyEmail({
        email: cleanEmail,
        otp: fullOtp,
      });

      const user = res.data?.user;
      const accessToken = res.data?.accessToken;

      if (user && accessToken) {
        setAuth(user, accessToken);
      }

      toast.success("Email verified successfully! Welcome to IOMS.");

      // Route based on role
      const role: UserRole = user?.role || "CUSTOMER";
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "MANAGER") {
        router.push("/manager");
      } else {
        router.push("/dashboard/orders");
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Verification failed. Please check your OTP code.";
      setOtpError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your registered email address first.");
      return;
    }

    try {
      setResending(true);
      await authService.resendRegistrationOtp(cleanEmail);
      toast.success("New verification code sent! Check your inbox or backend terminal.");
      setCooldown(45); // 45 seconds cooldown
      setSessionTimer(300); // Reset session timer
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError(null);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to resend code. Please try again.";
      toast.error(errorMsg);
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="border-border shadow-xl relative max-w-md w-full mx-auto">
      <CardHeader className="space-y-2">
        {/* Back Navigation */}
        <div className="flex items-center justify-between pb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Store</span>
          </Link>
          <Link
            href="/register"
            className="text-xs text-primary hover:underline font-medium"
          >
            New Registration
          </Link>
        </div>

        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-1">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Verify Your Email</CardTitle>
          <CardDescription className="text-sm">
            We have sent a 6-digit confirmation code to activate your account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Email Address Confirmation / Editor */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/30 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-primary" /> Target Email:
            </span>
            <button
              type="button"
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className="text-primary hover:underline font-semibold"
            >
              {isEditingEmail ? "Save" : "Change Email"}
            </button>
          </div>

          {isEditingEmail ? (
            <div className="pt-1">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>
          ) : (
            <p className="font-semibold text-foreground text-sm truncate">
              {email || "(No email provided)"}
            </p>
          )}
        </div>

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                6-Digit Verification Code
              </Label>
              <span
                className={`text-xs font-medium ${
                  sessionTimer < 60 ? "text-rose-500 font-bold animate-pulse" : "text-muted-foreground"
                }`}
              >
                Code expires: {formatTimer(sessionTimer)}
              </span>
            </div>

            {/* Individual Digit Input Boxes */}
            <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border transition-all outline-none bg-background ${
                    otpError
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500 bg-rose-50/20"
                      : digit
                      ? "border-primary font-black bg-primary/5 text-primary"
                      : "border-input hover:border-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                  required
                />
              ))}
            </div>

            {/* Error Message */}
            {otpError && (
              <p className="text-[12px] text-rose-500 font-medium flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{otpError}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 gap-2 font-medium"
            disabled={loading || otpDigits.join("").length !== 6}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Verify & Activate Account
          </Button>
        </form>

        {/* Resend OTP Section */}
        <div className="pt-2 text-center border-t border-border/70 space-y-1.5">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the code in your email inbox?
          </p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending || cooldown > 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:text-muted-foreground disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
          >
            {resending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Sending new code...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <RotateCw className="h-3 w-3 animate-spin" />
                <span>Resend available in {cooldown}s</span>
              </>
            ) : (
              <>
                <RotateCw className="h-3 w-3" />
                <span>Resend Verification Code</span>
              </>
            )}
          </button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Already verified?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
