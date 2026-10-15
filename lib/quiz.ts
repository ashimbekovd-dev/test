import { CONCERNS, getConcern } from "@/lib/concerns";
import { formatPrice, displayName } from "@/lib/format";
import { getLine, LINES, lineProducts, stepOf } from "@/lib/lines";
import type { Product } from "@/lib/products/types";

/** Тест «Подберите мне уход»: вопросы, подсчёт задачи кожи и программа из каталога. */

export type QuizOption = { value: string; label: string; hint?: string };
export type QuizQuestion = { id: keyof QuizAnswers; title: string; options: QuizOption[] };

export type QuizAnswers = {
  age?: "under35" | "35-42" | "42-55" | "55plus";
  concern?: "moisture" | "firmness" | "pigment" | "sensitive" | "acne";
  skin?: "dry" | "normal" | "oily" | "reactive";
  procedures?: "regular" | "sometimes" | "never";
  injections?: "yes" | "no";
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "age",
    title: "Сколько вам лет?",
    options: [
      { value: "under35", label: "До 35" },
      { value: "35-42", label: "35–42" },
      { value: "42-55", label: "42–55" },
      { value: "55plus", label: "55+" },
    ],
  },
  {
    id: "concern",
    title: "Что беспокоит больше всего?",
    options: [
      { value: "moisture", label: "Тусклость и сухость" },
      { value: "firmness", label: "Морщины, потеря упругости" },
      { value: "pigment", label: "Пигментация, неровный тон" },
      { value: "sensitive", label: "Покраснения, чувствительность" },
      { value: "acne", label: "Высыпания и расширенные поры" },
    ],
  },
  {
    id: "skin",
    title: "Какая кожа к вечеру?",
    options: [
      { value: "dry", label: "Сухая, стягивает" },
      { value: "normal", label: "Комфортная" },
      { value: "oily", label: "Блестит, особенно в Т-зоне" },
      { value: "reactive", label: "Краснеет, щиплет от новых средств" },
    ],
  },
  {
    id: "procedures",
    title: "Ходите к косметологу?",
    options: [
      { value: "regular", label: "Да, регулярно", hint: "Подберём уход, который продлит результат процедур" },
      { value: "sometimes", label: "Иногда" },
      { value: "never", label: "Нет, ухаживаю дома" },
    ],
  },
  {
    id: "injections",
    title: "Как относитесь к уколам красоты?",
    options: [
      { value: "yes", label: "Делаю или готова делать" },
      { value: "no", label: "Не хочу, ищу мягкую альтернативу" },
    ],
  },
];

export const isComplete = (a: QuizAnswers) => QUESTIONS.every((q) => a[q.id] !== undefined);

/** Баллы по задачам кожи. Главная жалоба весит больше всего, остальное уточняет. */
export function scoreConcerns(a: QuizAnswers): Record<string, number> {
  const s: Record<string, number> = Object.fromEntries(CONCERNS.map((c) => [c.slug, 0]));
  if (a.concern) s[a.concern] += 4;
  if (a.skin === "dry") s.moisture += 2;
  if (a.skin === "oily") s.acne += 2;
  if (a.skin === "reactive") s.sensitive += 2;
  if (a.age === "35-42") { s.moisture += 1; s.firmness += 1; }
  if (a.age === "42-55" || a.age === "55plus") s.firmness += 2;
  if (a.procedures === "regular") s["after-procedures"] += 3;
  if (a.procedures === "sometimes") s["after-procedures"] += 1;
  if (a.injections === "no") s.firmness += 1;
  return s;
}

/** Порядок задач по убыванию баллов; при равенстве — порядок CONCERNS. */
export function rankConcerns(a: QuizAnswers): string[] {
  const s = scoreConcerns(a);
  return CONCERNS.map((c, i) => ({ slug: c.slug, v: s[c.slug], i }))
    .filter((x) => x.v > 0)
    .sort((x, y) => y.v - x.v || x.i - y.i)
    .map((x) => x.slug);
}

export type Recommendation = {
  primary: string;
  secondary?: string;
  line?: string;
  ritual: Product[];
  boosters: Product[];
  /** «Начать с главного»: сыворотка и крем из ритуала + первый усилитель */
  starter: Product[];
  total: number;
  note: string;
};

