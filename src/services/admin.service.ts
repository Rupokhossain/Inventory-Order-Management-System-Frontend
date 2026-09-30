import apiClient from "@/lib/api-client";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "CUSTOMER";
  status: "ACTIVE" | "BLOCKED";
  profileImg?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const adminService = {
  async getAllUsers(params?: Record<string, any>): Promise<PlatformUser[]> {
    const res = await apiClient<any>("/user", {
      method: "GET",
      query: params,
    });
    return Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
  },

  async updateUserStatus(id: string, status: "ACTIVE" | "BLOCKED"): Promise<any> {
    const res = await apiClient<any>(`/user/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
    return res?.data || res;
  },
};
