/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/api-client";
import { Product, Category, ProductFilterParams } from "@/types/product";

export const productService = {
  async getProducts(params?: ProductFilterParams): Promise<{ data: Product[] }> {
    try {
      let sortBy = params?.sortBy || "createdAt";
      let sortOrder: "asc" | "desc" = params?.sortOrder || "desc";

      if (params?.sortBy === "price_asc") {
        sortBy = "price";
        sortOrder = "asc";
      } else if (params?.sortBy === "price_desc") {
        sortBy = "price";
        sortOrder = "desc";
      } else if (params?.sortBy === "name" || params?.sortBy === "price" || params?.sortBy === "createdAt") {
        sortBy = params.sortBy;
        sortOrder = params?.sortOrder || (params.sortBy === "name" ? "asc" : "desc");
      }

      const searchTerm = params?.searchTerm || (params as any)?.search;

      const res = await apiClient<any>("/products", {
        method: "GET",
        query: {
          search: searchTerm ? String(searchTerm).trim() : undefined,
          searchTerm: searchTerm ? String(searchTerm).trim() : undefined,
          categoryId: params?.categoryId && params.categoryId !== "all" ? params.categoryId : undefined,
          category: params?.categoryId && params.categoryId !== "all" ? params.categoryId : undefined,
          sortBy: sortBy,
          sortOrder: sortOrder,
          page: params?.page || 1,
          limit: params?.limit || 100,
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
      const res = await apiClient<any>("/categories", {
        method: "GET",
        query: { limit: 100 },
      });
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      if (Array.isArray(res?.result)) return res.result;
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async createCategory(data: { name: string; description?: string }): Promise<any> {
    const res = await apiClient<any>("/categories", {
      method: "POST",
      body: data,
    });
    return res?.data || res;
  },

  async deleteCategory(id: string): Promise<any> {
    const res = await apiClient<any>(`/categories/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
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