import { describe, expect, it } from "vitest";
import { resolveCart } from "@/lib/cart/cart";
import { buildOrderMessage, buildSingleProductMessage, validateOrderForm, waLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/products/types";

const NB = " ";
const cream: Product = {
  sku: "SC-PBC-50", name: "Probiotics Barrier Cream", brand: "Scinic", category: "Увлажнение",
  price: 13490, volume: "50 мл", images: ["https://x/1.jpg"], hit: false, inStock: true,
};
const foam: Product = {
  sku: "FOAM", name: "Gentle Foam", brand: "Round Lab", category: "Очищение",
  price: 6500, images: ["https://x/2.jpg"], hit: false, inStock: true,
};

describe("buildOrderMessage", () => {
  const { lines, total } = resolveCart(
    [{ sku: "SC-PBC-50", qty: 1 }, { sku: "FOAM", qty: 2 }, { sku: "GONE", qty: 1 }],
    [cream, foam],
  );

  it("самовывоз с комментарием", () => {
    expect(buildOrderMessage(lines, total, { name: " Айгерим ", delivery: "pickup", comment: "Позвоните" })).toBe(
      [
        "Здравствуйте! Заказ с сайта PIYOL':",
        `1) Probiotics Barrier Cream — Scinic, 50 мл — 1 шт × 13${NB}490${NB}₸`,
        `2) Gentle Foam — Round Lab — 2 шт × 6${NB}500${NB}₸`,
        `Итого: 26${NB}490${NB}₸`,
        "Имя: Айгерим",
        "Получение: самовывоз (ТРЦ Forum)",
        "Комментарий: Позвоните",
      ].join("\n"),
    );
  });

  it("доставка без комментария", () => {
    const msg = buildOrderMessage(lines, total, { name: "Аня", delivery: "delivery", address: "Абая 1", comment: " " });
    expect(msg).toContain("Получение: доставка, адрес: Абая 1");
    expect(msg).not.toContain("Комментарий");
  });
});

describe("buildSingleProductMessage", () => {
  it("с объёмом и без", () => {
    expect(buildSingleProductMessage(cream)).toBe(
      `Здравствуйте! Хочу заказать: Probiotics Barrier Cream — Scinic, 50 мл, 13${NB}490${NB}₸`,
    );
    expect(buildSingleProductMessage(foam)).toBe(`Здравствуйте! Хочу заказать: Gentle Foam — Round Lab, 6${NB}500${NB}₸`);
  });
});

describe("waLink", () => {
  it("кодирует текст", () => {
    expect(waLink("a b\nc")).toBe("https://wa.me/77080503518?text=a%20b%0Ac");
    expect(waLink("x", "+7 700 000-00-00")).toBe("https://wa.me/77000000000?text=x");
  });
});

describe("validateOrderForm", () => {
  it("имя обязательно", () => {
    expect(validateOrderForm({ name: " ", delivery: "pickup" })).toHaveProperty("name");
  });
  it("адрес обязателен при доставке", () => {
    expect(validateOrderForm({ name: "Аня", delivery: "delivery" })).toHaveProperty("address");
    expect(validateOrderForm({ name: "Аня", delivery: "pickup" })).toEqual({});
  });
});
