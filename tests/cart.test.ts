import { describe, it, expect } from "vitest";
import { addItem, setQty, removeItem, resolveCart } from "@/lib/cart/cart";
import type { Product } from "@/lib/products/types";

const p = (sku: string, price: number, extra: Partial<Product> = {}): Product => ({
  sku, name: sku, brand: "B", category: "C", price, images: ["/x.svg"], hit: false, inStock: true, ...extra,
});

describe("cart item operations", () => {
  it("adds a new item with qty 1 by default", () => {
    expect(addItem([], "A")).toEqual([{ sku: "A", qty: 1 }]);
  });
  it("sums qty for the same sku and caps at 20", () => {
    expect(addItem(addItem([], "A", 15), "A", 15)).toEqual([{ sku: "A", qty: 20 }]);
  });
  it("setQty clamps to 20 and removes at qty < 1", () => {
    expect(setQty([{ sku: "A", qty: 2 }], "A", 99)).toEqual([{ sku: "A", qty: 20 }]);
    expect(setQty([{ sku: "A", qty: 2 }], "A", 0)).toEqual([]);
  });
  it("removeItem drops only that sku", () => {
    expect(removeItem([{ sku: "A", qty: 1 }, { sku: "B", qty: 2 }], "A")).toEqual([{ sku: "B", qty: 2 }]);
  });
});

describe("resolveCart", () => {
  it("computes line totals, total and count from current prices", () => {
    const r = resolveCart([{ sku: "A", qty: 2 }, { sku: "B", qty: 1 }], [p("A", 1000), p("B", 500)]);
    expect(r.lines.map((l) => l.lineTotal)).toEqual([2000, 500]);
    expect(r.total).toBe(2500);
    expect(r.count).toBe(3);
  });
  it("marks items missing from the catalog as unavailable and excludes them", () => {
    const r = resolveCart([{ sku: "A", qty: 2 }, { sku: "GONE", qty: 3 }], [p("A", 1000)]);
    const gone = r.lines.find((l) => l.sku === "GONE")!;
    expect(gone).toMatchObject({ available: false, lineTotal: 0, product: undefined });
    expect(r.total).toBe(2000);
    expect(r.count).toBe(2);
  });
  it("treats out-of-stock products as unavailable", () => {
    const r = resolveCart([{ sku: "A", qty: 1 }], [p("A", 1000, { inStock: false })]);
    expect(r.lines[0].available).toBe(false);
    expect(r.total).toBe(0);
  });
});
