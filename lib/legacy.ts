/**
 * Старые адреса сайта на Tilda (piyolbeauty.kz) → новые страницы.
 * Нужны, чтобы ссылки из Instagram, Google и закладок не вели в «страница не найдена».
 */


/** Разделы старого сайта */
export const LEGACY_PAGES: Record<string, string> = {
  "/brand": "/about",
  "/aboutus": "/about",
  "/gotovie": "/uhodovie",
  "/podarochnie": "/catalog",
  "/dorozhnie": "/catalog",
  "/bestseller": "/catalog",
  "/test": "/quiz",
  "/thankyou": "/",
  "/productheader": "/catalog",
  "/master_class": "/",
  "/box1": "/",
  "/pyaolsertificate": "/",
  "/certificatekz": "/",
  "/page46740125.html": "/",
  "/page47982245.html": "/",
};

const STOP = new Set(["piyol", "the", "and", "amp"]);
const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t));

/** Синонимы и опечатки в старых адресах */
const FIX: Record<string, string> = { purfying: "purifying", bio: "bio" };

/**
 * Адрес товара Tilda: /<раздел>/tproduct/<id>-<id>-<название>.
 * Находим наш артикул по словам из названия (Tilda обрезает длинные названия).
 */
export function matchLegacyProduct(slug: string, skus: string[]): string | undefined {
  const words = tokens(slug.replace(/^\d+-\d+-/, "")).map((t) => FIX[t] ?? t).filter((t) => !/^\d+$/.test(t));
  if (!words.length) return undefined;
  let best: { sku: string; score: number } | undefined;
  for (const sku of skus) {
    const st = tokens(sku);
    const hit = words.filter((w, i) => st.some((t) => t === w || (i === words.length - 1 && w.length >= 2 && t.startsWith(w)))).length;
    const score = hit / Math.max(words.length, st.length);
    if (!best || score > best.score) best = { sku, score };
  }
  return best && best.score >= 0.6 ? best.sku : undefined;
}

/** Если товар не нашли — поиск по каталогу по словам из старого адреса */
export function legacySearchUrl(slug: string): string {
  const q = tokens(slug.replace(/^\d+-\d+-/, "")).filter((t) => !/^\d+$/.test(t)).slice(0, 4).join(" ");
  return q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog";
}
