"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart/CartProvider";

export function AddToCartButton({ sku, compact = false }: { sku: string; compact?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => { add(sku); setAdded(true); }}
      aria-live="polite"
      className={
        compact
          ? "btn min-h-10 w-full border border-ink/80 px-3 text-[14px] hover:bg-ink hover:text-white"
          : "btn w-full bg-ink text-white hover:bg-ink/85 sm:w-auto"
      }
    >
      {added ? "Добавлено" : "В корзину"}
    </button>
  );
}
