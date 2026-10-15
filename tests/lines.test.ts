import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";
import { LINES, lineProducts, parseLine, stepOf } from "@/lib/lines";
import { CONCERNS } from "@/lib/concerns";

const { products } = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8"));

describe("lines", () => {
  it("parseLine понимает название и slug", () => {
    expect(parseLine("Bio Cell Extra Collagen")).toBe("bio-cell-extra-collagen");
    expect(parseLine("relief-soothing")).toBe("relief-soothing");
    expect(parseLine("")).toBeUndefined();
    expect(parseLine("Неизвестная линия")).toBeUndefined();
  });

  it("у каждой линии в данных есть средства, шаги идут от очищения к крему", () => {
    for (const line of LINES) {
      const items = lineProducts(products, line.slug);
      expect(items.length, line.slug).toBeGreaterThanOrEqual(3);
      expect(stepOf(items[0]).label, line.slug).toBe("Очищение");
      const orders = items.map((p) => stepOf(p).order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });

  it("крем для глаз идёт после основного крема", () => {
    const items = lineProducts(products, "bio-cell-extra-collagen").map((p) => p.sku);
    expect(items.indexOf("BIO-CELL-EXTRA-COLLAGEN-EYE-CREAM")).toBeGreaterThan(items.indexOf("BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM"));
  });
});

describe("concerns in data", () => {
  it("каждая задача кожи закрыта хотя бы тремя средствами", () => {
    for (const c of CONCERNS) {
      expect(products.filter((p) => p.concerns.includes(c.slug)).length, c.slug).toBeGreaterThanOrEqual(3);
    }
  });
});
