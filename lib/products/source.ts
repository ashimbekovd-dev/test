import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parseProductsCsv } from "./parse";
import type { Product } from "./types";

export const REVALIDATE_SECONDS = 300;

async function loadCsv(): Promise<string> {
  const url = process.env.PRODUCTS_CSV_URL;
  if (url) {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Не удалось загрузить таблицу товаров: HTTP ${res.status}`);
    return res.text();
  }
  return readFile(path.join(process.cwd(), "data", "products.csv"), "utf8");
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const { products, errors } = parseProductsCsv(await loadCsv());
  for (const e of errors) console.warn(`[products] строка ${e.row}: ${e.reason}`);
  if (products.length === 0) throw new Error("Таблица товаров пуста или не читается");
  return products;
});

export async function getProduct(sku: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.sku === sku);
}
