import { describe, it, expect } from "vitest";
import { buildOrderMessage, buildRitualMessage, buildSingleProductMessage, validateOrderForm, waLink } from "@/lib/whatsapp";
import { resolveCart } from "@/lib/cart/cart";
import type { Product } from "@/lib/products/types";

const cream: Product = { sku: "SC", name: "Probiotics Barrier Cream", brand: "Scinic", category: "Увлажнение",
  price: 13490, volume: "50 мл", images: ["/a.svg"], hit: false, inStock: true, concerns: [] };
const foam: Product = { sku: "LM", name: "Gentle Foam", brand: "l'mele", category: "Очищение",
  price: 6990, images: ["/b.svg"], hit: false, inStock: true, concerns: [] };
const nb = (s: string) => s.replace(/ /g, " ");

describe("buildOrderMessage", () => {
  const { lines, total } = resolveCart([{ sku: "SC", qty: 1 }, { sku: "LM", qty: 2 }, { sku: "GONE", qty: 1 }], [cream, foam]);

  it("matches the spec template exactly for pickup with a comment", () => {
    expect(buildOrderMessage(lines, total, { name: "Айгерим", delivery: "pickup", comment: "Позвоните заранее" })).toBe(
      [
        "Здравствуйте! Заказ с сайта PIYOL':",
        `1) Probiotics Barrier Cream — Scinic, 50 мл — 1 шт × ${nb("13 490 ₸")}`,
        `2) Gentle Foam — l'mele — 2 шт × ${nb("6 990 ₸")}`,
        `Итого: ${nb("27 470 ₸")}`,
        "Имя: Айгерим",
        "Получение: самовывоз из магазина",
        "Комментарий: Позвоните заранее",
      ].join("\n"),
    );
  });
  it("omits the comment line when empty and shows the delivery address", () => {
    const msg = buildOrderMessage(lines, total, { name: " Айгерим ", delivery: "delivery", address: "Абая 10, кв 5", comment: "  " });
    expect(msg).not.toContain("Комментарий");
    expect(msg).toContain("Получение: доставка, адрес: Абая 10, кв 5");
    expect(msg).toContain("Имя: Айгерим\n");
  });
});

describe("buildSingleProductMessage", () => {
  it("includes name, brand, volume and price", () => {
    expect(buildSingleProductMessage(cream)).toBe(`Здравствуйте! Хочу заказать: Probiotics Barrier Cream — Scinic, 50 мл, ${nb("13 490 ₸")}`);
  });
  it("skips volume when absent", () => {
    expect(buildSingleProductMessage(foam)).toBe(`Здравствуйте! Хочу заказать: Gentle Foam — l'mele, ${nb("6 990 ₸")}`);
  });
});

describe("waLink", () => {
  it("encodes text for wa.me with the default number", () => {
    expect(waLink("a b\nc")).toBe("https://wa.me/77080503518?text=a%20b%0Ac");
  });
  it("strips non-digits from a custom number", () => {
    expect(waLink("x", "+7 (747) 806-39-11")).toBe("https://wa.me/77478063911?text=x");
  });
});

describe("validateOrderForm", () => {
  it("requires a non-blank name", () => {
    expect(validateOrderForm({ name: " ", delivery: "pickup" })).toHaveProperty("name");
  });
  it("requires an address for delivery", () => {
    expect(validateOrderForm({ name: "А", delivery: "delivery", address: "" })).toHaveProperty("address");
  });
  it("passes a valid pickup order", () => {
    expect(validateOrderForm({ name: "Айгерим", delivery: "pickup" })).toEqual({});
  });
});

describe("buildRitualMessage", () => {
  it("перечисляет шаги и считает итог", () => {
    const msg = buildRitualMessage("Test Line", [cream, foam]);
    expect(msg.split("\n")[0]).toBe("Здравствуйте! Хочу заказать ритуал Test Line:");
    expect(msg).toContain("2) Gentle Foam — l'mele");
    expect(msg).toContain("Итого: 20\u00a0480\u00a0₸");
  });
});
