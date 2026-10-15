import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { parseRichText } from "@/lib/richtext";

describe("parseRichText", () => {
  it("абзацы, подзаголовки, списки и шаги", () => {
    const blocks = parseRichText("Вступление.\n\n## Что даёт коже\n• Увлажняет\n• Успокаивает\n\n1. Нанесите\n2. Смойте");
    expect(blocks).toEqual([
      { kind: "p", lines: ["Вступление."] },
      { kind: "h", text: "Что даёт коже" },
      { kind: "ul", items: ["Увлажняет", "Успокаивает"] },
      { kind: "ol", items: ["Нанесите", "Смойте"] },
    ]);
  });
  it("старый текст без разметки остаётся абзацами", () => {
    expect(parseRichText("Строка один\nстрока два")).toEqual([{ kind: "p", lines: ["Строка один", "строка два"] }]);
  });
});

describe("тексты товаров", () => {
  const { data } = Papa.parse<Record<string, string>>(
    readFileSync(path.join(process.cwd(), "data/products.catalog.csv"), "utf8"),
    { header: true, skipEmptyLines: "greedy" },
  );
  it("у каждого товара есть вступление, блок «Что даёт» и шаги применения", () => {
    for (const r of data) {
      const d = parseRichText(r.description);
      expect(d[0]?.kind, r.sku).toBe("p");
      expect(d.some((b) => b.kind === "h" && /^Что даёт/.test(b.text)), r.sku).toBe(true);
      expect(parseRichText(r.how_to_use).some((b) => b.kind === "ol"), r.sku).toBe(true);
    }
  });
  it("без частых опечаток исходника", () => {
    const all = data.map((r) => r.description + r.how_to_use).join("\n");
    for (const typo of ["Низкомоллекулярн", "фибропласт", "избавится от", "похлопывющ", "Таже можно", "течении пары", "укладой"]) {
      expect(all, typo).not.toContain(typo);
    }
  });
});
