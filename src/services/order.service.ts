import { apiClient } from "@/lib/api-client";

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  orderItems: CreateOrderItem[];
}

export const orderService = {
  async createOrder(items: CreateOrderItem[]) {
    const payload: CreateOrderPayload = {
      items,
      orderItems: items,
    };

    const res = await apiClient<any>("/orders", {
      method: "POST",
      body: payload,
    });

    return res?.data?.data || res?.data || res;
  },

  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const res = await apiClient<any>("/orders/my-orders", {
      method: "GET",
      query: params,
    });
    const orders = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
    const meta = res?.data?.meta || { total: orders.length, page: 1, limit: 10 };
    return { data: orders, meta };
  },

  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const res = await apiClient<any>("/orders", {
      method: "GET",
      query: params,
    });
    const orders = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
    const meta = res?.data?.meta || { total: orders.length, page: 1, limit: 20 };
    return { data: orders, meta };
  },

  async updateOrderStatus(id: string, status: string) {
    const res = await apiClient<any>(`/orders/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
    return res?.data?.data || res?.data || res;
  },

  async getOrderById(id: string) {
    const res = await apiClient<any>(`/orders/${id}`, {
      method: "GET",
    });
    return res?.data?.data || res?.data || res;
  },
};
