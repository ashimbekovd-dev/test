import { WHATSAPP_NUMBER } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/cart/cart";
import type { Product } from "@/lib/products/types";

export type OrderForm = { name: string; delivery: "pickup" | "delivery"; address?: string; comment?: string };

export function validateOrderForm(form: OrderForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "Укажите имя";
  if (form.delivery === "delivery" && !form.address?.trim()) errors.address = "Укажите адрес доставки";
  return errors;
}

const productLabel = (p: Product) => `${p.name} — ${p.brand}${p.volume ? `, ${p.volume}` : ""}`;

export function buildOrderMessage(lines: CartLine[], total: number, form: OrderForm): string {
  const items = lines
    .filter((l) => l.available && l.product)
    .map((l, i) => `${i + 1}) ${productLabel(l.product!)} — ${l.qty} шт × ${formatPrice(l.product!.price)}`);
  const out = ["Здравствуйте! Заказ с сайта PIYOL':", ...items, `Итого: ${formatPrice(total)}`, `Имя: ${form.name.trim()}`];
  out.push(
    form.delivery === "pickup"
      ? "Получение: самовывоз (ТРЦ Forum)"
      : `Получение: доставка, адрес: ${form.address?.trim() ?? ""}`,
  );
  const comment = form.comment?.trim();
  if (comment) out.push(`Комментарий: ${comment}`);
  return out.join("\n");
}

export function buildSingleProductMessage(p: Product): string {
  return `Здравствуйте! Хочу заказать: ${productLabel(p)}, ${formatPrice(p.price)}`;
}

export function waLink(text: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
