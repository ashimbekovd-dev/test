import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

// U+00A0 — неразрывный пробел между разрядами и перед ₸
const NB = " ";

describe("formatPrice", () => {
  it("группирует тысячи неразрывным пробелом", () => {
    expect(formatPrice(13490)).toBe(`13${NB}490${NB}₸`);
  });
  it("короткие числа без группировки", () => {
    expect(formatPrice(500)).toBe(`500${NB}₸`);
  });
  it("миллионы", () => {
    expect(formatPrice(1250000)).toBe(`1${NB}250${NB}000${NB}₸`);
  });
  it("округляет дробные значения", () => {
    expect(formatPrice(999.6)).toBe(`1${NB}000${NB}₸`);
  });
});
