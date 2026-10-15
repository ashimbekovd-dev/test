"use client";

import { useEffect, useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { WhatsAppIcon } from "./icons";
import { formatPrice } from "@/lib/format";

/**
 * Панель покупки внизу экрана на телефоне. Появляется, когда основные кнопки товара
 * (#buy-actions) ушли за край экрана, — купить можно из любого места длинного описания.
 */
export function StickyBuyBar({ sku, name, price, waHref }: { sku: string; name: string; price: number; waHref: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("buy-actions");
    if (!target) return;
    let raf = 0;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVisible(target.getBoundingClientRect().bottom < 0));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      className={`buy-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-milk/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-mute">{name}</p>
          <p className="font-semibold">{formatPrice(price)}</p>
        </div>
        <a href={waHref} target="_blank" rel="noreferrer" aria-label="Заказать в WhatsApp" className="grid size-11 shrink-0 place-items-center rounded-full border border-moss text-moss">
          <WhatsAppIcon className="size-5" />
        </a>
        <div className="w-36 shrink-0"><AddToCartButton sku={sku} /></div>
      </div>
    </div>
  );
}
