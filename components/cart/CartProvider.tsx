"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addItem, removeItem, setQty, type CartItem } from "@/lib/cart/cart";
import { loadCart, saveCart } from "@/lib/cart/storage";
import { track } from "@/lib/analytics";

type CartApi = {
  items: CartItem[];
  count: number;
  ready: boolean;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveCart(items);
  }, [items, ready]);

  const api = useMemo<CartApi>(
    () => ({
      items,
      ready,
      count: items.reduce((s, i) => s + i.qty, 0),
      add: (sku, qty) => {
        setItems((cur) => addItem(cur, sku, qty));
        track("add_to_cart", { sku });
      },
      setQty: (sku, qty) => setItems((cur) => setQty(cur, sku, qty)),
      remove: (sku) => setItems((cur) => removeItem(cur, sku)),
      clear: () => setItems([]),
    }),
    [items, ready],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
