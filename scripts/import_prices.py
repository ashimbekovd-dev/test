"""Price list (.xlsx) → data/prices.csv (sku, price, old_price, source_name).

price = «Цена со скидкой», old_price = «Розничная цена» (shown struck through).
Names are normalised to the SKUs used in data/products.catalog.csv.
"""
import csv, re, sys
import openpyxl

FIXES = [("DOU-PHASE", "TWO-PHASE"), ("PURFYING", "PURIFYING"), ("BIO-RELIEF-SOOTHING", "RELIEF-SOOTHING"),
         ("BIO-CELL-EXTRA-HYDRATING", "BIO-CELL-EXTRA-COLLAGEN-HYDRATING")]
SUFFIX = {"ACTIVE-HYDRA-MOIST-WRINKLE-EYE": "-CARE-CREAM", "SUN-BLOCK-TONE-CREAM": "-SPF50-PA"}

def sku(name: str) -> str:
    s = re.sub(r"[^A-Z0-9]+", "-", re.sub(r"^PIYOL'\s*", "", name.strip()).upper()).strip("-")
    for a, b in FIXES:
        s = s.replace(a, b)
    return s + SUFFIX.get(s, "")

def money(v) -> int:
    return int(re.sub(r"\D", "", str(v)))

if __name__ == "__main__":
    src, out = sys.argv[1:]
    ws = openpyxl.load_workbook(src).worksheets[0]
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["sku", "price", "old_price", "source_name"])
        n = 0
        for r in ws.iter_rows(min_row=2, values_only=True):
            if r[1] and r[2] and r[4]:
                w.writerow([sku(r[1]), money(r[4]), money(r[2]), r[1].strip()]); n += 1
    print(n, "prices")
