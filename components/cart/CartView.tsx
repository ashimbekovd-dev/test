"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MAX_QTY, resolveCart } from "@/lib/cart/cart";
import { displayName, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products/types";
import { buildOrderMessage, validateOrderForm, waLink, type OrderForm } from "@/lib/whatsapp";
import { CONTACTS } from "@/lib/config";
import { useCart } from "./CartProvider";
import { ProductImage } from "../ProductImage";
import { WhatsAppIcon } from "../icons";
import { RitualUpsell } from "./RitualUpsell";

const field = "mt-1 w-full rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none focus:border-ink/40";

export function CartView({ products }: { products: Product[] }) {
  const cart = useCart();
  const { lines, total, count } = resolveCart(cart.items, products);
  const [form, setForm] = useState<OrderForm>({ name: "", delivery: "pickup", address: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (patch: Partial<OrderForm>) => setForm((f) => ({ ...f, ...patch }));
  const nameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  if (!cart.ready) return <p className="mt-6 text-mute">Загружаем корзину…</p>;

  if (lines.length === 0) {
    return (
      <div className="arch mx-auto mt-10 max-w-md bg-petal/50 px-8 pb-12 pt-20 text-center">
        <h2 className="text-3xl">В корзине пока пусто</h2>
        <p className="mt-2 text-mute">Добавьте средства из каталога, а заказ отправьте одним сообщением в WhatsApp.</p>
        <Link href="/catalog" className="btn mt-6 bg-ink text-white">Перейти в каталог</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateOrderForm(form);
    setErrors(errs);
    if (errs.name) return nameRef.current?.focus();
    if (errs.address) return addressRef.current?.focus();
    if (count === 0) return;
    window.open(waLink(buildOrderMessage(lines, total, form)), "_blank", "noopener");
  };

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
      <section aria-label="Товары в корзине" className="min-w-0">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((l) => {
            const p = l.product;
            const name = p ? displayName(p.name) : l.sku;
            return (
              <li key={l.sku} className={`flex gap-4 py-5 ${l.available ? "" : "opacity-60"}`}>
                <div className="relative h-24 w-20 shrink-0 arch bg-petal/60">
                  {p && <ProductImage src={p.images[0]} alt="" sizes="80px" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  {p ? (
                    <Link href={`/product/${encodeURIComponent(p.sku)}`} className="font-medium leading-snug hover:text-moss">{name}</Link>
                  ) : (
                    <span className="font-medium">Товар {l.sku}</span>
                  )}
                  {p && <span className="text-[13px] text-mute">{p.brand}{p.volume ? `, ${p.volume}` : ""}</span>}
                  {!l.available && <span className="mt-1 text-[13px] font-semibold text-rose">Нет в наличии, не войдёт в заказ</span>}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    {l.available ? (
                      <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Количество: ${name}`}>
                        <button type="button" className="size-9 text-lg" aria-label="Меньше" onClick={() => cart.setQty(l.sku, l.qty - 1)}>−</button>
                        <span className="w-7 text-center tabular-nums" aria-live="polite">{l.qty}</span>
                        <button type="button" className="size-9 text-lg disabled:opacity-30" aria-label="Больше" disabled={l.qty >= MAX_QTY} onClick={() => cart.setQty(l.sku, l.qty + 1)}>+</button>
                      </div>
                    ) : <span />}
                    <span className="font-semibold tabular-nums">{l.available ? formatPrice(l.lineTotal) : ""}</span>
                  </div>
                </div>
                <button type="button" onClick={() => cart.remove(l.sku)} className="self-start p-1 text-[13px] text-mute underline underline-offset-2 hover:text-ink">
                  Удалить
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={cart.clear} className="text-[14px] text-mute underline underline-offset-2 hover:text-ink">Очистить корзину</button>
          <p className="text-xl">Итого: <b className="tabular-nums">{formatPrice(total)}</b></p>
        </div>
        <RitualUpsell products={products} />
      </section>

      <section aria-labelledby="order" className="h-fit rounded-[28px] bg-sage/50 p-6 md:p-8">
        <h2 id="order" className="text-3xl">Оформить заказ</h2>
        <p className="mt-2 text-[14px] text-mute">Откроется WhatsApp с готовым сообщением. Отправьте его, и менеджер подтвердит заказ.</p>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <label className="block text-[14px]">
            Ваше имя
            <input ref={nameRef} value={form.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} className={field} />
            {errors.name && <span id="err-name" role="alert" className="mt-1 block text-[13px] text-rose">{errors.name}</span>}
          </label>
          <fieldset>
            <legend className="text-[14px]">Как получить</legend>
            <div className="mt-2 grid gap-2">
              {([["pickup", `Самовывоз, ${CONTACTS.pickupAddress} — бесплатно`], ["delivery", "Доставка: по Алматы от 1500 ₸, по Казахстану от 1800 ₸"]] as const).map(([v, text]) => (
                <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-[14px] ${form.delivery === v ? "border-ink bg-white/80" : "border-line bg-white/40"}`}>
                  <input type="radio" name="delivery" value={v} checked={form.delivery === v} onChange={() => set({ delivery: v })} className="mt-1 accent-moss" />
                  {text}
                </label>
              ))}
            </div>
          </fieldset>
          {form.delivery === "delivery" && (
            <label className="block text-[14px]">
              Адрес доставки
              <input ref={addressRef} value={form.address} onChange={(e) => set({ address: e.target.value })} autoComplete="street-address" aria-invalid={!!errors.address} aria-describedby={errors.address ? "err-address" : undefined} className={field} />
              {errors.address && <span id="err-address" role="alert" className="mt-1 block text-[13px] text-rose">{errors.address}</span>}
            </label>
          )}
          <label className="block text-[14px]">
            Комментарий <span className="text-mute">(необязательно)</span>
            <textarea value={form.comment} onChange={(e) => set({ comment: e.target.value })} rows={3} className={field} />
          </label>
          <button type="submit" disabled={count === 0} className="btn w-full bg-moss text-white hover:bg-moss/90">
            <WhatsAppIcon className="size-5" /> Отправить заказ в WhatsApp
          </button>
          {count === 0 && <p className="text-[13px] text-rose">В корзине нет товаров в наличии.</p>}
        </form>
      </section>
    </div>
  );
}
