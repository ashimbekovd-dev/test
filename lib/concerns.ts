/** Задачи кожи — вход в каталог «с вопросом», а не по типу средства. Порядок = порядок на сайте. */
export type Concern = {
  slug: string;
  title: string;
  /** одна строка: кому и что даёт — в плитке на главной и над каталогом */
  lead: string;
};

export const CONCERNS: Concern[] = [
  {
    slug: "moisture",
    title: "Увлажнение и сияние",
    lead: "Кожа стала тусклой, сохнет и стягивает после умывания.",
  },
  {
    slug: "firmness",
    title: "Упругость и морщины",
    lead: "Хочется подтянуть овал и разгладить морщины — без уколов.",
  },
  {
    slug: "pigment",
    title: "Пигментация и тон",
    lead: "Пятна, неровный тон, следы постакне.",
  },
  {
    slug: "sensitive",
    title: "Чувствительность и покраснения",
    lead: "Кожа легко краснеет, реагирует на новые средства.",
  },
  {
    slug: "after-procedures",
    title: "Уход после процедур",
    lead: "Поддержать и продлить результат после косметолога.",
  },
  {
    slug: "acne",
    title: "Высыпания и поры",
    lead: "Воспаления, чёрные точки, жирный блеск.",
  },
];

const BY_SLUG = new Map(CONCERNS.map((c) => [c.slug, c]));
const BY_TITLE = new Map(CONCERNS.map((c) => [c.title.toLowerCase(), c.slug]));

export const getConcern = (slug?: string) => (slug ? BY_SLUG.get(slug) : undefined);

/**
 * Значение ячейки из таблицы → slug'и задач. Менеджер может писать и slug («firmness»),
 * и название («Упругость и морщины»); разделители — «|», «,» или «;». Неизвестное отбрасывается.
 */
export function parseConcerns(raw: string): string[] {
  const out: string[] = [];
  for (const part of raw.split(/[|,;\n]/)) {
    const v = part.trim().toLowerCase();
    if (!v) continue;
    const slug = BY_SLUG.has(v) ? v : BY_TITLE.get(v);
    if (slug && !out.includes(slug)) out.push(slug);
  }
  return out;
}
