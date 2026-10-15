import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProductsCsv } from "@/lib/products/parse";
import { buildQuizMessage, isComplete, rankConcerns, recommend, type QuizAnswers } from "@/lib/quiz";

const { products } = parseProductsCsv(readFileSync(path.join(process.cwd(), "data/products.csv"), "utf8"));

const base: QuizAnswers = { age: "35-42", concern: "moisture", skin: "dry", procedures: "never", injections: "yes" };

describe("quiz scoring", () => {
  it("главная жалоба определяет задачу", () => {
    expect(rankConcerns(base)[0]).toBe("moisture");
    expect(rankConcerns({ ...base, concern: "acne", skin: "oily" })[0]).toBe("acne");
  });
  it("регулярные процедуры поднимают «уход после процедур»", () => {
    expect(rankConcerns({ ...base, concern: "sensitive", skin: "normal", procedures: "regular" }).slice(0, 2)).toContain(
      "after-procedures",
    );
  });
  it("isComplete — только когда отвечены все вопросы", () => {
    expect(isComplete(base)).toBe(true);
    expect(isComplete({ ...base, injections: undefined })).toBe(false);
  });
});

describe("recommend", () => {
  it("сухая кожа 35–42 → ритуал Active Hydra-Moist", () => {
    const r = recommend(base, products);
    expect(r.line).toBe("active-hydra-moist");
    expect(r.ritual.length).toBeGreaterThanOrEqual(3);
    expect(r.starter.length).toBeGreaterThanOrEqual(2);
    expect(r.starter.length).toBeLessThanOrEqual(3);
    expect(r.total).toBe([...r.ritual, ...r.boosters].reduce((s, p) => s + p.price, 0));
  });

  it("морщины 42–55 без уколов → коллагеновая линия и усилители под упругость", () => {
    const r = recommend({ age: "42-55", concern: "firmness", skin: "normal", procedures: "never", injections: "no" }, products);
    expect(r.line).toBe("bio-cell-extra-collagen");
    expect(r.boosters.length).toBeGreaterThan(0);
    for (const p of r.boosters) expect(p.concerns).toContain("firmness");
    expect(r.note).toMatch(/альтернатива уколам/);
  });

  it("пигментация → есть SPF, усилители не повторяют ритуал", () => {
    const r = recommend({ ...base, concern: "pigment", skin: "normal" }, products);
    expect(r.boosters.some((p) => /SPF|SUN/i.test(p.name))).toBe(true);
    const ritual = new Set(r.ritual.map((p) => p.sku));
    for (const p of r.boosters) expect(ritual.has(p.sku)).toBe(false);
  });

  it("сообщение менеджеру содержит ответы, программу и итог", () => {
    const r = recommend(base, products);
    const msg = buildQuizMessage(base, r);
    expect(msg).toContain("Беспокоит: Тусклость и сухость");
    expect(msg).toContain("Кожа: Сухая, стягивает");
    expect(msg).toMatch(/Итого: \d/);
  });
});
