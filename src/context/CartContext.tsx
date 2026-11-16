import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "../types/cart";
import { Product } from "../types/product";
import { discountedPrice } from "../utils/format";

const STORAGE_KEY = "shop_cart";

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  addItem: (product: Product, qty?: number) => { ok: boolean; message: string };
  updateQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isCartItemArray(data: unknown): data is CartItem[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as CartItem).productId === "number" &&
      typeof (item as CartItem).title === "string" &&
      typeof (item as CartItem).price === "number" &&
      typeof (item as CartItem).quantity === "number" &&
      typeof (item as CartItem).stock === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return isCartItemArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  const addItem = (product: Product, qty = 1): { ok: boolean; message: string } => {
    if (product.stock <= 0) {
      return { ok: false, message: "Product is out of stock." };
    }
    const existing = items.find((i) => i.productId === product.id);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + qty > product.stock) {
      return { ok: false, message: `Only ${product.stock} available in stock.` };
    }

    const unitPrice = discountedPrice(product.price, product.discountPercentage);

    setItems((prev) => {
      const found = prev.find((i) => i.productId === product.id);
      if (found) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.stock, i.quantity + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: unitPrice,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          quantity: qty,
        },
      ];
    });

    return { ok: true, message: "Added to cart" };
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.stock, Math.floor(qty)) }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{ items, totalCount, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
