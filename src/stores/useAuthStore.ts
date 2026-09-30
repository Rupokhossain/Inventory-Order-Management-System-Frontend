import { create } from "zustand";
import { User, UserRole } from "@/types/auth";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;

  setAuth: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  initAuthFromCookies: () => void; 
}

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,

  setAuth: (user: User, token: string) => {
    let resolvedUser = user;
    if ((!user || !user.role || !user.email) && token) {
      const decoded = parseJwt(token);
      if (decoded) {
        resolvedUser = {
          id: decoded.userId || decoded.id || user?.id || "",
          name: decoded.name || user?.name || "Customer User",
          email: decoded.email || user?.email || "",
          role: decoded.role || user?.role || "CUSTOMER",
        };
      }
    }

    setCookie("accessToken", token);
    setCookie("userRole", resolvedUser.role);
    setCookie("userData", JSON.stringify(resolvedUser));

    set({
      user: resolvedUser,
      token,
      isAuthenticated: true,
      role: resolvedUser.role,
    });
  },

  login: (user: User, token: string) => {
    get().setAuth(user, token);
  },

  logout: () => {
    deleteCookie("accessToken");
    deleteCookie("userRole");
    deleteCookie("userData");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  },

  initAuthFromCookies: () => {
    const token = getCookie("accessToken");
    const rawUser = getCookie("userData");

    if (token && rawUser) {
      try {
        const user: User = JSON.parse(rawUser);
        set({
          user,
          token,
          isAuthenticated: true,
          role: user.role,
        });
      } catch (e) {
        deleteCookie("accessToken");
        deleteCookie("userRole");
        deleteCookie("userData");
      }
    }
  },
}));