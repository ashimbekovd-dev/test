import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { CASES, casesFor } from "@/lib/cases";
import { getLine } from "@/lib/lines";
import { parseProductsCsv } from "@/lib/products/parse";

const { products } = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8"));

describe("before/after cases", () => {
  it("файлы на месте, ссылки ведут на существующие линии и товары", () => {
    for (const c of CASES) {
      expect(existsSync(path.join(process.cwd(), "public", c.image)), c.image).toBe(true);
      if (c.line) expect(getLine(c.line), c.line).toBeDefined();
      if (c.sku) expect(products.some((p) => p.sku === c.sku), c.sku).toBe(true);
    }
  });
  it("кейсы для товара: по артикулу и по линии", () => {
    expect(casesFor({ sku: "RSS-BRIGHTENING-AMPOULE" })).toHaveLength(2);
    expect(casesFor({ sku: "ACTIVE-HYDRA-MOIST-SERUM", line: "active-hydra-moist" }).map((c) => c.title)).toEqual(["Active Hydra-Moist"]);
    expect(casesFor({ sku: "HAND-CREAM" })).toEqual([]);
  });
});
