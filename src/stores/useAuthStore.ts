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

function getInitialAuth(): {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
} {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false, role: null };
  }

  try {
    const localToken = localStorage.getItem("ioms_access_token") || getCookie("accessToken");
    const localUserRaw = localStorage.getItem("ioms_user") || getCookie("userData");

    let parsedUser: User | null = null;
    if (localUserRaw) {
      try {
        parsedUser = JSON.parse(localUserRaw);
      } catch (e) {
        // ignore JSON parse error
      }
    }

    if (!parsedUser && localToken) {
      const decoded = parseJwt(localToken);
      if (decoded) {
        parsedUser = {
          id: decoded.userId || decoded.id || "",
          name: decoded.name || "Customer User",
          email: decoded.email || "",
          role: decoded.role || "CUSTOMER",
        };
      }
    }

    if (localToken && parsedUser) {
      return {
        user: parsedUser,
        token: localToken,
        isAuthenticated: true,
        role: parsedUser.role || (getCookie("userRole") as UserRole) || null,
      };
    }
  } catch (err) {
    // ignore
  }

  return { user: null, token: null, isAuthenticated: false, role: null };
}

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthenticated: initialAuth.isAuthenticated,
  role: initialAuth.role,

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
          avatar: user?.avatar || (user as any)?.profileImg,
        };
      }
    }

    // Save full user state in localStorage (not restricted by 4KB cookie limit)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("ioms_user", JSON.stringify(resolvedUser));
        localStorage.setItem("ioms_access_token", token);
      } catch (e) {
        // ignore storage quota error
      }
    }

    // Ensure cookie payload stays strictly within 4KB browser cookie limit
    const cookieUser = {
      id: resolvedUser.id,
      name: resolvedUser.name,
      email: resolvedUser.email,
      role: resolvedUser.role,
      avatar:
        resolvedUser.avatar && !resolvedUser.avatar.startsWith("data:")
          ? resolvedUser.avatar
          : undefined,
    };

    setCookie("accessToken", token);
    setCookie("userRole", resolvedUser.role);
    setCookie("userData", JSON.stringify(cookieUser));

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

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("ioms_user");
        localStorage.removeItem("ioms_access_token");
      } catch (e) {}
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  },

  initAuthFromCookies: () => {
    const token =
      (typeof window !== "undefined" ? localStorage.getItem("ioms_access_token") : null) ||
      getCookie("accessToken");
    const rawUser =
      (typeof window !== "undefined" ? localStorage.getItem("ioms_user") : null) ||
      getCookie("userData");

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