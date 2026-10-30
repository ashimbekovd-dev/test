import { afterEach, describe, expect, it, vi } from "vitest";
import { analyticsEnabledFor, METRIKA_ID, track } from "@/lib/analytics";

describe("аналитика", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("только на боевом домене", () => {
    expect(analyticsEnabledFor("piyolbeauty.kz")).toBe(true);
    expect(analyticsEnabledFor("www.piyolbeauty.kz")).toBe(true);
    expect(analyticsEnabledFor("test-one-beta-67.vercel.app")).toBe(false);
    expect(analyticsEnabledFor("localhost")).toBe(false);
  });
  it("цель уходит в Метрику и пиксель; без счётчиков — тихо", () => {
    const ym = vi.fn();
    const fbq = vi.fn();
    vi.stubGlobal("window", { ym, fbq });
    track("order_whatsapp", { value: 33980 });
    expect(ym).toHaveBeenCalledWith(METRIKA_ID, "reachGoal", "order_whatsapp", { value: 33980 });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", { currency: "KZT", value: 33980 });
    vi.stubGlobal("window", {});
    expect(() => track("add_to_cart", { sku: "X" })).not.toThrow();
  });
});
