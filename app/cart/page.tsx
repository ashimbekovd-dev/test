import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { getProducts } from "@/lib/products/source";

export const revalidate = 300;
export const metadata: Metadata = { title: "Корзина" };

export default async function CartPage() {
  const products = await getProducts();
  // клиенту нужны только поля для корзины — описания не отправляем
  const slim = products.map((p) => ({ ...p, description: undefined, howToUse: undefined, images: p.images.slice(0, 1) }));
  return (
    <div className="container-page pt-8 md:pt-14">
      <h1 className="text-[2.6rem] md:text-[4rem]">Корзина</h1>
      <CartView products={slim} />
    </div>
  );
}
