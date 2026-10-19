import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { allReviews, averageRating, REVIEW_SHOTS, REVIEWS, reviewsFor, reviewsWord, shotsFor } from "@/lib/reviews";
import { getLine } from "@/lib/lines";

describe("Kaspi reviews", () => {
  it("скриншоты на месте, линии существуют", () => {
    for (const s of REVIEW_SHOTS) {
      expect(existsSync(path.join(process.cwd(), "public", s.image)), s.image).toBe(true);
      expect(getLine(s.line)).toBeDefined();
    }
    for (const r of REVIEWS) {
      expect(getLine(r.line), r.line).toBeDefined();
      expect(r.date).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    }
  });
  it("отзывы линии: сначала избранные, внутри — от новых к старым", () => {
    const list = reviewsFor("intense-purifying-acne");
    expect(list).toHaveLength(21);
    const firstPlain = list.findIndex((r) => !r.featured);
    expect(list.slice(firstPlain).every((r) => !r.featured)).toBe(true);
    expect(list[0].name).toBe("Аида");
    expect(list[firstPlain].name).toBe("Алиям");
    expect(reviewsFor("relief-soothing")).toEqual([]);
    expect(reviewsFor(undefined)).toEqual([]);
    expect(shotsFor("intense-purifying-acne")).toHaveLength(7);
    expect(reviewsFor("active-hydra-moist")).toHaveLength(10);
    expect(shotsFor("active-hydra-moist")).toHaveLength(5);
    expect(reviewsFor("active-hydra-moist")[0].name).toBe("Марзия");
  });
  it("главная: линии чередуются, ничего не теряется", () => {
    const all = allReviews();
    expect(all).toHaveLength(REVIEWS.length);
    expect(all.slice(0, 2).map((r) => r.line).sort()).toEqual(["active-hydra-moist", "intense-purifying-acne"]);
  });
  it("средняя оценка и склонение", () => {
    expect(averageRating(reviewsFor("intense-purifying-acne"))).toBe(5);
    expect(averageRating([])).toBe(0);
    expect([1, 2, 5, 11, 12, 21, 22, 25, 111].map(reviewsWord)).toEqual([
      "отзыв", "отзыва", "отзывов", "отзывов", "отзывов", "отзыв", "отзыва", "отзывов", "отзывов",
    ]);
  });
});
