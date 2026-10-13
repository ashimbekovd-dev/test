import Papa from "papaparse";
import type { Product } from "./types";

export type ProductTexts = { nameRu?: string; description?: string; howToUse?: string };

const opt = (v?: string) => (v && v.trim() ? v.trim() : undefined);

/** data/products.catalog.csv → sku → long texts (imported from PIYOL' product files). */
export function parseTextsCsv(csv: string): Map<string, ProductTexts> {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: "greedy" });
  return new Map(
    data
      .filter((r) => opt(r.sku))
      .map((r) => [r.sku.trim(), { nameRu: opt(r.name_ru), description: opt(r.description), howToUse: opt(r.how_to_use) }]),
  );
}

/** Sheet values win; empty fields are filled from the imported texts. */
export function mergeTexts(products: Product[], texts: Map<string, ProductTexts>): Product[] {
  return products.map((p) => {
    const t = texts.get(p.sku);
    if (!t) return p;
    return {
      ...p,
      nameRu: p.nameRu ?? t.nameRu,
      description: p.description ?? t.description,
      howToUse: p.howToUse ?? t.howToUse,
    };
  });
}
