#!/usr/bin/env node
// Импорт товаров со старого сайта piyolbeauty.kz (Tilda Store) в data/products.csv.
// Запуск: node scripts/import-tilda.mjs [путь-к-csv]
// Нужен доступ в интернет (запускается в GitHub Actions: .github/workflows/import-tilda.yml).

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = process.argv[2] ?? "data/products.csv";
const API = "https://store.tildaapi.pro/api/getproductslist/";

// раздел старого сайта → storepart, recid, категория нового сайта
const PARTS = [
  ["piyol", "872576410941", "527862168", "Космецевтика PIYOL'"],
  ["uhodovie", "223127937951", "527865594", "Линии ухода PIYOL'"],
  ["ochishenie", "635185435521", "528478683", "Очищение"],
  ["uvlazhnenie", "675962910291", "527867343", "Увлажнение"],
  ["dopoln", "288720351701", "527867420", "Дополнительный уход"],
  ["gotovie", "822215803551", "527867514", "Готовые наборы"],
  ["uhodzavolosami", "724102554921", "527867589", "Уход за волосами"],
  ["dekorativnaya", "665961823411", "527867655", "Макияж"],
  ["uhodzatelom", "488846361821", "527867779", "Уход за телом"],
  ["dorozhnie", "117518460661", "527868006", "Миниатюры"],
  ["podarochnie", "869578196281", "527867826", "Подарочные наборы"],
];

const BRANDS = { "PIYOL'": "PIYOL'", BEAUSTA: "Beausta", LEBELAGE: "Lebelage" };

const ENTITIES = {
  nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", laquo: "«", raquo: "»",
  mdash: "—", ndash: "–", hellip: "…", trade: "™", reg: "®", copy: "©", deg: "°",
  bull: "•", middot: "·", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", times: "×",
};

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** HTML-описание → текст с абзацами (как textContent в браузере, <br> → перенос). */
function htmlToText(html) {
  const t = decodeEntities(
    (html ?? "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  );
  return t
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Однострочный текст: <br> → пробел. */
function oneLine(html) {
  return decodeEntities((html ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, ""))
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPart(storepart, recid) {
  const out = [];
  let slice = 1;
  for (let guard = 0; guard < 50; guard++) {
    const url = `${API}?storepartuid=${storepart}&recid=${recid}&c=${Date.now()}&getparts=false&getoptions=true&slice=${slice}&size=100`;
    const res = await fetch(url, { headers: { Referer: "https://piyolbeauty.kz/" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const j = await res.json();
    const items = j.products ?? [];
    out.push(...items);
    if (!j.nextslice || items.length === 0) break;
    slice = j.nextslice;
  }
  return out;
}

const VOLUME_UNITS = { ml: "мл", "мл": "мл", g: "г", "г": "г", "гр": "г", ea: "шт" };

function toRow(p, category) {
  const title = oneLine(p.title);
  const first = title.split(" ")[0];
  const brand = BRANDS[first] ?? (oneLine(p.brand) || first);
  const name = title.slice(first.length).trim();

  const descr = oneLine(p.descr);
  let ru = "";
  if (descr.includes("/")) ru = descr.split("/").slice(1).join("/").trim();
  else if (/[а-яё]/i.test(descr)) ru = descr.replace(/[A-Z][A-Z .&'-]{6,}.*$/, "").trim();
  ru = ru
    .replace(/^Beausta\s+/i, "")
    .replace(/\(?\d+\s?(ml|мл|g|г)\)?/gi, "")
    .replace(/\s+Dr\.$/, "")
    .replace(/\s+/g, " ")
    .trim();
  ru = ru.charAt(0).toUpperCase() + ru.slice(1);

  let text = htmlToText(p.text);
  let how = "";
  const m = text.match(/(?:^|\n|\.\s)\s*(Инструкция по применению|Способ применения|Применение|Как использовать)\s*:\s*([\s\S]*)/i);
  if (m) {
    how = m[2].trim();
    text = text.slice(0, m.index + (m[0].startsWith(".") ? 1 : 0)).trim();
  }

  const vol = `${descr} ${title}`.match(/(\d+(?:[.,]\d+)?)\s?(ml|мл|g|гр|г|EA)(?![a-zа-яё])/i);
  const volume = vol ? `${vol[1]} ${VOLUME_UNITS[vol[2].toLowerCase()]}` : "";

  let gallery = [];
  try {
    gallery = JSON.parse(p.gallery || "[]").map((g) => g.img).filter(Boolean);
  } catch {
    gallery = [];
  }

  const sku = (String(p.url ?? "").split("/").pop() ?? "").replace(/^\d+-\d+-/, "") || String(p.uid);
  const price = Math.round(Number(p.price));
  const old = Math.round(Number(p.priceold));

  return {
    sku,
    name,
    name_ru: ru,
    brand,
    category,
    price,
    old_price: old > price ? old : "",
    volume,
    description: text,
    how_to_use: how,
    images: gallery.join("|"),
    hit: p.mark === "Хит продаж" ? "да" : "",
    in_stock: "",
  };
}

const COLS = ["sku", "name", "name_ru", "brand", "category", "price", "old_price", "volume", "description", "how_to_use", "images", "hit", "in_stock"];
const q = (v) => {
  const s = String(v ?? "");
  return /[",\n|]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const seen = new Set();
const rows = [];
const report = [];
for (const [slug, storepart, recid, category] of PARTS) {
  const items = await fetchPart(storepart, recid);
  let added = 0;
  for (const p of items) {
    if (seen.has(p.uid)) continue; // товар может лежать в нескольких разделах — берём первый
    seen.add(p.uid);
    const row = toRow(p, category);
    if (!row.price || !row.images) {
      report.push(`пропущен (нет цены или фото): ${row.name || p.uid}`);
      continue;
    }
    rows.push(row);
    added++;
  }
  report.push(`${slug}: ${items.length} в разделе, добавлено ${added}`);
}

const csv = [COLS.join(","), ...rows.map((r) => COLS.map((c) => q(r[c])).join(","))].join("\n") + "\n";
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, csv);
console.log(report.join("\n"));
console.log(`Итого товаров: ${rows.length} → ${OUT}`);
