import type { Product } from "@/lib/products/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, eager = 0 }: { products: Product[]; eager?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p, i) => (
        <li key={p.sku} className="flex"><ProductCard product={p} priority={i < eager} /></li>
      ))}
    </ul>
  );
}
