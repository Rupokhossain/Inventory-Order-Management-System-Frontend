"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthInitializer() {
  const initAuth = useAuthStore((state) => state.initAuthFromCookies);
  const refreshUserProfile = useAuthStore((state) => state.refreshUserProfile);

  useEffect(() => {
    initAuth();
    refreshUserProfile();
  }, [initAuth, refreshUserProfile]);

  return null;
}
