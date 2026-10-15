import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { LINES, lineProducts } from "@/lib/lines";
import type { Product } from "@/lib/products/types";

export function LineCards({ products }: { products: Product[] }) {
  const lines = LINES.map((l) => ({ l, steps: lineProducts(products, l.slug) })).filter((x) => x.steps.length > 0);
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {lines.map(({ l, steps }) => (
        <li key={l.slug}>
          <Link href={`/lines/${l.slug}`} className="group block">
            <div className="relative aspect-[4/5] arch bg-petal/60">
              <ProductImage src={l.photo} alt={`Линия ${l.name}`} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            </div>
            <h3 className="mt-4 text-[28px] group-hover:text-moss">{l.name}</h3>
            <p className="mt-1 text-[15px] text-ink/75">{l.tagline}</p>
            <p className="mt-2 text-[14px] text-mute">
              {steps.length} шагов · ритуал {formatPrice(steps.reduce((s, p) => s + p.price, 0))}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
