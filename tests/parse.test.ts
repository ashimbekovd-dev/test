import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parsePrice, parseProductsCsv } from "@/lib/products/parse";

const csv = readFileSync(new URL("./fixtures/products.csv", import.meta.url), "utf8");
const { products, errors } = parseProductsCsv(csv);
const bySku = (sku: string) => products.find((p) => p.sku === sku);

describe("parseProductsCsv", () => {
  it("разбирает корректную строку целиком", () => {
    expect(bySku("SC-PBC-50")).toEqual({
      sku: "SC-PBC-50",
      name: "Probiotics Barrier Cream",
      nameRu: "Барьерный крем с пробиотиками",
      brand: "Scinic",
      category: "Увлажнение",
      price: 13490,
      oldPrice: 15990,
      volume: "50 мл",
      description: "Первый абзац.\n\nВторой абзац.",
      howToUse: "Нанести на чистую кожу.",
      images: ["https://img.example/a.jpg", "https://img.example/b.jpg"],
      hit: true,
      inStock: true,
    });
  });

  it("фото через | и через перенос строки", () => {
    expect(bySku("PY-PDRN-30")?.images).toEqual(["https://img.example/c.jpg", "https://img.example/d.jpg"]);
  });

  it("цены с пробелами, ₸ и копейками", () => {
    expect(bySku("PY-PDRN-30")?.price).toBe(18900);
    expect(bySku("CL-FOAM-150")?.price).toBe(7490);
    expect(parsePrice("13 490")).toBe(13490);
    expect(parsePrice("13 490 ₸")).toBe(13490);
    expect(parsePrice("13490,00")).toBe(13490);
    expect(parsePrice("1 250 000.50")).toBe(1250001);
    expect(parsePrice("")).toBeUndefined();
    expect(parsePrice("abc")).toBeUndefined();
  });

  it("old_price ≤ price — скидки нет", () => {
    expect(bySku("PY-PDRN-30")?.oldPrice).toBeUndefined();
    expect(bySku("CL-FOAM-150")?.oldPrice).toBeUndefined();
  });

  it("hit: да / Да / yes / 1 → true, пусто → false", () => {
    expect(bySku("SC-PBC-50")?.hit).toBe(true);
    expect(bySku("PY-PDRN-30")?.hit).toBe(true);
    expect(bySku("CL-FOAM-150")?.hit).toBe(true);
    expect(bySku("MU-TINT")?.hit).toBe(true);
  });

  it("in_stock = нет — товар скрыт, пусто — в наличии", () => {
    expect(bySku("HD-SHAMPOO")).toBeUndefined();
    expect(bySku("CL-FOAM-150")?.inStock).toBe(true);
  });

  it("битые строки уходят в errors с номером строки", () => {
    // заголовок — строка 1, многострочные значения считаются одной записью
    expect(errors).toContainEqual(expect.objectContaining({ row: 6 }));
    expect(errors).toContainEqual(expect.objectContaining({ row: 7 }));
    expect(products.find((p) => p.name === "No SKU")).toBeUndefined();
    expect(bySku("NO-PRICE")).toBeUndefined();
  });

  it("дубликат sku: первая строка остаётся, вторая — в errors", () => {
    expect(bySku("SC-PBC-50")?.name).toBe("Probiotics Barrier Cream");
    const dup = errors.find((e) => e.row === 8);
    expect(dup?.reason).toContain("duplicate");
  });

  it("обрезает пробелы и не зависит от регистра заголовков", () => {
    expect(bySku("MU-TINT")?.name).toBe("Lip Tint");
    expect(products).toHaveLength(4);
  });

  it("пустые необязательные поля — undefined", () => {
    const p = bySku("MU-TINT")!;
    expect(p.volume).toBeUndefined();
    expect(p.description).toBeUndefined();
  });
});
