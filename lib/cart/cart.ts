import type { Product } from "@/lib/products/types";

export const MAX_QTY = 20;

export type CartItem = { sku: string; qty: number };
export type CartLine = { product?: Product; sku: string; qty: number; available: boolean; lineTotal: number };

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

export function addItem(items: CartItem[], sku: string, qty = 1): CartItem[] {
  const existing = items.find((i) => i.sku === sku);
  if (existing) return items.map((i) => (i.sku === sku ? { sku, qty: clamp(i.qty + qty) } : i));
  return [...items, { sku, qty: clamp(qty) }];
}

export function setQty(items: CartItem[], sku: string, qty: number): CartItem[] {
  if (!Number.isFinite(qty) || qty < 1) return removeItem(items, sku);
  return items.map((i) => (i.sku === sku ? { sku, qty: clamp(qty) } : i));
}

export function removeItem(items: CartItem[], sku: string): CartItem[] {
  return items.filter((i) => i.sku !== sku);
}

export function resolveCart(items: CartItem[], products: Product[]) {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const lines: CartLine[] = items.map(({ sku, qty }) => {
    const product = bySku.get(sku);
    const available = Boolean(product && product.inStock);
    return { product, sku, qty, available, lineTotal: available ? product!.price * qty : 0 };
  });
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);
  const count = lines.reduce((s, l) => s + (l.available ? l.qty : 0), 0);
  return { lines, total, count };
}

export function isCartItems(value: unknown): value is CartItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (i) => i && typeof i === "object" && typeof i.sku === "string" && typeof i.qty === "number" && i.qty >= 1,
    )
  );
}
