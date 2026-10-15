import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products/source";
import { buildSingleProductMessage, waLink } from "@/lib/whatsapp";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { TrustStrip } from "@/components/TrustStrip";
import { RichText } from "@/components/RichText";
import { BeforeAfterGallery } from "@/components/BeforeAfter";
import { casesFor } from "@/lib/cases";
import { KaspiReviews } from "@/components/KaspiReviews";
import { reviewsFor, shotsFor } from "@/lib/reviews";
import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductGrid";
import { WhatsAppIcon } from "@/components/icons";
import { displayName } from "@/lib/format";
import { getConcern } from "@/lib/concerns";
import { getLine, lineProducts, stepOf } from "@/lib/lines";

export const revalidate = 300;

type Props = { params: Promise<{ sku: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ sku: p.sku }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(decodeURIComponent((await params).sku));
  if (!p) return {};
  const description = p.nameRu ?? p.description?.split("\n")[0];
  return {
    title: displayName(p.name),
    description,
    openGraph: { title: `${displayName(p.name)} — PIYOL'`, description, images: [{ url: p.images[0] }] },
  };
}

const paragraphs = (t?: string) => (t ?? "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

export default async function ProductPage({ params }: Props) {
  const sku = decodeURIComponent((await params).sku);
  const products = await getProducts();
  const product = products.find((p) => p.sku === sku);
  if (!product) notFound();

  const line = getLine(product.line);
  const ritual = line ? lineProducts(products, line.slug) : [];
  const similar = line
    ? ritual.filter((p) => p.sku !== product.sku)
    : products.filter((p) => p.category === product.category && p.sku !== product.sku).slice(0, 4);
  const cases = casesFor({ sku: product.sku, line: product.line });
  const reviews = reviewsFor(product.line);
  const concerns = product.concerns.map(getConcern).filter((c) => c !== undefined);
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
          {concerns.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Для каких задач">
              {concerns.map((c) => (
                <li key={c.slug}>
                  <Link href={`/catalog?concern=${c.slug}`} className="block rounded-full bg-sage/70 px-3 py-1 text-[13px] hover:bg-sage">{c.title}</Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6"><Price price={product.price} oldPrice={product.oldPrice} size="lg" /></div>

          <div id="buy-actions" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton sku={product.sku} />
            <a href={waLink(buildSingleProductMessage(product))} target="_blank" rel="noreferrer" className="btn border border-moss text-moss hover:bg-moss hover:text-white">
              <WhatsAppIcon className="size-5" /> Заказать в WhatsApp
            </a>
          </div>

          {line && (
            <Link href={`/lines/${line.slug}`} className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-petal/55 p-4 hover:bg-petal">
              <span>
                <span className="block text-[13px] text-mute">Шаг {ritual.findIndex((p) => p.sku === product.sku) + 1} из {ritual.length}: {stepOf(product).label.toLowerCase()}</span>
                <span className="font-medium">Ритуал {line.name}</span>
              </span>
              <span className="shrink-0 text-[14px] underline underline-offset-4">Весь ритуал</span>
            </Link>
          )}

          {paragraphs(product.description).length > 0 && (
            <section className="mt-10 max-w-prose">
              <h2 className="text-2xl">Описание</h2>
              <RichText text={product.description} className="mt-3" />
            </section>
          )}
          {paragraphs(product.howToUse).length > 0 && (
            <section className="mt-8 max-w-prose">
              <h2 className="text-2xl">Как применять</h2>
              <RichText text={product.howToUse} className="mt-3" />
            </section>
          )}
          <div className="mt-8"><TrustStrip compact /></div>
          <p className="mt-8 rounded-2xl bg-sage/60 p-4 text-[14px]">
            Самовывоз из магазина в Алматы. Доставка по Алматы и Казахстану. <Link href="/delivery" className="underline underline-offset-2">Подробнее</Link>
          </p>
        </div>
      </div>

      {cases.length > 0 && (
        <section className="mt-20" aria-labelledby="product-cases">
          <h2 id="product-cases" className="text-[36px]">Результаты клиенток</h2>
          <div className="mt-6"><BeforeAfterGallery cases={cases} columns={2} /></div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mt-20" aria-labelledby="product-reviews">
          <h2 id="product-reviews" className="text-[36px]">Отзывы о ритуале {line?.name}</h2>
          <div className="mt-6"><KaspiReviews reviews={reviews} shots={shotsFor(product.line)} /></div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="text-[36px]">{line ? `Другие шаги ритуала ${line.name}` : `Ещё из раздела «${product.category}»`}</h2>
          <div className="mt-6"><ProductGrid products={similar} /></div>
        </section>
      )}
      <StickyBuyBar sku={product.sku} name={name} price={product.price} waHref={waLink(buildSingleProductMessage(product))} />
    </div>
  );
}
