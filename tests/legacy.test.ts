import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";
import { LEGACY_PAGES, legacySearchUrl, matchLegacyProduct } from "@/lib/legacy";

const skus = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8")).products.map((p) => p.sku);

describe("старые адреса Tilda", () => {
  it.each([
    ["527865594-151206922981-piyol-active-hydra-moist-serum", "ACTIVE-HYDRA-MOIST-SERUM"],
    ["527865594-909424246041-piyol-bio-cell-extra-collagen-booster-cr", "BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM"],
    ["527865594-396650878291-piyol-intense-purfying-acne-foam", "INTENSE-PURIFYING-ACNE-FOAM"],
    ["527865594-748873283571-piyol-intense-purifying-hydrocolloid-acn", "INTENSE-PURIFYING-HYDROCOLLOID-ACNE-PATCH"],
    ["527865594-669421308251-piyol-active-hydra-moist-wrinkle-eye", "ACTIVE-HYDRA-MOIST-WRINKLE-EYE-CARE-CREAM"],
    ["527865594-796757680341-piyol-bio-relief-soothing-toner", "RELIEF-SOOTHING-TONER"],
    ["527862168-252569708051-piyol-two-phase-enrich-amp-moist-ampoule", "TWO-PHASE-ENRICH-MOIST-AMPOULE"],
    ["527862168-587972192911-piyol-rss-brightening-ampoule", "RSS-BRIGHTENING-AMPOULE"],
    ["527865594-243670417171-piyol-lifting-eye-care-program", "LIFTING-EYE-CARE-PROGRAM"],
    ["527867589-226922602431-piyol-spa-relaxing-glow-silk-hair-oil", "SPA-RELAXING-GLOW-SILK-HAIR-OIL"],
  ])("%s → %s", (slug, sku) => {
    expect(matchLegacyProduct(slug, skus)).toBe(sku);
  });
  it("незнакомый товар → поиск по каталогу", () => {
    expect(matchLegacyProduct("527867343-631622097751-beausta-cicarecipe-toner", skus)).toBeUndefined();
    expect(legacySearchUrl("527867343-631622097751-beausta-cicarecipe-toner")).toBe("/catalog?q=beausta%20cicarecipe%20toner");
  });
  it("разделы ведут на существующие страницы", () => {
    for (const to of Object.values(LEGACY_PAGES)) expect(to).toMatch(/^\/(catalog|about|quiz|#lines)?/);
  });
});
