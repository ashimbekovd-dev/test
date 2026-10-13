import { MAX_QTY, type CartItem } from "./cart";

export const CART_KEY = "piyol-cart-v1";

function defaultStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function loadCart(storage: Storage | undefined = defaultStorage()): CartItem[] {
  if (!storage) return [];
  try {
    const raw = JSON.parse(storage.getItem(CART_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((i) => i && typeof i.sku === "string" && typeof i.qty === "number" && i.qty >= 1)
      .map((i) => ({ sku: i.sku, qty: Math.min(MAX_QTY, Math.floor(i.qty)) }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[], storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Private mode / quota: the cart still works in memory until reload.
  }
}
