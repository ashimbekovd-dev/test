import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";

const REAL = path.join(__dirname, "../data/products.csv");

// Real catalog arrives as a Tilda export; until then the site runs on data/products.sample.csv.
describe.skipIf(!existsSync(REAL))("data/products.csv", () => {
  // describe bodies run at collection even when skipped, so guard the read.
  const { products, errors } = existsSync(REAL)
    ? parseProductsCsv(readFileSync(REAL, "utf8"))
    : { products: [], errors: [] };

  it("parses without errors", () => expect(errors).toEqual([]));
  it("has at least 30 products", () => expect(products.length).toBeGreaterThanOrEqual(30));
  it("every product has an https cover image", () => {
    for (const p of products) expect(p.images[0], p.sku).toMatch(/^https:\/\//);
  });
  it("covers at least 5 categories", () => {
    expect(new Set(products.map((p) => p.category)).size).toBeGreaterThanOrEqual(5);
  });
});

describe("data/products.sample.csv", () => {
  const { products, errors } = parseProductsCsv(readFileSync(path.join(__dirname, "../data/products.sample.csv"), "utf8"));
  it("parses without errors", () => expect(errors).toEqual([]));
  it("is clearly marked as demo", () => {
    for (const p of products) expect(p.sku.startsWith("DEMO-") && p.brand === "Демо", p.sku).toBe(true);
  });
});
