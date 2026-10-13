import type { Product } from "@/lib/products/types";

export const MAX_QTY = 20;
export type CartItem = { sku: string; qty: number };
export type CartLine = { product?: Product; sku: string; qty: number; available: boolean; lineTotal: number };

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n)));

export function addItem(items: CartItem[], sku: string, qty = 1): CartItem[] {
  const existing = items.find((i) => i.sku === sku);
  if (!existing) return clamp(qty) > 0 ? [...items, { sku, qty: clamp(qty) }] : items;
  return setQty(items, sku, existing.qty + qty);
}

export function setQty(items: CartItem[], sku: string, qty: number): CartItem[] {
  const q = clamp(qty);
  if (q < 1) return removeItem(items, sku);
  return items.map((i) => (i.sku === sku ? { ...i, qty: q } : i));
}

export function removeItem(items: CartItem[], sku: string): CartItem[] {
  return items.filter((i) => i.sku !== sku);
}

export function resolveCart(items: CartItem[], products: Product[]) {
  const bySku = new Map(products.map((p) => [p.sku, p]));
  const lines: CartLine[] = items.map(({ sku, qty }) => {
    const product = bySku.get(sku);
    const available = !!product && product.inStock;
    return { product, sku, qty, available, lineTotal: available ? product!.price * qty : 0 };
  });
  const ok = lines.filter((l) => l.available);
  return {
    lines,
    total: ok.reduce((s, l) => s + l.lineTotal, 0),
    count: ok.reduce((s, l) => s + l.qty, 0),
  };
}
