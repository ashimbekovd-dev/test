import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("groups thousands with non-breaking spaces and adds ₸", () => {
    expect(formatPrice(13490)).toBe("13 490 ₸");
  });
  it("formats small numbers without grouping", () => {
    expect(formatPrice(500)).toBe("500 ₸");
  });
  it("formats millions", () => {
    expect(formatPrice(1250000)).toBe("1 250 000 ₸");
  });
});
