"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { catalogHref, SORTS, type CatalogQuery, type SortKey } from "@/lib/catalog/query";

type Props = { query: CatalogQuery; brands: string[] };

/** Бренд, сортировка и поиск. Состояние живёт в URL; без JS форма работает обычным GET. */
export function CatalogFilters({ query, brands }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(query.q ?? "");

  const go = (patch: Partial<CatalogQuery>) => router.push(catalogHref({ ...query, ...patch }), { scroll: false });

  return (
    <form
      action="/catalog"
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        go({ q: q.trim() || undefined });
      }}
      className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end"
    >
      {query.category && <input type="hidden" name="category" value={query.category} />}
      <div>
        <label htmlFor="catalog-q" className="mb-1 block text-[13px] text-graphite-soft">Поиск</label>
        <input
          id="catalog-q"
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Название, бренд или «крем»"
          className="h-11 w-full rounded-full border border-line bg-white/70 px-4 outline-none placeholder:text-graphite-soft focus:border-sage-deep"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:contents">
        <div>
          <label htmlFor="catalog-brand" className="mb-1 block text-[13px] text-graphite-soft">Бренд</label>
          <select
            id="catalog-brand"
            name="brand"
            value={query.brand ?? ""}
            onChange={(e) => go({ brand: e.target.value || undefined })}
            className="h-11 w-full rounded-full border border-line bg-white/70 px-4 outline-none focus:border-sage-deep sm:w-48"
          >
            <option value="">Все бренды</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="catalog-sort" className="mb-1 block text-[13px] text-graphite-soft">Порядок</label>
          <select
            id="catalog-sort"
            name="sort"
            value={query.sort ?? "default"}
            onChange={(e) => go({ sort: e.target.value as SortKey })}
            className="h-11 w-full rounded-full border border-line bg-white/70 px-4 outline-none focus:border-sage-deep sm:w-48"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <noscript>
        <button type="submit" className="h-11 rounded-full bg-graphite px-6 text-milk">Показать</button>
      </noscript>
    </form>
  );
}
