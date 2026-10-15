import Link from "next/link";
import { ProductImage } from "./ProductImage";
import type { Product } from "@/lib/products/types";

const plural = (n: number) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "средство";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "средства";
  return "средств";
};

/** Обложки, которые лучше всего показывают раздел; если нет — первое средство раздела. */
const COVERS: Record<string, string> = {
  "Космецевтика PIYOL'": "TWO-PHASE-GOLD-GLOSSY-AMPOULE",
  "Линии ухода PIYOL'": "/products/line-active-hydra-moist.jpg",
};

const LEADS: Record<string, string> = {
  "Космецевтика PIYOL'": "Ампулы и сыворотки с PDRN, пептидами, коллагеном и витамином C.",
  "Линии ухода PIYOL'": "Ритуалы из нескольких шагов: от очищения до крема.",
};

/** Фото не на белом фоне: показываем аккуратной рамкой, а не «вырезанным» предметом. */
const FRAMED = new Set(["Макияж"]);

type Tile = { title: string; href: string; count: number; cover?: string; lead?: string; framed?: boolean };

/**
 * Разделы каталога как «бенто»: космецевтика — большая плитка, линии — широкая, остальные — малые,
 * последней идёт «Весь каталог», чтобы сетка закрывалась без дыр.
 */
export function CategoryBento({ categories, products }: { categories: string[]; products: Product[] }) {
  const coverFor = (c: string) => {
    const key = COVERS[c];
    if (key?.startsWith("/")) return key;
    return (products.find((p) => p.sku === key) ?? products.find((p) => p.category === c))?.images[0];
  };
  const tiles: Tile[] = categories.map((c) => ({
    title: c,
    href: `/catalog?category=${encodeURIComponent(c)}`,
    count: products.filter((p) => p.category === c).length,
    cover: coverFor(c),
    lead: LEADS[c],
    framed: FRAMED.has(c),
  }));
  const big = tiles.find((t) => t.title === "Космецевтика PIYOL'");
  const wide = tiles.find((t) => t.title === "Линии ухода PIYOL'");
  const small = tiles.filter((t) => t !== big && t !== wide);
  small.push({ title: "Весь каталог", href: "/catalog", count: products.length });

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {big && (
        <li className="col-span-2 md:row-span-2">
          <BigTile tile={big} tone="bg-petal/70" />
        </li>
      )}
      {wide && (
        <li className="col-span-2">
          <WideTile tile={wide} />
        </li>
      )}
      {small.map((t, i) => (
        <li key={t.title}>
          <SmallTile tile={t} tone={t.href === "/catalog" ? "bg-ink text-milk" : i % 2 ? "bg-petal/55" : "bg-sage/70"} />
        </li>
      ))}
    </ul>
  );
}

function Count({ n, light }: { n: number; light?: boolean }) {
  return <span className={`text-[13px] ${light ? "text-milk/70" : "text-mute"}`}>{n} {plural(n)}</span>;
}

function BigTile({ tile, tone }: { tile: Tile; tone: string }) {
  return (
    <Link href={tile.href} className={`group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[32px] p-6 md:p-8 ${tone}`}>
      <span className="relative z-10 max-w-[16ch] font-display text-[34px] leading-[1.02] md:text-[44px]">{tile.title}</span>
      {tile.lead && <span className="relative z-10 mt-3 max-w-[30ch] text-[15px] text-ink/75">{tile.lead}</span>}
      <span className="relative z-10 mt-auto flex items-center gap-3 pt-4">
        <Count n={tile.count} />
        <span className="text-[14px] underline-offset-4 group-hover:underline">Смотреть</span>
      </span>
      {tile.cover && (
        <span className="absolute -bottom-4 right-0 h-[72%] w-[62%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
          <ProductImage src={tile.cover} alt="" sizes="(min-width: 768px) 30vw, 60vw" className="object-contain object-bottom mix-blend-multiply" />
        </span>
      )}
    </Link>
  );
}

function WideTile({ tile }: { tile: Tile }) {
  return (
    <Link href={tile.href} className="group relative flex h-full min-h-[200px] overflow-hidden rounded-[32px] bg-sage/70 p-6 md:p-7">
      <span className="relative z-10 flex max-w-[55%] flex-col">
        <span className="font-display text-[30px] leading-[1.02] md:text-[36px]">{tile.title}</span>
        {tile.lead && <span className="mt-2 text-[14px] text-ink/75">{tile.lead}</span>}
        <span className="mt-auto pt-4"><Count n={tile.count} /></span>
      </span>
      {tile.cover && (
        <span className="absolute inset-y-3 right-2 w-[48%] transition-transform duration-500 group-hover:scale-[1.03]">
          <ProductImage src={tile.cover} alt="" sizes="(min-width: 768px) 22vw, 45vw" className="object-contain mix-blend-multiply" />
        </span>
      )}
    </Link>
  );
}

function SmallTile({ tile, tone }: { tile: Tile; tone: string }) {
  const dark = tone.includes("bg-ink");
  return (
    <Link href={tile.href} className={`group relative flex aspect-square flex-col overflow-hidden rounded-[28px] p-4 md:p-5 ${tone}`}>
      <span className="relative z-10 font-display text-[22px] leading-[1.05] md:text-[26px]">{tile.title}</span>
      <span className="relative z-10 mt-1"><Count n={tile.count} light={dark} /></span>
      {tile.cover && tile.framed && (
        <span className="absolute bottom-4 right-4 h-[50%] w-[52%] overflow-hidden rounded-2xl transition-transform duration-500 group-hover:-translate-y-1">
          <ProductImage src={tile.cover} alt="" sizes="(min-width: 768px) 12vw, 25vw" className="object-cover" />
        </span>
      )}
      {tile.cover && !tile.framed && (
        <span className="absolute -bottom-2 -right-2 h-[62%] w-[70%] transition-transform duration-500 group-hover:-translate-y-1">
          <ProductImage src={tile.cover} alt="" sizes="(min-width: 768px) 15vw, 35vw" className="object-contain object-bottom mix-blend-multiply" />
        </span>
      )}
      {dark && <span className="relative z-10 mt-auto text-[14px] underline underline-offset-4">Открыть</span>}
    </Link>
  );
}
