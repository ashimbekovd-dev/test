"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { useCart } from "./cart/CartProvider";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/quiz", label: "Подбор ухода" },
  { href: "/about", label: "О бренде" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const { count, ready } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-milk/90 backdrop-blur">
      <div className="wrap flex h-16 items-center gap-4">
        <button className="-ml-2 p-2 lg:hidden" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
        <Logo />
        <nav aria-label="Основное меню" className="ml-8 hidden gap-5 lg:flex xl:gap-7">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`whitespace-nowrap text-[14px] hover:text-moss ${pathname.startsWith(n.href) ? "text-moss" : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/catalog" className="ml-auto hidden items-center rounded-full border border-line bg-white/60 px-3 xl:flex" role="search">
          <SearchIcon className="size-4 text-mute" />
          <input name="q" placeholder="Найти средство" aria-label="Поиск по каталогу" className="h-10 w-52 bg-transparent px-2 text-[14px] outline-none" />
        </form>
        <Link href="/catalog#search" className="ml-auto p-2 xl:hidden" aria-label="Поиск">
          <SearchIcon className="size-6" />
        </Link>
        <Link href="/cart" className="relative -mr-2 p-2" aria-label={`Корзина${ready && count ? `, товаров: ${count}` : ""}`}>
          <BagIcon className="size-6" />
          {ready && count > 0 && (
            <span className="absolute right-0 top-0 grid min-w-5 place-items-center rounded-full bg-moss px-1 text-[11px] font-bold leading-5 text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
      {open && (
        <nav aria-label="Мобильное меню" className="border-t border-line lg:hidden">
          <ul className="wrap py-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block py-3 font-display text-2xl">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
