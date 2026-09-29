import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        );
        const availableStock = product.stockQuantity ?? product.stock ?? 999;

        if (existingItem) {
          const newQty = existingItem.quantity + quantity;
          if (newQty > availableStock) {
            toast.error(`Only ${availableStock} items available in stock!`);
            return;
          }
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQty }
                : item
            ),
          });
        } else {
          if (quantity > availableStock) {
            toast.error(`Only ${availableStock} items available in stock!`);
            return;
          }
          set({ items: [...currentItems, { product, quantity }] });
        }
        toast.success(`Added "${product.name}" to cart!`);
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
        toast.info("Item removed from cart");
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) => {
            if (item.product.id === productId) {
              const availableStock =
                item.product.stockQuantity ?? item.product.stock ?? 999;
              if (quantity > availableStock) {
                toast.error(`Max warehouse stock is ${availableStock}`);
                return item;
              }
              return { ...item, quantity };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: "ioms-cart-storage",
    }
  )
);