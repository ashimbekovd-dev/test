import Papa from "papaparse";
import type { ParseError, ParseResult, Product } from "./types";

const TRUE_VALUES = new Set(["да", "yes", "y", "true", "1", "+"]);
const FALSE_VALUES = new Set(["нет", "no", "n", "false", "0", "-"]);

/** "13 490 ₸", "13 490", "13490,00" → 13490. Пусто или мусор → undefined. */
export function parsePrice(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  let s = raw.replace(/[\s  ₸]/g, "").replace(/(тг|тенге|kzt)$/i, "");
  if (!s) return undefined;
  // запятая перед 1–2 цифрами в конце — десятичная, иначе разделитель тысяч
  if (/,\d{1,2}$/.test(s)) s = s.replace(/,(\d{1,2})$/, ".$1");
  s = s.replace(/,/g, "");
  if (!/^\d+(\.\d+)?$/.test(s)) return undefined;
  return Math.round(Number(s));
}

function parseBool(raw: string | undefined, fallback: boolean): boolean {
  const v = (raw ?? "").trim().toLowerCase();
  if (TRUE_VALUES.has(v)) return true;
  if (FALSE_VALUES.has(v)) return false;
  return fallback;
}

function optional(raw: string | undefined): string | undefined {
  const v = (raw ?? "").trim();
  return v ? v : undefined;
}

function parseImages(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(/[|\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseProductsCsv(csv: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  const products: Product[] = [];
  const errors: ParseError[] = [];
  const seen = new Set<string>();

  parsed.data.forEach((rec, index) => {
    const row = index + 2; // строка 1 — заголовки
    const sku = optional(rec.sku);
    const name = optional(rec.name);
    const brand = optional(rec.brand);
    const category = optional(rec.category);
    const price = parsePrice(rec.price);
    const images = parseImages(rec.images);

    const missing = [
      !sku && "sku",
      !name && "name",
      !brand && "brand",
      !category && "category",
      price === undefined && "price",
      images.length === 0 && "images",
    ].filter(Boolean);
    if (missing.length) {
      errors.push({ row, reason: `missing ${missing.join(", ")}` });
      return;
    }
    if (seen.has(sku!)) {
      errors.push({ row, reason: `duplicate sku ${sku}` });
      return;
    }
    seen.add(sku!);

    const inStock = parseBool(rec.in_stock, true);
    if (!inStock) return;

    const oldPrice = parsePrice(rec.old_price);
    products.push({
      sku: sku!,
      name: name!,
      nameRu: optional(rec.name_ru),
      brand: brand!,
      category: category!,
      price: price!,
      oldPrice: oldPrice !== undefined && oldPrice > price! ? oldPrice : undefined,
      volume: optional(rec.volume),
      description: optional(rec.description?.replace(/\r\n/g, "\n")),
      howToUse: optional(rec.how_to_use?.replace(/\r\n/g, "\n")),
      images,
      hit: parseBool(rec.hit, false),
      inStock: true,
    });
  });

  return { products, errors };
}
