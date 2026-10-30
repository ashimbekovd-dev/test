import type { CatalogQuery } from "@/lib/catalog/query";

/**
 * Адреса разделов, которые достались от сайта на Tilda и уже ранжируются в Google и Яндексе.
 * Сохраняем их один в один: /piyol, /uhodovie… — это живые страницы каталога, а не перенаправления.
 */
export const SECTIONS: Record<string, Pick<CatalogQuery, "category" | "concern">> = {
  "/piyol": { category: "Космецевтика PIYOL'" },
  "/uhodovie": { category: "Линии ухода PIYOL'" },
  "/ochishenie": { category: "Очищение" },
  "/dopoln": { category: "Дополнительный уход" },
  "/uhodzavolosami": { category: "Уход за волосами" },
  "/uhodzatelom": { category: "Уход за телом" },
  "/dekorativnaya": { category: "Макияж" },
  "/uvlazhnenie": { concern: "moisture" },
};

const norm = (s?: string) => (s ?? "").trim().toLowerCase();

/** Раздел, которому соответствует запрос «только категория» или «только задача» (без поиска, бренда и сортировки). */
export function sectionFor(q: CatalogQuery): string | undefined {
  if (q.q || q.brand || (q.sort && q.sort !== "default")) return undefined;
  if (q.category && q.concern) return undefined;
  for (const [path, s] of Object.entries(SECTIONS)) {
    if (s.category && q.category && norm(s.category) === norm(q.category)) return path;
    if (s.concern && q.concern && s.concern === q.concern && !q.category) return path;
  }
  return undefined;
}

/** Ссылка на каталог: чистый адрес раздела, если он есть, иначе /catalog?… */
export function catalogHref(q: CatalogQuery): string {
  const section = sectionFor(q);
  if (section) return section;
  const sp = new URLSearchParams();
  for (const k of ["category", "brand", "concern", "q", "sort"] as const) {
    const v = q[k];
    if (v && !(k === "sort" && v === "default")) sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `/catalog?${s}` : "/catalog";
}

export const categoryHref = (category: string) => catalogHref({ category });
