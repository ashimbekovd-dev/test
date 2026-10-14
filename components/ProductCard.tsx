import Link from "next/link";
import { Price } from "@/components/Price";
import { ProductImage } from "@/components/ProductImage";
import type { Product } from "@/lib/products/types";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <div className="overflow-hidden rounded-[var(--radius-card)]">
        <ProductImage
          src={product.images[0]}
          alt={product.nameRu ? `${product.name} — ${product.nameRu}` : product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      {product.hit && (
        <span className="absolute left-2.5 top-2.5 rounded-full bg-milk/90 px-2.5 py-0.5 text-[12px] font-medium text-sage-deep">
          Хит
        </span>
      )}
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[13px] text-sage-deep">{product.brand}</p>
        <h3 className="mt-0.5 font-sans text-[15px] font-medium leading-snug tracking-normal">
          <Link href={`/product/${product.sku}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        {product.nameRu && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-graphite-soft">{product.nameRu}</p>
        )}
        <div className="mt-auto pt-2">
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>
      </div>
    </article>
  );
}
