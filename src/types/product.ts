export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stockQuantity?: number;
  stock?: number;
  sku?: string;
  imageUrl?: string;
  images?: string[];
  categoryId: string;
  category?: Category;
  createdAt?: string;
}

export interface ProductFilterParams {
  searchTerm?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}