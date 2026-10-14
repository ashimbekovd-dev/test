import { describe, expect, it } from "vitest";
import { addItem, MAX_QTY, removeItem, resolveCart, setQty } from "@/lib/cart/cart";
import type { Product } from "@/lib/products/types";

const p = (sku: string, price: number, extra: Partial<Product> = {}): Product => ({
  sku, name: sku, brand: "B", category: "C", price, images: ["https://x/1.jpg"], hit: false, inStock: true, ...extra,
});

describe("cart", () => {
  it("addItem суммирует и ограничивает 20", () => {
    let items = addItem([], "A", 15);
    items = addItem(items, "A", 15);
    expect(items).toEqual([{ sku: "A", qty: MAX_QTY }]);
  });
  it("addItem по умолчанию добавляет 1", () => {
    expect(addItem([], "A")).toEqual([{ sku: "A", qty: 1 }]);
  });
  it("setQty < 1 удаляет, > 20 ограничивает", () => {
    expect(setQty([{ sku: "A", qty: 3 }], "A", 0)).toEqual([]);
    expect(setQty([{ sku: "A", qty: 3 }], "A", 99)).toEqual([{ sku: "A", qty: 20 }]);
  });
  it("removeItem", () => {
    expect(removeItem([{ sku: "A", qty: 1 }, { sku: "B", qty: 2 }], "A")).toEqual([{ sku: "B", qty: 2 }]);
  });
  it("resolveCart: пропавший товар помечен и не входит в итог", () => {
    const { lines, total, count } = resolveCart(
      [{ sku: "A", qty: 2 }, { sku: "GONE", qty: 1 }, { sku: "OUT", qty: 1 }],
      [p("A", 1000), p("OUT", 500, { inStock: false })],
    );
    expect(total).toBe(2000);
    expect(count).toBe(2);
    expect(lines.map((l) => [l.sku, l.available, l.lineTotal])).toEqual([
      ["A", true, 2000],
      ["GONE", false, 0],
      ["OUT", false, 0],
    ]);
  });
});
