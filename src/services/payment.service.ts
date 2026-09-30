import { apiClient } from "@/lib/api-client";

export interface BkashPaymentResponse {
  paymentId: string;
  bkashPaymentId: string;
  bkashURL: string;
  amount: number | string;
  orderId: string;
}

export interface PaymentItem {
  id: string;
  orderId: string;
  amount: string | number;
  paymentGateway: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  transactionId?: string | null;
  createdAt: string;
  order?: {
    id: string;
    totalAmount: number;
    status: string;
    orderItems?: Array<{
      id: string;
      quantity: number;
      unitPrice: number;
      product?: {
        name: string;
        imageUrl?: string;
      };
    }>;
  };
}

export const paymentService = {
  createBkashPayment: async (orderId: string): Promise<BkashPaymentResponse> => {
    const res = await apiClient<{
      success: boolean;
      message: string;
      data: BkashPaymentResponse;
    }>(`/payments/tokenized/checkout/create/${orderId}`, {
      method: "POST",
    });
    return res.data;
  },

  getMyPayments: async (params?: Record<string, any>) => {
    const res = await apiClient<any>("/payments/my-payments", {
      method: "GET",
      query: params,
    });
    const payments: PaymentItem[] = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
    const meta = res?.data?.meta || {
      page: 1,
      limit: 10,
      total: payments.length,
      totalPage: 1,
    };
    return { data: payments, meta };
  },

  getSinglePayment: async (paymentId: string) => {
    const res = await apiClient<{
      success: boolean;
      message: string;
      data: PaymentItem;
    }>(`/payments/${paymentId}`, {
      method: "GET",
    });
    return res.data;
  },
};
