"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";

function AuthSync() {
  const { token, user, setAuth, initAuthFromCookies } = useAuthStore();

  useEffect(() => {
    initAuthFromCookies();
  }, [initAuthFromCookies]);

  const { data: profile } = useQuery({
    queryKey: ["auth-profile-sync", token],
    queryFn: async () => {
      if (!token) return null;
      try {
        return await authService.getProfile();
      } catch (e) {
        return null;
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const freshUser = profile?.data || profile;
    if (freshUser && freshUser.id && token) {
      setAuth(
        {
          id: freshUser.id,
          name: freshUser.name || user?.name || "Customer User",
          email: freshUser.email || user?.email || "",
          role: freshUser.role || user?.role || "CUSTOMER",
          avatar: freshUser.profileImg || user?.avatar,
          createdAt: freshUser.createdAt,
        },
        token
      );
    }
  }, [profile, token, setAuth, user]);

  return null;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, 
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      {children}
    </QueryClientProvider>
  );
}