import { apiClient } from "@/lib/api-client";

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "UNREAD" | "READ" | "RESOLVED";
  reply?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const inquiryService = {
  async submitInquiry(payload: CreateInquiryPayload) {
    const res = await apiClient<any>("/inquiries", {
      method: "POST",
      body: payload,
    });
    return res?.data?.data || res?.data || res;
  },

  async getAllInquiries(params?: {
    status?: string;
    searchTerm?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await apiClient<any>("/inquiries", {
      method: "GET",
      query: params,
    });
    const items: InquiryItem[] = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
    const meta = res?.meta || res?.data?.meta || { total: items.length, unreadCount: 0 };
    return { data: items, meta };
  },

  async updateStatus(id: string, status: "UNREAD" | "READ" | "RESOLVED", reply?: string) {
    const res = await apiClient<any>(`/inquiries/${id}/status`, {
      method: "PATCH",
      body: { status, reply },
    });
    return res?.data?.data || res?.data || res;
  },

  async deleteInquiry(id: string) {
    const res = await apiClient<any>(`/inquiries/${id}`, {
      method: "DELETE",
    });
    return res?.data?.data || res?.data || res;
  },
};
