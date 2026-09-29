/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api-client";
import { Product, Category, ProductFilterParams } from "@/types/product";

export const productService = {
  async getProducts(params?: ProductFilterParams): Promise<{ data: Product[] }> {
    try {
      // সর্টিং প্যারামিটার প্রিজমার আসল ফিল্ডে কনভার্ট করা
      let sortBy = "createdAt";
      let sortOrder: "asc" | "desc" = "desc";

      if (params?.sortBy === "price_asc") {
        sortBy = "price";
        sortOrder = "asc";
      } else if (params?.sortBy === "price_desc") {
        sortBy = "price";
        sortOrder = "desc";
      } else {
        sortBy = "createdAt";
        sortOrder = "desc";
      }

      const res = await apiClient<any>("/products", {
        method: "GET",
        query: {
          searchTerm: params?.searchTerm || undefined,
          categoryId: params?.categoryId || undefined,
          sortBy: sortBy,      // প্রিজমাতে 'createdAt' যাবে
          sortOrder: sortOrder,// 'desc' যাবে
          page: params?.page || 1,
          limit: params?.limit || 12,
        },
      });

      const products = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data?.result || [];

      return { data: products };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { data: [] };
    }
  },

  async getProductById(id: string): Promise<Product> {
    const res = await apiClient<any>(`/products/${id}`, { method: "GET" });
    return res?.data?.data || res?.data;
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient<any>("/categories", { method: "GET" });
      return Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.data?.result || [];
    } catch (error) {
      return [];
    }
  },
};