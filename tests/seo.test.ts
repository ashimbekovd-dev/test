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

import { CATEGORY_SEO, CONCERN_SEO, HOME_SEO, CATALOG_SEO, productSeoDescription } from "@/lib/seo-pages";
import { breadcrumbJsonLd, faqJsonLd, ritualJsonLd } from "@/lib/seo";
import { CONCERNS } from "@/lib/concerns";

describe("SEO-тексты", () => {
  it("заголовки не длиннее 60, описания не длиннее 170", () => {
    for (const p of [HOME_SEO, CATALOG_SEO, ...Object.values(CATEGORY_SEO), ...Object.values(CONCERN_SEO)]) {
      expect(p.title.length, p.title).toBeLessThanOrEqual(60);
      expect(p.description.length, p.description).toBeLessThanOrEqual(170);
    }
  });
  it("есть текст для каждой задачи кожи и каждого раздела каталога", () => {
    for (const c of CONCERNS) expect(CONCERN_SEO[c.slug], c.slug).toBeDefined();
    for (const cat of new Set(products.map((p) => p.category))) if (cat !== "PIYOL'") expect(CATEGORY_SEO[cat], cat).toBeDefined();
  });
  it("описание товара с ценой укладывается в 160", () => {
    const d = productSeoDescription("а".repeat(300), "18 600 ₸");
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d).toContain("Цена 18 600 ₸");
  });
  it("крошки, ритуал, FAQ", () => {
    const b = breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Каталог", path: "/catalog" }]) as any;
    expect(b.itemListElement[1]).toMatchObject({ position: 2, name: "Каталог" });
    expect(b.itemListElement[1].item).toMatch(/^https:\/\/.+\/catalog$/);
    const r = ritualJsonLd("Ритуал X", "/lines/x", products.slice(0, 3)) as any;
    expect(r.numberOfItems).toBe(3);
    const f = faqJsonLd([{ q: "Вопрос?", a: ["• один", "• два"] }]) as any;
    expect(f.mainEntity[0].acceptedAnswer.text).toBe("один два");
  });
});
