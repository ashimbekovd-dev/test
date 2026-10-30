import { describe, expect, it } from "vitest";
import { catalogHref, categoryHref, sectionFor, SECTIONS } from "@/lib/sections";
import { LEGACY_PAGES } from "@/lib/legacy";
import { catalogMetadata } from "@/lib/catalog-meta";

describe("адреса разделов как на Tilda", () => {
  it("раздел ↔ чистый адрес", () => {
    expect(categoryHref("Космецевтика PIYOL'")).toBe("/piyol");
    expect(categoryHref("Линии ухода PIYOL'")).toBe("/uhodovie");
    expect(catalogHref({ concern: "moisture" })).toBe("/uvlazhnenie");
    expect(catalogHref({ concern: "acne" })).toBe("/catalog?concern=acne");
  });
  it("с поиском, брендом или сортировкой — обычный каталог", () => {
    expect(sectionFor({ category: "Очищение", q: "пудра" })).toBeUndefined();
    expect(catalogHref({ category: "Очищение", sort: "price-asc" })).toBe("/catalog?category=%D0%9E%D1%87%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B5&sort=price-asc");
    expect(catalogHref({})).toBe("/catalog");
  });
  it("разделы не пересекаются с перенаправлениями", () => {
    for (const p of Object.keys(SECTIONS)) expect(LEGACY_PAGES[p], p).toBeUndefined();
  });
  it("мета: раздел индексируется с каноническим адресом Tilda, поиск — нет", () => {
    expect(catalogMetadata({ category: "Космецевтика PIYOL'" }).alternates?.canonical).toBe("/piyol");
    expect(catalogMetadata({ category: "Космецевтика PIYOL'" }).robots).toBeUndefined();
    expect(catalogMetadata({ q: "serum" }).robots).toEqual({ index: false, follow: true });
  });
});
