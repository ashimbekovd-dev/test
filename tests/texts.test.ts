import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { mergeTexts, parseTextsCsv } from "@/lib/products/texts";
import type { Product } from "@/lib/products/types";

const base = (o: Partial<Product> = {}): Product => ({
  sku: "RELIEF-SOOTHING-SERUM", name: "PIYOL' Relief Soothing Serum", brand: "PIYOL'", category: "Линии ухода PIYOL'",
  price: 9990, images: ["https://i/a.jpg"], hit: false, inStock: true, concerns: [], ...o,
});

describe("product texts", () => {
  const texts = parseTextsCsv(readFileSync(path.join(__dirname, "../data/products.catalog.csv"), "utf8"));

  it("loads description, how-to-use and Russian name for all 41 imported products", () => {
    expect(texts.size).toBe(41);
    expect(texts.get("RELIEF-SOOTHING-SERUM")?.nameRu).toBe("Успокаивающая сыворотка для лица");
  });

  it("fills missing texts from the catalog by sku", () => {
    const [p] = mergeTexts([base()], texts);
    expect(p.description).toMatch(/^SOS-сыворотка для раздражённой кожи/);
    expect(p.howToUse).toContain("утром и вечером");
    expect(p.nameRu).toBe("Успокаивающая сыворотка для лица");
  });

  it("keeps texts the manager wrote in the sheet", () => {
    const [p] = mergeTexts([base({ description: "Своё описание", nameRu: "Своё имя" })], texts);
    expect(p.description).toBe("Своё описание");
    expect(p.nameRu).toBe("Своё имя");
    expect(p.howToUse).toContain("утром и вечером");
  });

  it("leaves products with unknown skus untouched", () => {
    const p = base({ sku: "DEMO-01" });
    expect(mergeTexts([p], texts)[0]).toEqual(p);
  });
});
