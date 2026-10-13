import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";

const HEADER = "sku,name,name_ru,brand,category,price,old_price,volume,description,how_to_use,images,hit,in_stock";
const row = (o: Partial<Record<string, string>>) => {
  const d: Record<string, string> = { sku: "X1", name: "Cream", brand: "B", category: "Увлажнение", price: "1000", images: "https://i/a.jpg", ...o } as Record<string, string>;
  return HEADER.split(",").map((k) => `"${(d[k] ?? "").replace(/"/g, '""')}"`).join(",");
};
const csv = (...rows: string[]) => [HEADER, ...rows].join("\n");

describe("parseProductsCsv", () => {
  it("parses a full row into a Product", () => {
    const text = readFileSync(path.join(__dirname, "fixtures/products.csv"), "utf8");
    const { products, errors } = parseProductsCsv(text);
    expect(errors).toEqual([]);
    expect(products[0]).toEqual({
      sku: "SC-PBC-50", name: "Probiotics Barrier Cream", nameRu: "Барьерный крем с пробиотиками",
      brand: "Scinic", category: "Увлажнение", price: 13490, oldPrice: 15990, volume: "50 мл",
      description: "Крем для барьера.\n\nВторой абзац.", howToUse: "Нанести вечером",
      images: ["https://img.example/a.jpg", "https://img.example/b.jpg"], hit: true, inStock: true,
    });
    expect(products).toHaveLength(5);
  });

  it("splits images on | and on newlines", () => {
    const { products } = parseProductsCsv(csv(row({ images: "https://i/a.jpg\nhttps://i/b.jpg" })));
    expect(products[0].images).toEqual(["https://i/a.jpg", "https://i/b.jpg"]);
  });

  it.each(["13 490 ₸", "13 490", "13490,00", " 13490 "])("parses price %j as 13490", (p) => {
    const { products, errors } = parseProductsCsv(csv(row({ price: p })));
    expect(errors).toEqual([]);
    expect(products[0].price).toBe(13490);
  });

  it("drops old_price that is not above price", () => {
    const { products } = parseProductsCsv(csv(row({ price: "1000", old_price: "1000" })));
    expect(products[0].oldPrice).toBeUndefined();
  });

  it.each([["да", true], ["Да", true], ["yes", true], ["1", true], ["", false], ["нет", false]])(
    "hit %j → %s", (v, expected) => {
      expect(parseProductsCsv(csv(row({ hit: v as string }))).products[0].hit).toBe(expected);
    });

  it("hides products with in_stock = нет, keeps empty as in stock", () => {
    const { products } = parseProductsCsv(csv(row({ sku: "A", in_stock: "нет" }), row({ sku: "B", in_stock: "" })));
    expect(products.map((p) => p.sku)).toEqual(["B"]);
    expect(products[0].inStock).toBe(true);
  });

  it.each(["sku", "name", "price", "images"])("skips a row without %s and reports its row number", (field) => {
    const { products, errors } = parseProductsCsv(csv(row({ sku: "OK" }), row({ sku: "BAD", [field]: "" })));
    expect(products.map((p) => p.sku)).toEqual(field === "sku" ? ["OK"] : ["OK"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].row).toBe(3);
  });

  it("rejects a non-numeric price", () => {
    const { products, errors } = parseProductsCsv(csv(row({ price: "по запросу" })));
    expect(products).toEqual([]);
    expect(errors).toHaveLength(1);
  });

  it("keeps the first of duplicate skus and reports the rest", () => {
    const { products, errors } = parseProductsCsv(csv(row({ sku: "D", name: "First" }), row({ sku: "D", name: "Second" })));
    expect(products.map((p) => p.name)).toEqual(["First"]);
    expect(errors[0].reason).toContain("duplicate");
  });

  it("trims values and accepts headers in any case", () => {
    const text = "SKU,Name,Brand,Category,Price,Images\n  A1 , Cream ,B,Очищение,500, https://i/a.jpg ";
    const { products } = parseProductsCsv(text);
    expect(products[0]).toMatchObject({ sku: "A1", name: "Cream", price: 500, images: ["https://i/a.jpg"] });
    expect(products[0].nameRu).toBeUndefined();
  });
});

describe("parseProductsCsv — review fixes", () => {
  it.each([["13490.00", 13490], ["13,490.00", 13490], ["13.490", 13490], ["13 490,50", 13490], ["13490.5", 13490]])(
    "price %j → %d (never inflated)", (p, expected) => {
      const { products, errors } = parseProductsCsv(csv(row({ price: p })));
      expect(errors).toEqual([]);
      expect(products[0].price).toBe(expected);
    });

  it("throws on an HTML page instead of CSV", () => {
    expect(() => parseProductsCsv("<!DOCTYPE html><html><body>Sign in</body></html>")).toThrow(/not CSV/);
  });

  it("throws when required headers are missing", () => {
    expect(() => parseProductsCsv("title,cost\nA,100")).toThrow(/missing columns/);
  });

  it("normalizes protocol-relative and http image URLs to https", () => {
    const { products } = parseProductsCsv(csv(row({ images: "//static.tildacdn.com/a.jpg|http://static.tildacdn.com/b.jpg|/demo/1.svg" })));
    expect(products[0].images).toEqual(["https://static.tildacdn.com/a.jpg", "https://static.tildacdn.com/b.jpg", "/demo/1.svg"]);
  });

  it.each(["Нет в наличии", "нет", "0", "0 шт", "No"])("hides product when in_stock is %j", (v) => {
    expect(parseProductsCsv(csv(row({ in_stock: v }))).products).toEqual([]);
  });

  it.each(["", "да", "есть", "5 шт"])("keeps product when in_stock is %j", (v) => {
    expect(parseProductsCsv(csv(row({ in_stock: v }))).products).toHaveLength(1);
  });
});
