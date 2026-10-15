/** Фото кейсов «до и после» от бренда. Каждый файл — уже склейка: «до» слева (или сверху), «после» справа (или снизу). */
export type Case = {
  image: string;
  width: number;
  height: number;
  /** как разделены «до» и «после» на склейке */
  split: "horizontal" | "vertical";
  title: string;
  /** задача кожи — коротко, для подписи */
  result: string;
  /** куда ведёт кейс: линия или товар */
  line?: string;
  sku?: string;
};

export const CASES: Case[] = [
  { image: "/cases/rss-brightening-1.jpg", width: 1280, height: 1280, split: "horizontal", title: "RSS Brightening Ampoule", result: "Пигментация", sku: "RSS-BRIGHTENING-AMPOULE" },
  { image: "/cases/bio-cell-extra-collagen.jpg", width: 1400, height: 1041, split: "horizontal", title: "Bio Cell Extra Collagen", result: "Морщины и упругость", line: "bio-cell-extra-collagen" },
  { image: "/cases/relief-soothing.jpg", width: 1280, height: 1198, split: "horizontal", title: "Bio Relief Soothing", result: "Покраснения", line: "relief-soothing" },
  { image: "/cases/intense-purifying-acne.jpg", width: 1400, height: 1066, split: "horizontal", title: "Intense Purifying Acne", result: "Высыпания", line: "intense-purifying-acne" },
  { image: "/cases/active-hydra-moist.jpg", width: 1400, height: 1400, split: "horizontal", title: "Active Hydra-Moist", result: "Увлажнение и сияние", line: "active-hydra-moist" },
  { image: "/cases/lifting-eye-care-program.jpg", width: 1400, height: 1400, split: "horizontal", title: "Lifting Eye Care Program", result: "Зона вокруг глаз", sku: "LIFTING-EYE-CARE-PROGRAM" },
  { image: "/cases/neck-eye-repair-serum.jpg", width: 1280, height: 1280, split: "vertical", title: "Neck & Eye Repair Serum", result: "Морщины на лбу", sku: "NECK-EYE-REPAIR-SERUM" },
  { image: "/cases/rss-brightening-2.jpg", width: 861, height: 667, split: "horizontal", title: "RSS Brightening Ampoule", result: "Ровный тон", sku: "RSS-BRIGHTENING-AMPOULE" },
];

export const caseHref = (c: Case) =>
  c.line ? `/lines/${c.line}` : c.sku ? `/product/${encodeURIComponent(c.sku)}` : "/catalog";

/** Кейсы для страницы товара: свои по артикулу, затем по линии товара. */
export function casesFor({ sku, line }: { sku?: string; line?: string }): Case[] {
  return CASES.filter((c) => (sku && c.sku === sku) || (line && c.line === line));
}
