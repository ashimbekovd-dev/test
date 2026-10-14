import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseProductsCsv } from "@/lib/products/parse";

const { products, errors } = parseProductsCsv(
  readFileSync(new URL("../data/products.csv", import.meta.url), "utf8"),
);

describe("data/products.csv", () => {
  it("разбирается без ошибок", () => {
    expect(errors).toEqual([]);
  });
  it("достаточно товаров и категорий", () => {
    expect(products.length).toBeGreaterThanOrEqual(30);
    expect(new Set(products.map((p) => p.category)).size).toBeGreaterThanOrEqual(5);
  });
  it("у каждого товара есть https-фото", () => {
    for (const p of products) expect(p.images[0]).toMatch(/^https:\/\//);
  });
  it("sku уникальны и годятся для URL", () => {
    for (const p of products) expect(p.sku).toMatch(/^[a-z0-9-]+$/);
  });
});
