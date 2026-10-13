import Papa from "papaparse";
import type { ParseError, ParseResult, Product } from "./types";

const TRUE_VALUES = new Set(["да", "yes", "true", "1", "+"]);
const REQUIRED = ["sku", "name", "price", "images"];

/** "нет", "Нет в наличии", "0", "0 шт", "no", "false", "-" → out of stock. */
function isOutOfStock(raw: string): boolean {
  const v = raw.toLowerCase();
  return v.startsWith("нет") || /^no\b/.test(v) || v === "false" || v === "-" || /^0(\s|$)/.test(v);
}

/**
 * "13 490 ₸" | "13 490" | "13490,00" | "13490.00" | "13,490.00" | "13.490" → 13490.
 * Kopecks/tiyn are dropped, never folded into the integer part. Anything else → NaN.
 */
function parsePrice(raw: string): number {
  let v = raw.replace(/[\s  ₸]|тг|ТГ/g, "");
  v = v.replace(/[.,]\d{1,2}$/, ""); // decimal part
  v = v.replace(/[.,](?=\d{3}(?:[.,]|$))/g, ""); // thousands separators
  return /^\d+$/.test(v) ? Number(v) : NaN;
}

/** Tilda exports often use protocol-relative or http URLs; next/image only accepts https. */
function normalizeImage(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://")) return `https://${url.slice(7)}`;
  return url;
}

const optional = (v: string) => (v === "" ? undefined : v);

export function parseProductsCsv(csv: string): ParseResult {
  if (csv.trimStart().startsWith("<")) {
    throw new Error("Products source is not CSV (got HTML). Is the Google Sheet published as CSV?");
  }
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase(),
    transform: (v) => v.trim(),
  });

  const fields = parsed.meta.fields ?? [];
  const missingColumns = REQUIRED.filter((c) => !fields.includes(c));
  if (missingColumns.length) throw new Error(`Products CSV missing columns: ${missingColumns.join(", ")}`);

  const products: Product[] = [];
  const errors: ParseError[] = [];
  const seen = new Set<string>();

  parsed.data.forEach((r, i) => {
    const rowNumber = i + 2; // header is row 1
    const get = (k: string) => r[k] ?? "";
    const missing = REQUIRED.filter((k) => get(k) === "");
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

    if (isOutOfStock(get("in_stock"))) return;

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
      images: get("images").split(/[|\n]/).map((s) => s.trim()).filter(Boolean).map(normalizeImage),
      hit: TRUE_VALUES.has(get("hit").toLowerCase()),
      inStock: true,
    });
  });

  return { products, errors };
}
