import type { Metadata } from "next";
import { getProducts } from "@/lib/products/source";
import { CartView } from "@/components/cart/CartView";

export const revalidate = 300;
export const metadata: Metadata = { title: "Корзина" };

export default async function CartPage() {
  return (
    <div className="wrap pt-8 md:pt-12">
      <h1 className="text-[44px] md:text-[64px]">Корзина</h1>
      <CartView products={await getProducts()} />
    </div>
  );
}
