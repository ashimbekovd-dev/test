import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseProductsCsv } from "@/lib/products/parse";
import { getBrands, getCategories, parseCatalogQuery, queryCatalog } from "@/lib/catalog/query";
import type { Product } from "@/lib/products/types";

const { products } = parseProductsCsv(
  readFileSync(new URL("./fixtures/products.csv", import.meta.url), "utf8"),
);
const skus = (list: Product[]) => list.map((p) => p.sku);

describe("queryCatalog", () => {
  it("фильтр по категории и бренду без учёта регистра", () => {
    expect(skus(queryCatalog(products, { category: "увлажнение" }))).toEqual(["SC-PBC-50"]);
    expect(skus(queryCatalog(products, { brand: "round lab" }))).toEqual(["CL-FOAM-150"]);
  });

  it("поиск по name, nameRu, brand, без учёта регистра и ё/е", () => {
    expect(skus(queryCatalog(products, { q: "крем" }))).toEqual(["SC-PBC-50"]);
    expect(skus(queryCatalog(products, { q: "PDRN" }))).toEqual(["PY-PDRN-30"]);
    expect(skus(queryCatalog(products, { q: "scinic" }))).toEqual(["SC-PBC-50"]);
    const withYo: Product = { ...products[0], sku: "YO", nameRu: "Тёплый крем" };
    expect(skus(queryCatalog([withYo], { q: "теплый" }))).toEqual(["YO"]);
  });

  it("сортировка по цене", () => {
    const asc = queryCatalog(products, { sort: "price-asc" }).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = queryCatalog(products, { sort: "price-desc" }).map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("default: сначала хиты, затем исходный порядок", () => {
    const list: Product[] = [
      { ...products[0], sku: "A", hit: false },
      { ...products[0], sku: "B", hit: true },
      { ...products[0], sku: "C", hit: false },
      { ...products[0], sku: "D", hit: true },
    ];
    expect(skus(queryCatalog(list, {}))).toEqual(["B", "D", "A", "C"]);
  });

  it("неизвестная категория → пусто, без исключения", () => {
    expect(queryCatalog(products, { category: "нет-такой" })).toEqual([]);
  });
});

describe("parseCatalogQuery", () => {
  it("массив → первое значение, неизвестный sort → default", () => {
    expect(parseCatalogQuery({ category: ["Очищение", "Макияж"], sort: "abc" })).toEqual({
      category: "Очищение",
      sort: "default",
    });
  });
  it("пустые строки отбрасываются", () => {
    expect(parseCatalogQuery({ q: "  ", brand: "", sort: "price-asc" })).toEqual({ sort: "price-asc" });
  });
});

describe("getCategories / getBrands", () => {
  it("категории спеки впереди, неизвестные — в конец по алфавиту", () => {
    const list: Product[] = [
      { ...products[0], category: "Яблоки" },
      { ...products[0], category: "Макияж" },
      { ...products[0], category: "Аксессуары" },
      { ...products[0], category: "Очищение" },
    ];
    expect(getCategories(list)).toEqual(["Очищение", "Макияж", "Аксессуары", "Яблоки"]);
  });
  it("бренды по алфавиту без повторов", () => {
    expect(getBrands(products)).toEqual(["PIYOL'", "Rom&nd", "Round Lab", "Scinic"]);
  });
});
