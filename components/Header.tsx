"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const { count, ready } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/catalog?q=${encodeURIComponent(term)}` : "/catalog");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-milk/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4 md:h-20">
        <button
          type="button"
          className="-ml-2 grid size-10 place-items-center md:hidden"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>

        <Link href="/" className="font-serif text-[1.9rem] leading-none tracking-[0.02em] md:text-[2.1rem]" aria-label="PIYOL' — на главную">
          PIYOL&rsquo;
        </Link>

        <nav className="ml-10 hidden gap-7 text-[15px] md:flex" aria-label="Основное меню">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`transition-colors hover:text-powder-deep ${pathname.startsWith(n.href) ? "text-powder-deep" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <form onSubmit={submit} role="search" className={`${searchOpen ? "flex" : "hidden"} absolute inset-x-0 top-full border-b border-line bg-milk px-4 py-3 lg:static lg:flex lg:border-0 lg:bg-transparent lg:p-0`}>
            <label htmlFor="site-search" className="sr-only">Поиск по каталогу</label>
            <input
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Найти средство"
              className="h-10 w-full rounded-full border border-line bg-white/70 px-4 text-[15px] outline-none placeholder:text-graphite-soft focus:border-sage-deep lg:w-56"
            />
          </form>
          <button
            type="button"
            className="grid size-10 place-items-center lg:hidden"
            aria-label="Поиск"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon className="size-[22px]" />
          </button>
          <Link href="/cart" className="relative grid size-10 place-items-center" aria-label={`Корзина, товаров: ${ready ? count : 0}`}>
            <BagIcon className="size-[23px]" />
            {ready && count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-graphite px-1 text-[11px] font-semibold leading-[18px] text-milk">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-milk md:hidden" aria-label="Мобильное меню">
          <ul className="container-page py-4">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block py-3 font-serif text-[1.6rem]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
