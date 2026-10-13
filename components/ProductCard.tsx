import Link from "next/link";
import type { Product } from "@/lib/products/types";
import { ProductImage } from "./ProductImage";
import { Price } from "./Price";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const href = `/product/${encodeURIComponent(product.sku)}`;
  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] arch bg-petal/60">
        <ProductImage src={product.images[0]} alt={product.nameRu ?? product.name} sizes="(min-width: 1024px) 25vw, 50vw" priority={priority} />
        {product.oldPrice && (
          <span className="absolute left-3 top-[18%] rounded-full bg-milk px-2.5 py-0.5 text-[12px] font-semibold text-rose">
            −{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[13px] text-mute">{product.brand}{product.volume ? `, ${product.volume}` : ""}</p>
        <h3 className="mt-0.5 font-sans text-[15px] font-medium leading-snug">
          <Link href={href} className="hover:text-moss">{product.nameRu ?? product.name}</Link>
        </h3>
        <div className="mt-auto pt-2">
          <Price price={product.price} oldPrice={product.oldPrice} />
          <div className="mt-3"><AddToCartButton sku={product.sku} compact /></div>
        </div>
      </div>
    </article>
  );
}
