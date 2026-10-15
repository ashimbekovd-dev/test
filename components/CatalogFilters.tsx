"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CatalogQuery } from "@/lib/catalog/query";
import { SearchIcon } from "./icons";
import { CONCERNS } from "@/lib/concerns";

function href(q: CatalogQuery, patch: Partial<CatalogQuery>) {
  const next = { ...q, ...patch };
  const sp = new URLSearchParams();
  for (const k of ["category", "brand", "concern", "q", "sort"] as const) {
    const v = next[k];
    if (v && !(k === "sort" && v === "default")) sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `/catalog?${s}` : "/catalog";
}

export function CatalogFilters({ query, categories, brands }: { query: CatalogQuery; categories: string[]; brands: string[] }) {
  const router = useRouter();
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-[14px] transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white/50 hover:border-ink/40"}`;

  return (
    <div className="space-y-4">
      <form action="/catalog" role="search" id="search" className="flex items-center rounded-full border border-line bg-white/70 pl-4 focus-within:border-ink/40">
        <SearchIcon className="size-5 text-mute" />
        {query.category && <input type="hidden" name="category" value={query.category} />}
        {query.brand && <input type="hidden" name="brand" value={query.brand} />}
        {query.concern && <input type="hidden" name="concern" value={query.concern} />}
        <input name="q" defaultValue={query.q} placeholder="Название или бренд" aria-label="Поиск по каталогу" className="h-12 min-w-0 flex-1 bg-transparent px-3 outline-none" />
        <button className="btn mr-1 min-h-10 bg-ink px-5 text-white">Найти</button>
      </form>

      <nav aria-label="Категории" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        <Link href={href(query, { category: undefined })} className={chip(!query.category)}>Все</Link>
        {categories.map((c) => (
          <Link key={c} href={href(query, { category: c })} className={chip(query.category?.toLowerCase() === c.toLowerCase())}>{c}</Link>
        ))}
      </nav>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-[14px] text-mute">
          Задача
          <select
            value={query.concern ?? ""}
            onChange={(e) => router.push(href(query, { concern: e.target.value || undefined }))}
            className="h-10 rounded-full border border-line bg-white/70 px-3 text-ink"
          >
            <option value="">Любая</option>
            {CONCERNS.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[14px] text-mute">
          Бренд
          <select
            value={query.brand ?? ""}
            onChange={(e) => router.push(href(query, { brand: e.target.value || undefined }))}
            className="h-10 rounded-full border border-line bg-white/70 px-3 text-ink"
          >
            <option value="">Все бренды</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[14px] text-mute">
          Сортировка
          <select
            value={query.sort ?? "default"}
            onChange={(e) => router.push(href(query, { sort: e.target.value as CatalogQuery["sort"] }))}
            className="h-10 rounded-full border border-line bg-white/70 px-3 text-ink"
          >
            <option value="default">Сначала хиты</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
        </label>
      </div>
    </div>
  );
}
