"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { addItem, removeItem, setQty as setQtyPure, type CartItem } from "@/lib/cart/cart";
import { CART_KEY, loadCart, saveCart } from "@/lib/cart/storage";

type CartContextValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setItems(loadCart());
    loaded.current = true;
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(loadCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (loaded.current) saveCart(items);
  }, [items]);

  const add = useCallback((sku: string, qty = 1) => setItems((prev) => addItem(prev, sku, qty)), []);
  const setQty = useCallback((sku: string, qty: number) => setItems((prev) => setQtyPure(prev, sku, qty)), []);
  const remove = useCallback((sku: string) => setItems((prev) => removeItem(prev, sku)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.reduce((s, i) => s + i.qty, 0), ready, add, setQty, remove, clear }),
    [items, ready, add, setQty, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart вне CartProvider");
  return ctx;
}
