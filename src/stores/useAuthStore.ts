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
  logout: () => void;
  initAuthFromCookies: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,


  setAuth: (user: User, token: string) => {
    setCookie("accessToken", token);
    setCookie("userRole", user.role);
    setCookie("userData", JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
      role: user.role,
    });
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