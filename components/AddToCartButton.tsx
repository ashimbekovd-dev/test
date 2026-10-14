"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { MAX_QTY } from "@/lib/cart/cart";

export function AddToCartButton({ sku }: { sku: string }) {
  const { items, add } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.sku === sku)?.qty ?? 0;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={inCart >= MAX_QTY}
        onClick={() => {
          add(sku);
          setAdded(true);
        }}
        className="h-13 rounded-full bg-graphite px-8 text-[16px] font-medium text-milk transition-colors hover:bg-black disabled:opacity-50"
      >
        {added ? "Добавлено в корзину" : "В корзину"}
      </button>
      <p className="min-h-5 text-center text-[13px] text-graphite-soft" aria-live="polite">
        {inCart > 0 && (
          <>
            В корзине: {inCart} шт ·{" "}
            <Link href="/cart" className="underline underline-offset-2">
              оформить
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