const BOOSTER_RE = /serum|ampoule|fluid|pack|program|peeling|exfoliant|mist|sun/i;

export function recommend(a: QuizAnswers, products: Product[]): Recommendation {
  const ranked = rankConcerns(a);
  const primary = ranked[0] ?? "moisture";
  const secondary = ranked.find((c) => c !== primary);

  // Базовый ритуал — линия для главной задачи, иначе для следующей, иначе увлажняющая.
  const lineFor = (c?: string) => LINES.find((l) => l.concern === c && lineProducts(products, l.slug).length > 0);
  const line = lineFor(primary) ?? ranked.map(lineFor).find(Boolean) ?? lineFor("moisture");
  const ritual = line ? lineProducts(products, line.slug) : [];

  // Усилители — средства вне линии (ампулы, сыворотки, маски) под главную и вторую задачу.
  const taken = new Set(ritual.map((p) => p.sku));
  const score = (p: Product) =>
    (p.concerns.includes(primary) ? 3 : 0) + (secondary && p.concerns.includes(secondary) ? 1 : 0) + (p.hit ? 0.5 : 0);
  const boosters = products
    .filter((p) => !p.line && !taken.has(p.sku) && BOOSTER_RE.test(p.name) && score(p) >= 3)
    .map((p, i) => ({ p, i, s: score(p) }))
    .sort((x, y) => y.s - x.s || x.i - y.i)
    .slice(0, 2)
    .map((x) => x.p);

  // SPF — при пигментации и после процедур без него результат не держится.
  if ((primary === "pigment" || primary === "after-procedures" || secondary === "pigment") && boosters.length < 3) {
    const spf = products.find((p) => /sun|spf/i.test(p.name) && !boosters.includes(p));
    if (spf) boosters.push(spf);
  }

  const pick = (label: string) => ritual.find((p) => stepOf(p).label === label);
  const starter = [pick("Сыворотка"), pick("Крем") ?? pick("Эмульсия"), boosters[0]].filter(
    (p): p is Product => p !== undefined,
  );

  const total = [...ritual, ...boosters].reduce((s, p) => s + p.price, 0);
  return { primary, secondary, line: line?.slug, ritual, boosters, starter, total, note: noteFor(a, primary) };
}

function noteFor(a: QuizAnswers, primary: string): string {
  if (a.procedures === "regular")
    return "Домашний уход между визитами к косметологу: восстановление после процедур и поддержка результата.";
  if (a.injections === "no" && (primary === "firmness" || a.age === "42-55" || a.age === "55plus"))
    return "Мягкая альтернатива уколам: пептиды, коллаген и PDRN работают на упругость, если пользоваться курсом.";
  if (a.age === "under35" || a.age === "35-42")
    return "Хорошее время начать системный уход: увлажнение, сияние и профилактика первых морщин.";
  return "Программа на курс 6–8 недель: первые изменения обычно заметны через 3–4 недели.";
}

/** Сообщение менеджеру: ответы и подобранная программа — сразу понятно, с чем пришёл клиент. */
export function buildQuizMessage(a: QuizAnswers, r: Recommendation): string {
  const answer = (id: keyof QuizAnswers) =>
    QUESTIONS.find((q) => q.id === id)?.options.find((o) => o.value === a[id])?.label ?? "—";
  const items = [...r.ritual, ...r.boosters];
  return [
    "Здравствуйте! Прошла подбор ухода на сайте PIYOL'.",
    `Возраст: ${answer("age")}. Беспокоит: ${answer("concern")}. Кожа: ${answer("skin")}.`,
    `Косметолог: ${answer("procedures")}. Уколы: ${answer("injections")}.`,
    `Мне подобрали (${getConcern(r.primary)?.title ?? r.primary}):`,
    ...items.map((p, i) => `${i + 1}) ${displayName(p.name)} — ${formatPrice(p.price)}`),
    `Итого: ${formatPrice(r.total)}`,
    "Подскажите, пожалуйста, подходит ли мне эта программа?",
  ].join("\n");
}

export const lineName = (slug?: string) => getLine(slug)?.name;
