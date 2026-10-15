"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { ProductImage } from "../ProductImage";
import { displayName, formatPrice } from "@/lib/format";
import { ritualGaps, stepOf } from "@/lib/lines";
import type { Product } from "@/lib/products/types";

/** «Bio Cell Extra Collagen Toner» → «Toner»: название линии уже в заголовке блока. */
function shortName(name: string, lineName: string): string {
  const full = displayName(name);
  for (const prefix of [lineName, lineName.replace(/^Bio\s+/i, "")]) {
    if (full.toLowerCase().startsWith(prefix.toLowerCase() + " ")) return full.slice(prefix.length + 1);
  }
  return full;
}

/** «Дополните ритуал»: если в корзине часть линии, показываем недостающие шаги с кнопкой «+». */
export function RitualUpsell({ products }: { products: Product[] }) {
  const { items, add } = useCart();
  const gaps = ritualGaps(items.map((i) => i.sku), products);
  if (gaps.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {gaps.map(({ line, have, missing }) => {
        const sum = missing.reduce((s, p) => s + p.price, 0);
        return (
          <section key={line.slug} aria-label={`Дополнить ритуал ${line.name}`} className="rounded-[28px] bg-petal/55 p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[26px] leading-tight">Дополните ритуал {line.name}</h2>
              <span className="text-[14px] text-mute">в корзине {have} из {have + missing.length} шагов</span>
            </div>
            <p className="mt-1 text-[14px] text-ink/75">Средства одной линии усиливают друг друга, когда идут по порядку.</p>
            <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
              {missing.map((p) => (
                <li key={p.sku} className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/70 p-2 pr-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-petal/60">
                    <ProductImage src={p.images[0]} alt="" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-mute">{stepOf(p).label}</p>
                    <Link href={`/product/${encodeURIComponent(p.sku)}`} className="block truncate text-[14px] font-medium hover:text-moss">
                      {shortName(p.name, line.name)}
                    </Link>
                    <p className="text-[13px] font-semibold">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => add(p.sku)}
                    aria-label={`Добавить ${displayName(p.name)}`}
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/60 text-xl leading-none hover:bg-ink hover:text-white"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
            {missing.length > 1 && (
              <button
                type="button"
                onClick={() => missing.forEach((p) => add(p.sku))}
                className="btn mt-4 border border-ink/40 text-[14px] hover:border-ink"
              >
                Добавить все недостающие · {formatPrice(sum)}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
