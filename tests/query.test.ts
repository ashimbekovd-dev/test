import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";
import { queryCatalog, parseCatalogQuery } from "@/lib/catalog/query";
import { getCategories, getBrands } from "@/lib/products/source";
import type { Product } from "@/lib/products/types";

const { products } = parseProductsCsv(readFileSync(path.join(__dirname, "fixtures/products.csv"), "utf8"));
const skus = (ps: { sku: string }[]) => ps.map((p) => p.sku);

describe("queryCatalog", () => {
  it("filters by category, case-insensitive", () => {
    expect(skus(queryCatalog(products, { category: "увлажнение" }))).toEqual(["SC-PBC-50", "BL-TONER"]);
  });
  it("filters by brand", () => {
    expect(skus(queryCatalog(products, { brand: "L'MELE" }))).toEqual(["LM-FOAM-150"]);
  });
  it("searches name, Russian name and brand ignoring case", () => {
    expect(skus(queryCatalog(products, { q: "КРЕМ" }))).toEqual(["SC-PBC-50"]);
    expect(skus(queryCatalog(products, { q: "moremo" }))).toEqual(["MM-HAIR"]);
    expect(skus(queryCatalog(products, { q: "foam" }))).toEqual(["LM-FOAM-150"]);
  });
  it("treats ё and е as the same letter", () => {
    expect(skus(queryCatalog(products, { q: "елочная" }))).toEqual(["WD-SERUM"]);
  });
  it("sorts by price ascending and descending", () => {
    expect(skus(queryCatalog(products, { sort: "price-asc" }))[0]).toBe("LM-FOAM-150");
    expect(skus(queryCatalog(products, { sort: "price-desc" }))[0]).toBe("SC-PBC-50");
  });
  it("default sort puts hits first, then original order", () => {
    expect(skus(queryCatalog(products, {}))).toEqual(["SC-PBC-50", "WD-SERUM", "LM-FOAM-150", "BL-TONER", "MM-HAIR"]);
  });
  it("returns [] for an unknown category instead of throwing", () => {
    expect(queryCatalog(products, { category: "нет-такой" })).toEqual([]);
  });
  it("does not mutate the input array", () => {
    const before = skus(products);
    queryCatalog(products, { sort: "price-desc" });
    expect(skus(products)).toEqual(before);
  });
});

describe("parseCatalogQuery", () => {
  it("takes the first value of array params and drops empty ones", () => {
    expect(parseCatalogQuery({ category: ["Очищение", "Увлажнение"], q: "", brand: undefined }))
      .toEqual({ category: "Очищение", sort: "default" });
  });
  it("falls back to default for an unknown sort", () => {
    expect(parseCatalogQuery({ sort: "random" }).sort).toBe("default");
    expect(parseCatalogQuery({ sort: "price-asc" }).sort).toBe("price-asc");
  });
});

describe("getCategories / getBrands", () => {
  it("orders known categories as in the spec, unknown ones last alphabetically", () => {
    const extra = [...products, { ...products[0], sku: "Z", category: "Аксессуары" }];
    expect(getCategories(extra)).toEqual(["Очищение", "Увлажнение", "Дополнительный уход", "Уход за волосами", "Аксессуары"]);
  });
  it("lists brands alphabetically without duplicates", () => {
    expect(getBrands(products)).toEqual(["belusta", "l'mele", "moremo", "Scinic", "Wellderma"]);
  });
});

describe("concern filter", () => {
  const mk = (sku: string, concerns: string[]): Product =>
    ({ sku, name: sku, brand: "B", category: "C", price: 1, images: ["/a"], hit: false, inStock: true, concerns });
  const list = [mk("A", ["firmness"]), mk("B", ["moisture", "firmness"]), mk("C", [])];
  it("оставляет только товары с этой задачей", () => {
    expect(queryCatalog([...list], { concern: "firmness" }).map((p) => p.sku)).toEqual(["A", "B"]);
  });
  it("неизвестная задача → пусто", () => {
    expect(queryCatalog([...list], { concern: "nope" })).toEqual([]);
  });
  it("читается из URL", () => {
    expect(parseCatalogQuery({ concern: "pigment" }).concern).toBe("pigment");
  });
});
