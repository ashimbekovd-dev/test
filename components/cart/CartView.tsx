"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { ProductImage } from "@/components/ProductImage";
import { MAX_QTY, resolveCart } from "@/lib/cart/cart";
import { CONTACTS } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products/types";
import { buildOrderMessage, validateOrderForm, waLink, type OrderForm } from "@/lib/whatsapp";

export function CartView({ products }: { products: Product[] }) {
  const { items, ready, setQty, remove, clear } = useCart();
  const { lines, total, count } = useMemo(() => resolveCart(items, products), [items, products]);
  const [form, setForm] = useState<OrderForm>({ name: "", delivery: "pickup", address: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  if (!ready) return <p className="mt-8 text-graphite-soft">Загружаем корзину…</p>;

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-[var(--radius-card)] bg-pad px-6 py-14 text-center">
        <h2 className="text-3xl">Корзина пуста</h2>
        <p className="mx-auto mt-3 max-w-md text-graphite-soft">Добавьте средства из каталога — заказ уйдёт менеджеру одним сообщением в WhatsApp.</p>
        <Link href="/catalog" className="mt-6 inline-block rounded-full bg-graphite px-7 py-3 text-milk">Открыть каталог</Link>
      </div>
    );
  }

  const update = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateOrderForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(errs.name ? "order-name" : "order-address")?.focus();
      return;
    }
    window.open(waLink(buildOrderMessage(lines, total, form)), "_blank", "noopener");
    setSent(true);
  };

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <section aria-label="Товары в корзине">
        <ul className="border-t border-line">
          {lines.map((line) => {
            const p = line.product;
            return (
              <li key={line.sku} className="flex gap-4 border-b border-line py-5">
                <div className="w-20 shrink-0 overflow-hidden rounded-lg sm:w-24">
                  {p ? <ProductImage src={p.images[0]} alt="" sizes="96px" /> : <div className="aspect-[4/5] bg-pad" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {p ? (
                        <>
                          <p className="text-[13px] text-sage-deep">{p.brand}</p>
                          <Link href={`/product/${p.sku}`} className="font-medium leading-snug hover:underline">{p.name}</Link>
                          {p.volume && <p className="text-[13px] text-graphite-soft">{p.volume}</p>}
                        </>
                      ) : (
                        <p className="font-medium">Товар убран из каталога</p>
                      )}
                      {!line.available && (
                        <p className="mt-1 text-[13px] font-medium text-powder-deep">Нет в наличии — не войдёт в заказ</p>
                      )}
                    </div>
                    <button type="button" onClick={() => remove(line.sku)} className="shrink-0 text-[13px] text-graphite-soft underline underline-offset-2 hover:text-graphite">
                      Удалить
                    </button>
                  </div>
                  {line.available && p && (
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Количество: ${p.name}`}>
                        <button type="button" className="grid size-9 place-items-center" aria-label="Меньше" onClick={() => setQty(line.sku, line.qty - 1)}>
                          <MinusIcon className="size-4" />
                        </button>
                        <span className="w-7 text-center tabular-nums" aria-live="polite">{line.qty}</span>
                        <button type="button" className="grid size-9 place-items-center disabled:opacity-40" aria-label="Больше" disabled={line.qty >= MAX_QTY} onClick={() => setQty(line.sku, line.qty + 1)}>
                          <PlusIcon className="size-4" />
                        </button>
                      </div>
                      <p className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" onClick={clear} className="mt-4 text-[14px] text-graphite-soft underline underline-offset-2 hover:text-graphite">
          Очистить корзину
        </button>
      </section>

      <section aria-labelledby="order" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--radius-card)] bg-pad p-5 md:p-7">
          <h2 id="order" className="text-[2rem]">Оформление</h2>
          <p className="mt-2 flex items-baseline justify-between text-[17px]">
            <span>{count} шт на сумму</span>
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(total)}</span>
          </p>

          <form onSubmit={send} noValidate className="mt-6 grid gap-4">
            <div>
              <label htmlFor="order-name" className="mb-1 block text-[14px]">Имя</label>
              <input
                id="order-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="given-name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : undefined}
                className="h-11 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-sage-deep aria-[invalid=true]:border-powder-deep"
              />
              {errors.name && <p id="err-name" className="mt-1 text-[13px] text-powder-deep">{errors.name}</p>}
            </div>

            <fieldset>
              <legend className="mb-2 text-[14px]">Как получить</legend>
              <div className="grid gap-2">
                {([
                  ["pickup", `Самовывоз — ${CONTACTS.address}`],
                  ["delivery", "Доставка по Алматы или Казахстану"],
                ] as const).map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 has-[:checked]:border-graphite">
                    <input type="radio" name="delivery" value={value} checked={form.delivery === value} onChange={() => update("delivery", value)} className="accent-graphite" />
                    <span className="text-[15px]">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {form.delivery === "delivery" && (
              <div>
                <label htmlFor="order-address" className="mb-1 block text-[14px]">Адрес доставки</label>
                <input
                  id="order-address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  autoComplete="street-address"
                  placeholder="Город, улица, дом, квартира"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "err-address" : undefined}
                  className="h-11 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-sage-deep aria-[invalid=true]:border-powder-deep"
                />
                {errors.address && <p id="err-address" className="mt-1 text-[13px] text-powder-deep">{errors.address}</p>}
              </div>
            )}

            <div>
              <label htmlFor="order-comment" className="mb-1 block text-[14px]">Комментарий <span className="text-graphite-soft">(необязательно)</span></label>
              <textarea
                id="order-comment"
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-sage-deep"
              />
            </div>

            <button
              type="submit"
              disabled={count === 0}
              className="flex h-13 items-center justify-center gap-2 rounded-full bg-sage-deep px-6 text-[16px] font-medium text-milk transition-colors hover:bg-graphite disabled:opacity-50"
            >
              <WhatsAppIcon className="size-5" />
              Отправить заказ в WhatsApp
            </button>
            <p className="text-[13px] text-graphite-soft" aria-live="polite">
              {sent
                ? "Чат открылся в новой вкладке. Отправьте сообщение — менеджер подтвердит наличие, оплату и доставку."
                : "Откроется WhatsApp с готовым сообщением. Менеджер подтвердит наличие, оплату и доставку."}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
