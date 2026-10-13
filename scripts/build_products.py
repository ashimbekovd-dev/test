"""Assemble data/products.csv (the site's fallback catalog) from:
  data/products.catalog.csv  — names, categories (texts are merged at runtime)
  data/prices.csv            — price (discounted) and old_price (retail)
  data/photos.csv            — photo file per sku, volume from the package, product line
Only products that have both a price and a photo are written.
"""
import csv

cat = {r["sku"]: r for r in csv.DictReader(open("data/products.catalog.csv", encoding="utf-8"))}
prices = {r["sku"]: r for r in csv.DictReader(open("data/prices.csv", encoding="utf-8"))}
photos = {r["sku"]: r for r in csv.DictReader(open("data/photos.csv", encoding="utf-8"))}

cols = "sku,name,name_ru,brand,category,price,old_price,volume,description,how_to_use,images,hit,in_stock".split(",")
rows = []
for sku, c in cat.items():
    if sku not in prices or sku not in photos:
        continue
    p, ph = prices[sku], photos[sku]
    images = [f"/products/{sku.lower()}.jpg"] + ([f"/products/line-{ph['line']}.jpg"] if ph["line"] else [])
    rows.append({**{k: "" for k in cols}, "sku": sku, "name": c["name"], "name_ru": c["name_ru"], "brand": c["brand"],
                 "category": c["category"], "price": p["price"], "old_price": p["old_price"],
                 "volume": ph["volume"], "images": "|".join(images)})
with open("data/products.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, cols); w.writeheader(); w.writerows(rows)
print(len(rows), "products with photo and price")
