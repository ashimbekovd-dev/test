"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";

/** Кладёт в корзину все шаги ритуала по одной штуке. */
export function AddRitualButton({ skus, total }: { skus: string[]; total: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 4000);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          skus.forEach((sku) => add(sku));
          setAdded(true);
        }}
        className="btn w-full bg-ink text-white hover:bg-ink/85 sm:w-auto"
      >
        {added ? "Ритуал в корзине" : `Весь ритуал в корзину · ${total}`}
      </button>
      <p className="min-h-5 text-[13px] text-mute" aria-live="polite">
        {added && (
          <>
            Добавили {skus.length} средств.{" "}
            <Link href="/cart" className="underline underline-offset-2">Перейти в корзину</Link>
          </>
        )}
      </p>
    </div>
  );
}
