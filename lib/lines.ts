import type { Product } from "@/lib/products/types";

/** Линии ухода PIYOL' — ритуалы из нескольких шагов. Товары привязываются колонкой `line` в таблице. */
export type Line = {
  slug: string;
  name: string;
  /** короткое обещание линии */
  tagline: string;
  /** для кого — 2–3 пункта */
  forWhom: string[];
  /** ключевые компоненты, по описаниям средств */
  actives: string[];
  photo: string;
  concern: string;
};

export const LINES: Line[] = [
  {
    slug: "active-hydra-moist",
    name: "Active Hydra-Moist",
    tagline: "Глубокое увлажнение и сияние для кожи, которая стала тусклой и сухой.",
    forWhom: [
      "Кожа сохнет и стягивает, особенно после умывания",
      "Пропало сияние, лицо выглядит уставшим",
      "Хочется начать системный уход с понятных шагов",
    ],
    actives: ["7 видов гиалуроновой кислоты", "Экстракт розы Rosa Centifolia"],
    photo: "/products/line-active-hydra-moist.jpg",
    concern: "moisture",
  },
  {
    slug: "bio-cell-extra-collagen",
    name: "Bio Cell Extra Collagen",
    tagline: "Коллагеновый ритуал для упругости и против морщин.",
    forWhom: [
      "Кожа теряет упругость, поплыл овал",
      "Появились морщины, хочется результата без инъекций",
      "Нужна поддержка между процедурами у косметолога",
    ],
    actives: ["Гидролизованный коллаген 500 Да", "EGF-фактор", "7 видов гиалуроновой кислоты", "Центелла азиатская"],
    photo: "/products/line-bio-cell-extra-collagen.jpg",
    concern: "firmness",
  },
  {
    slug: "relief-soothing",
    name: "Bio Relief Soothing",
    tagline: "Успокаивающий уход для чувствительной кожи и восстановления барьера.",
    forWhom: [
      "Кожа краснеет и реагирует на новые средства",
      "Купероз, розацеа, раздражение",
      "Восстановление после процедур и пилингов",
    ],
    actives: ["Центелла азиатская", "Аптечная ромашка", "Облепиха"],
    photo: "/products/line-relief-soothing.jpg",
    concern: "sensitive",
  },
  {
    slug: "intense-purifying-acne",
    name: "Intense Purifying Acne",
    tagline: "Очищение и контроль высыпаний без пересушивания.",
    forWhom: [
      "Воспаления, чёрные точки, расширенные поры",
      "Жирный блеск к середине дня",
      "Кожа склонна к высыпаниям, но нужна мягкость",
    ],
    actives: ["Чайное дерево", "Мягкое очищение без нарушения барьера"],
    photo: "/products/line-intense-purifying-acne.jpg",
    concern: "acne",
  },
];

const BY_SLUG = new Map(LINES.map((l) => [l.slug, l]));
export const getLine = (slug?: string) => (slug ? BY_SLUG.get(slug) : undefined);

/** «Active Hydra-Moist», «active-hydra-moist» → slug известной линии или undefined. */
export function parseLine(raw: string): string | undefined {
  const v = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!v) return undefined;
  if (BY_SLUG.has(v)) return v;
  return LINES.find((l) => v.includes(l.slug) || l.slug.includes(v))?.slug;
}

/** Порядок шагов ритуала по типу средства в названии. */
const STEP_ORDER: [RegExp, number, string][] = [
  [/foam|cleans/i, 1, "Очищение"],
  [/toner/i, 2, "Тонер"],
  [/serum|ampoule/i, 3, "Сыворотка"],
  [/emulsion/i, 4, "Эмульсия"],
  [/cream/i, 5, "Крем"],
  [/patch/i, 6, "Точечно"],
];

export function stepOf(p: Product): { order: number; label: string } {
  const isEye = /eye/i.test(p.name);
  for (const [re, order, label] of STEP_ORDER) {
    if (re.test(p.name)) return isEye ? { order: 5.5, label: "Зона вокруг глаз" } : { order, label };
  }
  return { order: 9, label: "Дополнительно" };
}

export function lineProducts(products: Product[], slug: string): Product[] {
  return products
    .filter((p) => p.line === slug)
    .map((p, i) => ({ p, i, s: stepOf(p).order }))
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .map(({ p }) => p);
}
