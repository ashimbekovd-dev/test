import { WHATSAPP_NUMBER } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/cart/cart";
import type { Product } from "@/lib/products/types";

export type OrderForm = { name: string; delivery: "pickup" | "delivery"; address?: string; comment?: string };

const label = (p: Product) => `${p.name} — ${p.brand}${p.volume ? `, ${p.volume}` : ""}`;

export function validateOrderForm(form: OrderForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "Укажите имя";
  if (form.delivery === "delivery" && !form.address?.trim()) errors.address = "Укажите адрес доставки";
  return errors;
}

export function buildOrderMessage(lines: CartLine[], total: number, form: OrderForm): string {
  const items = lines
    .filter((l) => l.available && l.product)
    .map((l, i) => `${i + 1}) ${label(l.product!)} — ${l.qty} шт × ${formatPrice(l.product!.price)}`);
  const delivery =
    form.delivery === "pickup" ? "самовывоз из магазина" : `доставка, адрес: ${form.address?.trim() ?? ""}`;
  const comment = form.comment?.trim();
  return [
    "Здравствуйте! Заказ с сайта PIYOL':",
    ...items,
    `Итого: ${formatPrice(total)}`,
    `Имя: ${form.name.trim()}`,
    `Получение: ${delivery}`,
    ...(comment ? [`Комментарий: ${comment}`] : []),
  ].join("\n");
}

export function buildSingleProductMessage(p: Product): string {
  return `Здравствуйте! Хочу заказать: ${label(p)}, ${formatPrice(p.price)}`;
}

export function waLink(text: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

/** Заказ целого ритуала одной кнопкой со страницы линии. */
export function buildRitualMessage(lineName: string, products: Product[]): string {
  const total = products.reduce((s, p) => s + p.price, 0);
  return [
    `Здравствуйте! Хочу заказать ритуал ${lineName}:`,
    ...products.map((p, i) => `${i + 1}) ${label(p)} — ${formatPrice(p.price)}`),
    `Итого: ${formatPrice(total)}`,
  ].join("\n");
}
