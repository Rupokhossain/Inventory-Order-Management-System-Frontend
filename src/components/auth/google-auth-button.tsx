/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleAuthButtonProps {
  mode?: "signin" | "signup";
}

export function GoogleAuthButton({ mode = "signin" }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const setAuth = useAuthStore((state) => state.setAuth);
  const refreshUserProfile = useAuthStore((state) => state.refreshUserProfile);

  const buttonRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "555138210218-tv2v3d7dbtithgtp48r2mh8s4hak11bo.apps.googleusercontent.com";

  // Handle credential response from Google
  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      toast.error("Google sign in failed. No authorization credential received.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.googleLogin(response.credential);
      const token = res?.data?.accessToken || res?.accessToken;

      if (!token) {
        throw new Error(res?.message || "Failed to receive authorization token.");
      }

      // Store in auth store & localStorage/cookies
      setAuth(null as any, token);
      await refreshUserProfile();

      const userRole = useAuthStore.getState().role;
      toast.success(
        mode === "signup"
          ? "Account registered with Google successfully!"
          : "Logged in with Google successfully!"
      );

      if (userRole === "ADMIN") {
        router.push("/admin");
      } else if (userRole === "MANAGER") {
        router.push("/manager");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Google authentication failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 1. Dynamically load Google Identity Services Script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-gsi-client");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => {
        console.warn("Failed to load Google Identity Services script.");
      };
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
    }
  }, []);

  // 2. Initialize and render button when script is ready
  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const isDark = resolvedTheme === "dark" || theme === "dark";

      // Render standard Google button inside buttonRef
      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: isDark ? "filled_black" : "outline",
        size: "large",
        text: mode === "signup" ? "signup_with" : "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 340,
      });
    } catch (err) {
      console.error("Google Auth initialization error:", err);
    }
  }, [scriptLoaded, resolvedTheme, theme, mode]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      {loading ? (
        <div className="w-full h-10 rounded-lg border border-border flex items-center justify-center gap-2 bg-muted/30 text-xs font-semibold text-muted-foreground animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Verifying Google account...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <div
            ref={buttonRef}
            className="w-full flex justify-center min-h-[40px] items-center"
          />
        </div>
      )}
    </div>
  );
}
