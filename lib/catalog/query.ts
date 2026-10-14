import type { Product } from "@/lib/products/types";

export const CATEGORY_ORDER = [
  "Очищение",
  "Увлажнение",
  "Дополнительный уход",
  "Космецевтика PIYOL'",
  "Линии ухода PIYOL'",
  "Готовые наборы",
  "Уход за волосами",
  "Макияж",
  "Уход за телом",
  "Миниатюры",
  "Подарочные наборы",
];

export type SortKey = "default" | "price-asc" | "price-desc";
export const SORTS: { value: SortKey; label: string }[] = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
];

export type CatalogQuery = { category?: string; brand?: string; q?: string; sort?: SortKey };

export const normalize = (s: string) => s.toLocaleLowerCase("ru").replace(/ё/g, "е").trim();

export function queryCatalog(products: Product[], query: CatalogQuery): Product[] {
  const category = query.category ? normalize(query.category) : undefined;
  const brand = query.brand ? normalize(query.brand) : undefined;
  const terms = query.q ? normalize(query.q).split(/\s+/).filter(Boolean) : [];

  const filtered = products
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => {
      if (category && normalize(p.category) !== category) return false;
      if (brand && normalize(p.brand) !== brand) return false;
      if (terms.length) {
        const hay = normalize([p.name, p.nameRu ?? "", p.brand].join(" "));
        if (!terms.every((t) => hay.includes(t))) return false;
      }
      return true;
    });

  const sort = query.sort ?? "default";
  filtered.sort((a, b) => {
    if (sort === "price-asc") return a.p.price - b.p.price || a.index - b.index;
    if (sort === "price-desc") return b.p.price - a.p.price || a.index - b.index;
    return Number(b.p.hit) - Number(a.p.hit) || a.index - b.index;
  });
  return filtered.map(({ p }) => p);
}

export function parseCatalogQuery(params: Record<string, string | string[] | undefined>): CatalogQuery {
  const pick = (key: string) => {
    const v = params[key];
    const s = (Array.isArray(v) ? v[0] : v)?.trim();
    return s ? s : undefined;
  };
  const sortRaw = pick("sort");
  const sort: SortKey = SORTS.some((s) => s.value === sortRaw) ? (sortRaw as SortKey) : "default";
  const out: CatalogQuery = {};
  const category = pick("category");
  const brand = pick("brand");
  const q = pick("q");
  if (category) out.category = category;
  if (brand) out.brand = brand;
  if (q) out.q = q;
  out.sort = sort;
  return out;
}

export function getCategories(products: Product[]): string[] {
  const present = new Set(products.map((p) => p.category));
  const known = CATEGORY_ORDER.filter((c) => present.has(c));
  const extra = [...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, "ru"));
  return [...known, ...extra];
}

export function getBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );
}

export function catalogHref(query: CatalogQuery): string {
  const sp = new URLSearchParams();
  if (query.category) sp.set("category", query.category);
  if (query.brand) sp.set("brand", query.brand);
  if (query.q) sp.set("q", query.q);
  if (query.sort && query.sort !== "default") sp.set("sort", query.sort);
  const s = sp.toString();
  return s ? `/catalog?${s}` : "/catalog";
}
