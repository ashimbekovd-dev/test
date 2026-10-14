import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { WhatsAppIcon } from "@/components/icons";
import { catalogHref } from "@/lib/catalog/query";
import { getProduct, getProducts } from "@/lib/products/source";
import { buildSingleProductMessage, waLink } from "@/lib/whatsapp";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ sku: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(decodeURIComponent((await params).sku));
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.nameRu ?? product.description?.slice(0, 160),
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const sku = decodeURIComponent((await params).sku);
  const products = await getProducts();
  const product = products.find((p) => p.sku === sku);
  if (!product) notFound();

  const similar = products.filter((p) => p.category === product.category && p.sku !== product.sku).slice(0, 4);
  const paragraphs = (product.description ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <div className="container-page pt-6 md:pt-10">
      <nav aria-label="Навигация" className="text-[14px] text-graphite-soft">
        <Link href="/catalog" className="hover:text-graphite">Каталог</Link>
        <span aria-hidden> / </span>
        <Link href={catalogHref({ category: product.category })} className="hover:text-graphite">{product.category}</Link>
      </nav>

      <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-14">
        <ProductGallery images={product.images} alt={product.nameRu ? `${product.name} — ${product.nameRu}` : product.name} />

        <div className="md:pt-4">
          <Link href={catalogHref({ brand: product.brand })} className="text-[14px] text-sage-deep hover:underline">
            {product.brand}
          </Link>
          <h1 className="mt-1 text-[2.3rem] md:text-[3.2rem]">{product.name}</h1>
          {product.nameRu && <p className="mt-2 text-[17px] text-graphite-soft">{product.nameRu}</p>}
          {product.volume && <p className="mt-3 text-[14px]">Объём: {product.volume}</p>}

          <div className="mt-6">
            <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
          </div>

          <div className="mt-6 grid gap-3 sm:max-w-sm">
            <AddToCartButton sku={product.sku} />
            <a
              href={waLink(buildSingleProductMessage(product))}
              target="_blank"
              rel="noopener"
              className="flex h-13 items-center justify-center gap-2 rounded-full border border-sage-deep px-8 text-[16px] text-sage-deep transition-colors hover:bg-sage-deep hover:text-milk"
            >
              <WhatsAppIcon className="size-5" />
              Заказать в WhatsApp
            </a>
          </div>
          <p className="mt-4 text-[13px] text-graphite-soft">
            Самовывоз из ТРЦ Forum Almaty или доставка по Казахстану.{" "}
            <Link href="/delivery" className="underline underline-offset-2">Условия</Link>
          </p>

          {paragraphs.length > 0 && (
            <section className="mt-10 max-w-prose">
              <h2 className="text-2xl">Описание</h2>
              <div className="prose-piyol mt-3 text-[15px] leading-relaxed">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          )}
          {product.howToUse && (
            <section className="mt-8 max-w-prose rounded-[var(--radius-card)] bg-sage/45 p-5">
              <h2 className="text-2xl">Как применять</h2>
              <p className="prose-piyol mt-2 text-[15px] leading-relaxed">{product.howToUse}</p>
            </section>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-[2rem] md:text-[2.6rem]">Ещё из раздела «{product.category}»</h2>
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  );
}
