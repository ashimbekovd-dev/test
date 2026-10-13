import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseProductsCsv } from "./parse";
import type { Product } from "./types";

export const REVALIDATE_SECONDS = 300;

/** Category order from the spec (§4); categories not listed go last, alphabetically. */
export const CATEGORY_ORDER = [
  "Очищение", "Увлажнение", "Дополнительный уход", "Космецевтика PIYOL'", "Линии ухода PIYOL'",
  "Готовые наборы", "Уход за волосами", "Макияж", "Уход за телом", "Миниатюры", "Подарочные наборы",
];

async function loadCsv(): Promise<string> {
  const url = process.env.PRODUCTS_CSV_URL;
  if (url) {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Products CSV fetch failed: ${res.status} ${res.statusText}`);
    return res.text();
  }
  const real = path.join(process.cwd(), "data/products.csv");
  const file = existsSync(real) ? real : path.join(process.cwd(), "data/products.sample.csv");
  return readFile(file, "utf8");
}

export async function getProducts(): Promise<Product[]> {
  const { products, errors } = parseProductsCsv(await loadCsv());
  for (const e of errors) console.warn(`[products] row ${e.row}: ${e.reason}`);
  // An empty catalog is never a valid state: throwing makes Next keep the last good pages.
  if (products.length === 0) throw new Error("Products source has no products");
  return products;
}

export async function getProduct(sku: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.sku === sku);
}

export function getCategories(products: Product[]): string[] {
  const present = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const known = CATEGORY_ORDER.filter((c) => present.includes(c));
  const rest = present.filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, "ru"));
  return [...known, ...rest];
}

export function getBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );
}
