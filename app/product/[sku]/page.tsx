import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products/source";
import { buildSingleProductMessage, waLink } from "@/lib/whatsapp";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { WhatsAppIcon } from "@/components/icons";
import { displayName } from "@/lib/format";

export const revalidate = 300;

type Props = { params: Promise<{ sku: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(decodeURIComponent((await params).sku));
  return p ? { title: displayName(p.name), description: p.description?.split("\n")[0] } : {};
}

const paragraphs = (t?: string) => (t ?? "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

export default async function ProductPage({ params }: Props) {
  const sku = decodeURIComponent((await params).sku);
  const products = await getProducts();
  const product = products.find((p) => p.sku === sku);
  if (!product) notFound();

  const similar = products.filter((p) => p.category === product.category && p.sku !== product.sku).slice(0, 4);
  const name = displayName(product.name);

  return (
    <div className="wrap pt-6 md:pt-10">
      <nav aria-label="Навигация" className="text-[13px] text-mute">
        <Link href="/catalog" className="hover:text-ink">Каталог</Link>
        <span aria-hidden> / </span>
        <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">{product.category}</Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} alt={name} />

        <div className="md:pt-8">
          <p className="text-mute">{product.brand}{product.volume ? `, ${product.volume}` : ""}</p>
          <h1 className="mt-2 text-[40px] md:text-[56px]">{name}</h1>
          {product.nameRu && <p className="mt-3 text-lg text-mute">{product.nameRu}</p>}
          <div className="mt-6"><Price price={product.price} oldPrice={product.oldPrice} size="lg" /></div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton sku={product.sku} />
            <a href={waLink(buildSingleProductMessage(product))} target="_blank" rel="noreferrer" className="btn border border-moss text-moss hover:bg-moss hover:text-white">
              <WhatsAppIcon className="size-5" /> Заказать в WhatsApp
            </a>
          </div>

          {paragraphs(product.description).length > 0 && (
            <section className="mt-10 max-w-prose">
              <h2 className="text-2xl">Описание</h2>
              {paragraphs(product.description).map((t, i) => <p key={i} className="mt-3">{t}</p>)}
            </section>
          )}
          {paragraphs(product.howToUse).length > 0 && (
            <section className="mt-8 max-w-prose">
              <h2 className="text-2xl">Как применять</h2>
              {paragraphs(product.howToUse).map((t, i) => <p key={i} className="mt-3">{t}</p>)}
            </section>
          )}
          <p className="mt-8 rounded-2xl bg-sage/60 p-4 text-[14px]">
            Самовывоз из ТРЦ Forum Almaty, 2 этаж. Доставка по Алматы и Казахстану. <Link href="/delivery" className="underline underline-offset-2">Подробнее</Link>
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="text-[36px]">Ещё из раздела «{product.category}»</h2>
          <div className="mt-6"><ProductGrid products={similar} /></div>
        </section>
      )}
    </div>
  );
}
