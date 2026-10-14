import { describe, expect, it } from "vitest";
import { loadCart, saveCart } from "@/lib/cart/storage";

const throwing = {
  getItem: () => { throw new Error("blocked"); },
  setItem: () => { throw new Error("blocked"); },
} as unknown as Storage;

const memory = (value: string | null) =>
  ({ getItem: () => value, setItem: () => undefined }) as unknown as Storage;

describe("cart storage", () => {
  it("getItem бросает → пустая корзина", () => {
    expect(loadCart(throwing)).toEqual([]);
  });
  it("мусорный JSON → пустая корзина", () => {
    expect(loadCart(memory("{oops"))).toEqual([]);
    expect(loadCart(memory('[{"sku":1}]'))).toEqual([]);
  });
  it("корректные данные читаются", () => {
    expect(loadCart(memory('[{"sku":"A","qty":2}]'))).toEqual([{ sku: "A", qty: 2 }]);
  });
  it("setItem бросает → без исключения", () => {
    expect(() => saveCart([{ sku: "A", qty: 1 }], throwing)).not.toThrow();
  });
  it("без хранилища → без исключения", () => {
    expect(loadCart(undefined)).toEqual([]);
    expect(() => saveCart([], undefined)).not.toThrow();
  });
});
