import type { Product } from "@/lib/products/types";

export type CatalogSort = "default" | "price-asc" | "price-desc";
export type CatalogQuery = { category?: string; brand?: string; concern?: string; q?: string; sort?: CatalogSort };

const SORTS: CatalogSort[] = ["default", "price-asc", "price-desc"];
const norm = (s: string) => s.toLocaleLowerCase("ru").replace(/ё/g, "е").trim();

export function queryCatalog(products: Product[], query: CatalogQuery): Product[] {
  const category = query.category && norm(query.category);
  const brand = query.brand && norm(query.brand);
  const q = query.q && norm(query.q);
  const concern = query.concern && norm(query.concern);

  const filtered = products.filter(
    (p) =>
      (!category || norm(p.category) === category) &&
      (!brand || norm(p.brand) === brand) &&
      (!concern || p.concerns.includes(concern)) &&
      (!q || norm(`${p.name} ${p.nameRu ?? ""} ${p.brand}`).includes(q)),
  );

  const indexed = filtered.map((p, i) => ({ p, i }));
  const sort = query.sort ?? "default";
  indexed.sort((a, b) => {
    if (sort === "price-asc") return a.p.price - b.p.price || a.i - b.i;
    if (sort === "price-desc") return b.p.price - a.p.price || a.i - b.i;
    return Number(b.p.hit) - Number(a.p.hit) || a.i - b.i;
  });
  return indexed.map(({ p }) => p);
}

type Params = Record<string, string | string[] | undefined>;

export function parseCatalogQuery(params: Params): CatalogQuery {
  const first = (k: string) => {
    const v = params[k];
    const s = (Array.isArray(v) ? v[0] : v)?.trim();
    return s ? s : undefined;
  };
  const sort = first("sort") as CatalogSort | undefined;
  const out: CatalogQuery = { sort: sort && SORTS.includes(sort) ? sort : "default" };
  for (const k of ["category", "brand", "concern", "q"] as const) {
    const v = first(k);
    if (v) out[k] = v;
  }
  return out;
}
