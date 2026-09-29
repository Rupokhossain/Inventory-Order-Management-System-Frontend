import apiClient from "@/lib/api-client";
import { AuthResponse } from "@/types/auth";


export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    return await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: data,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProfile(): Promise<any> {
    return await apiClient("/user/me", {
      method: "GET",
    });
  },

  async logout(): Promise<void> {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (e) {
   
    }
  },
};