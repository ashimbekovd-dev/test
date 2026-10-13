import Papa from "papaparse";
import type { ParseError, ParseResult, Product } from "./types";

const TRUE_VALUES = new Set(["да", "yes", "true", "1", "+"]);
const FALSE_VALUES = new Set(["нет", "no", "false", "0", "-"]);

/** "13 490 ₸" | "13 490" | "13490,00" → 13490; anything else → NaN. */
function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[\s  ₸тгТГ.]/g, "").replace(/,\d{1,2}$/, "");
  return /^\d+$/.test(cleaned) ? Number(cleaned) : NaN;
}

const optional = (v: string) => (v === "" ? undefined : v);

export function parseProductsCsv(csv: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase(),
    transform: (v) => v.trim(),
  });

  const products: Product[] = [];
  const errors: ParseError[] = [];
  const seen = new Set<string>();

  parsed.data.forEach((r, i) => {
    const rowNumber = i + 2; // header is row 1
    const get = (k: string) => r[k] ?? "";
    const missing = ["sku", "name", "price", "images"].filter((k) => get(k) === "");
    if (missing.length) {
      errors.push({ row: rowNumber, reason: `missing ${missing.join(", ")}` });
      return;
    }
    const price = parsePrice(get("price"));
    if (Number.isNaN(price)) {
      errors.push({ row: rowNumber, reason: `invalid price "${get("price")}"` });
      return;
    }
    const sku = get("sku");
    if (seen.has(sku)) {
      errors.push({ row: rowNumber, reason: `duplicate sku "${sku}"` });
      return;
    }
    seen.add(sku);

    const stock = get("in_stock").toLowerCase();
    if (FALSE_VALUES.has(stock)) return;

    const old = parsePrice(get("old_price"));
    products.push({
      sku,
      name: get("name"),
      nameRu: optional(get("name_ru")),
      brand: get("brand"),
      category: get("category"),
      price,
      oldPrice: !Number.isNaN(old) && old > price ? old : undefined,
      volume: optional(get("volume")),
      description: optional(get("description").replace(/\r\n/g, "\n")),
      howToUse: optional(get("how_to_use").replace(/\r\n/g, "\n")),
      images: get("images").split(/[|\n]/).map((s) => s.trim()).filter(Boolean),
      hit: TRUE_VALUES.has(get("hit").toLowerCase()),
      inStock: true,
    });
  });

  return { products, errors };
}
