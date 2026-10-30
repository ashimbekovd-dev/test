import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";
import { ldJson, productJsonLd, shortDescription, storeJsonLd } from "@/lib/seo";
import { reviewsForProduct } from "@/lib/reviews";

const { products } = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8"));
const bySku = (s: string) => products.find((p) => p.sku === s)!;

describe("SEO", () => {
  it("товар: цена в тенге, наличие, абсолютные ссылки на фото", () => {
    const d = productJsonLd(bySku("ACTIVE-HYDRA-MOIST-SERUM")) as any;
    expect(d["@type"]).toBe("Product");
    expect(d.offers.priceCurrency).toBe("KZT");
    expect(d.offers.price).toBeGreaterThan(0);
    expect(d.image.every((u: string) => u.startsWith("https://"))).toBe(true);
    expect(d.aggregateRating).toBeUndefined();
  });
  it("рейтинг — только из отзывов на само средство", () => {
    const cream = reviewsForProduct("BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM", "bio-cell-extra-collagen");
    const d = productJsonLd(bySku("BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM"), cream.reviews) as any;
    expect(d.aggregateRating).toMatchObject({ ratingValue: 5, reviewCount: 21 });
    expect(d.review[0].datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("короткое описание не длиннее лимита и без разметки", () => {
    for (const p of products) {
      const t = shortDescription(p);
      expect(t.length).toBeLessThanOrEqual(160);
      expect(t).not.toMatch(/^#|•/);
    }
  });
  it("магазин и экранирование", () => {
    expect(storeJsonLd().address.addressCountry).toBe("KZ");
    expect(ldJson({ a: "</script>" })).not.toContain("</script>");
  });
});
