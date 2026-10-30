/**
 * Аналитика: Яндекс Метрика и пиксель Facebook — те же счётчики, что стояли на сайте на Tilda,
 * чтобы история посещений и рекламные аудитории не прервались после переезда.
 * Работают только на боевом домене, чтобы тестовые визиты не портили статистику.
 */

export const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YM_ID || 92261052);
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "1593294817810024";
export const ANALYTICS_HOSTS = (process.env.NEXT_PUBLIC_ANALYTICS_HOSTS || "piyolbeauty.kz,www.piyolbeauty.kz")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

export const analyticsEnabledFor = (hostname: string) => ANALYTICS_HOSTS.includes(hostname);

export type Goal = "whatsapp_click" | "order_whatsapp" | "add_to_cart";

/** Facebook: стандартные события, по которым настраивается реклама */
const FB_EVENT: Record<Goal, string> = { whatsapp_click: "Contact", order_whatsapp: "Lead", add_to_cart: "AddToCart" };

type W = Window & { ym?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/** Цель в Метрике + событие в пикселе. Если счётчики не загружены — ничего не делает. */
export function track(goal: Goal, params: { value?: number; sku?: string } = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  try {
    w.ym?.(METRIKA_ID, "reachGoal", goal, params);
    const fb: Record<string, unknown> = { currency: "KZT" };
    if (params.value) fb.value = params.value;
    if (params.sku) fb.content_ids = [params.sku];
    w.fbq?.("track", FB_EVENT[goal], fb);
  } catch {
    /* аналитика не должна ломать сайт */
  }
}
