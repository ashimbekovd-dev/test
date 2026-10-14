import { isCartItems, MAX_QTY, type CartItem } from "./cart";

export const CART_KEY = "piyol.cart.v1";

function defaultStorage(): Storage | undefined {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

export function loadCart(storage: Storage | undefined = defaultStorage()): CartItem[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(CART_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!isCartItems(data)) return [];
    return data.map((i) => ({ sku: i.sku, qty: Math.min(MAX_QTY, Math.floor(i.qty)) }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[], storage: Storage | undefined = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // приватный режим или переполнение — корзина живёт до перезагрузки
  }
}
