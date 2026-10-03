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

  async verifyEmail(data: { email: string; otp: string }): Promise<AuthResponse> {
    return await apiClient<AuthResponse>("/auth/verify-email", {
      method: "POST",
      body: data,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async resendRegistrationOtp(email: string): Promise<any> {
    return await apiClient<any>("/auth/resend-registration-otp", {
      method: "POST",
      body: { email },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProfile(): Promise<any> {
    const res = await apiClient<any>("/users/me", {
      method: "GET",
    });
    return res.data || res;
  },

  async updateProfile(data: { name?: string; profileImg?: string }): Promise<any> {
    const res = await apiClient<any>("/users/me", {
      method: "PATCH",
      body: data,
    });
    return res.data || res;
  },

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
    const res = await apiClient<any>("/users/change-password", {
      method: "PATCH",
      body: data,
    });
    return res.data || res;
  },

  async logout(): Promise<void> {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore error on logout
    }
  },
};