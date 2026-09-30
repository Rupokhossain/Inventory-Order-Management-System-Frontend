/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api-client";
import { Product, Category, ProductFilterParams } from "@/types/product";

export const productService = {
  async getProducts(params?: ProductFilterParams): Promise<{ data: Product[] }> {
    try {
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
          sortBy: sortBy,
          sortOrder: sortOrder,
          page: params?.page || 1,
          limit: params?.limit || 50,
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

  async createProduct(data: FormData | Record<string, any>): Promise<any> {
    const res = await apiClient<any>("/products", {
      method: "POST",
      body: data,
    });
    return res?.data || res;
  },

  async updateProduct(id: string, data: FormData | Record<string, any>): Promise<any> {
    const res = await apiClient<any>(`/products/${id}`, {
      method: "PATCH",
      body: data,
    });
    return res?.data || res;
  },

  async updateStock(id: string, quantity: number): Promise<any> {
    const res = await apiClient<any>(`/products/${id}/stock`, {
      method: "PATCH",
      body: { quantity },
    });
    return res?.data || res;
  },

  async deleteProduct(id: string): Promise<any> {
    const res = await apiClient<any>(`/products/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};