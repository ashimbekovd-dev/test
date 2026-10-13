import { describe, it, expect, vi, afterEach } from "vitest";
import { getProducts } from "@/lib/products/source";

const HEADER = "sku,name,brand,category,price,images";
const respond = (body: string, status = 200) =>
  vi.stubGlobal("fetch", vi.fn(async () => new Response(body, { status })));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getProducts from PRODUCTS_CSV_URL", () => {
  it("returns products from the sheet", async () => {
    vi.stubEnv("PRODUCTS_CSV_URL", "https://sheet.example/csv");
    respond(`${HEADER}\nA,Cream,B,Очищение,1000,https://i/a.jpg`);
    expect((await getProducts()).map((p) => p.sku)).toEqual(["A"]);
  });
  it("throws (keeping the last good ISR page) when the sheet has no products", async () => {
    vi.stubEnv("PRODUCTS_CSV_URL", "https://sheet.example/csv");
    respond(`${HEADER}\n`);
    await expect(getProducts()).rejects.toThrow(/no products/);
  });
  it("throws when the sheet returns HTML", async () => {
    vi.stubEnv("PRODUCTS_CSV_URL", "https://sheet.example/csv");
    respond("<html>login</html>");
    await expect(getProducts()).rejects.toThrow(/not CSV/);
  });
  it("throws on a non-200 response", async () => {
    vi.stubEnv("PRODUCTS_CSV_URL", "https://sheet.example/csv");
    respond("oops", 500);
    await expect(getProducts()).rejects.toThrow(/500/);
  });
});
