/**
 * Простая разметка для описаний из таблицы — менеджер пишет обычным текстом:
 *   пустая строка — новый блок;
 *   «## Заголовок» — подзаголовок;
 *   строки «• пункт» (или «- пункт») — список;
 *   строки «1. шаг» — нумерованные шаги.
 * Всё остальное — абзац, переносы строк внутри абзаца сохраняются.
 */
export type Block =
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "p"; lines: string[] };

const BULLET = /^\s*[•\-–]\s+/;
const STEP = /^\s*\d+[.)]\s+/;

export function parseRichText(text?: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of (text ?? "").replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines[0].startsWith("## ")) {
      blocks.push({ kind: "h", text: lines[0].slice(3).trim() });
      lines.shift();
      if (!lines.length) continue;
    }
    if (lines.every((l) => BULLET.test(l))) blocks.push({ kind: "ul", items: lines.map((l) => l.replace(BULLET, "")) });
    else if (lines.every((l) => STEP.test(l))) blocks.push({ kind: "ol", items: lines.map((l) => l.replace(STEP, "")) });
    else blocks.push({ kind: "p", lines });
  }
  return blocks;
}
