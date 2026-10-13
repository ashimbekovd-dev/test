"""Convert PIYOL' product description files (.txt) into data/products.catalog.csv.

Prices, volumes and photos are not in the source files; those columns stay empty
for the manager to fill in. Rows without price/images are skipped by the site parser.
"""
import csv, re, sys

SITE_CATEGORY = {
    "bazovye": "Линии ухода PIYOL'",
    "kosmecevtika": "Космецевтика PIYOL'",
}
DOP_OVERRIDES = [  # (regex on product name, site category)
    (r"CLEANSING|PAD", "Очищение"),
    (r"HAND CREAM", "Уход за телом"),
    (r"HAIR OIL", "Уход за волосами"),
    (r"BB GLOW", "Макияж"),
]

TYPO_FIXES = [("Усповаива", "Успокаива"), (" лля ", " для "), ("Cыворот", "Сыворот")]  # source-file typos


def fix_typos(s: str) -> str:
    for a, b in TYPO_FIXES:
        s = s.replace(a, b)
    return s


def title(name: str) -> str:
    name = re.sub(r"^PIYOL'\s*", "", name).strip()
    name = re.sub(r"\s*\(.*\)$", "", name)  # drop "(набор: ...)"
    words = []
    for w in name.split():
        if re.fullmatch(r"[A-Z0-9&-]+", w) and w not in {"BB", "SPF50,", "PA++++", "AHA,", "BHA", "PHA", "RSS", "EXO", "T1", "SOS", "II"}:
            w = "-".join(p.capitalize() for p in w.split("-"))
        words.append(w)
    return "PIYOL' " + " ".join(words)

def slug(name: str) -> str:
    s = re.sub(r"^PIYOL'\s*", "", name).upper()
    s = re.sub(r"\(.*\)", "", s)
    return re.sub(r"[^A-Z0-9]+", "-", s).strip("-")

def section(block: str, head: str, stop: list[str]) -> str:
    m = re.search(rf"^{re.escape(head)}:?\s*\n(.*?)(?=^(?:{'|'.join(map(re.escape, stop))}):?\s*$|\Z)", block, re.S | re.M)
    return re.sub(r"\n{3,}", "\n\n", m.group(1)).strip() if m else ""

def parse(path: str, kind: str):
    text = open(path, encoding="utf-8").read()
    for block in text.split("=" * 60)[1:]:
        m = re.search(r"^ТОВАР:\s*(.+)$", block, re.M)
        if not m:
            continue
        raw = m.group(1).strip()
        typ = (re.search(r"^Категория:\s*(.+)$", block, re.M) or [None, ""])[1].strip()
        line = (re.search(r"^Базовая линия:\s*(.+)$", block, re.M) or [None, ""])[1].strip()
        stops = ["Описание", "Способ применения", "Состав и активные компоненты", "Основной состав", "СОСТАВ", "Состав"]
        desc = section(block, "Описание", stops[1:])
        how = section(block, "Способ применения", ["Состав и активные компоненты", "СОСТАВ", "Состав"])
        how = re.sub(r"^Инструкция по применению:\s*", "", how).strip()
        if kind == "bazovye":
            cat = SITE_CATEGORY[kind]
        elif kind == "kosmecevtika":
            cat = SITE_CATEGORY[kind]
        else:
            cat = next((c for rx, c in DOP_OVERRIDES if re.search(rx, raw.upper())), "Дополнительный уход")
        if line:
            desc = f"Линия {line}.\n\n{desc}"
        yield {
            "sku": slug(raw), "name": title(raw), "name_ru": fix_typos(typ[:1].upper() + typ[1:]) if typ else "",
            "brand": "PIYOL'", "category": cat, "price": "", "old_price": "", "volume": "",
            "description": fix_typos(desc), "how_to_use": fix_typos(how), "images": "", "hit": "", "in_stock": "",
        }

if __name__ == "__main__":
    out, *pairs = sys.argv[1:]
    rows = [r for p in pairs for r in parse(*p.split("=", 1)[::-1])]
    cols = "sku,name,name_ru,brand,category,price,old_price,volume,description,how_to_use,images,hit,in_stock".split(",")
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, cols); w.writeheader(); w.writerows(rows)
    print(len(rows), "rows")
