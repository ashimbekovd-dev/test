import { describe, it, expect } from "vitest";
import { loadCart, saveCart, CART_KEY } from "@/lib/cart/storage";

const memory = (init: Record<string, string> = {}): Storage => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k),
    clear: () => m.clear(), key: () => null, get length() { return m.size; },
  };
};
const throwing = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } } as unknown as Storage;

describe("cart storage", () => {
  it("round-trips items", () => {
    const s = memory();
    saveCart([{ sku: "A", qty: 2 }], s);
    expect(loadCart(s)).toEqual([{ sku: "A", qty: 2 }]);
  });
  it("returns [] when storage throws", () => expect(loadCart(throwing)).toEqual([]));
  it("returns [] for garbage JSON", () => expect(loadCart(memory({ [CART_KEY]: "{oops" }))).toEqual([]));
  it("drops malformed entries and clamps qty", () => {
    const s = memory({ [CART_KEY]: JSON.stringify([{ sku: "A", qty: 50 }, { sku: 5 }, { qty: 1 }, { sku: "B", qty: 0 }]) });
    expect(loadCart(s)).toEqual([{ sku: "A", qty: 20 }]);
  });
  it("does not throw when saving to blocked storage", () => {
    expect(() => saveCart([{ sku: "A", qty: 1 }], throwing)).not.toThrow();
  });
  it("returns [] when no storage is available (server)", () => expect(loadCart(undefined)).toEqual([]));
});
