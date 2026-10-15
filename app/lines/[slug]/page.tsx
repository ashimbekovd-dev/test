import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddRitualButton } from "@/components/AddRitualButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { WhatsAppIcon } from "@/components/icons";
import { getConcern } from "@/lib/concerns";
import { displayName, formatPrice } from "@/lib/format";
import { getLine, LINES, lineProducts, stepOf } from "@/lib/lines";
import { getProducts } from "@/lib/products/source";
import { buildRitualMessage, waLink } from "@/lib/whatsapp";
import { BeforeAfterGallery } from "@/components/BeforeAfter";
import { casesFor } from "@/lib/cases";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LINES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const line = getLine((await params).slug);
  return line ? { title: `Линия ${line.name}`, description: line.tagline } : {};
}

export default async function LinePage({ params }: Props) {
  const line = getLine((await params).slug);
  if (!line) notFound();
  const steps = lineProducts(await getProducts(), line.slug);
  if (steps.length === 0) notFound();

  const total = steps.reduce((s, p) => s + p.price, 0);
  const retail = steps.reduce((s, p) => s + (p.oldPrice ?? p.price), 0);
  const concern = getConcern(line.concern);

  return (
    <div className="wrap pt-6 md:pt-10">
      <nav aria-label="Навигация" className="text-[13px] text-mute">
        <Link href="/catalog" className="hover:text-ink">Каталог</Link>
        <span aria-hidden> / </span>
        <Link href="/#lines" className="hover:text-ink">Линии ухода</Link>
      </nav>

      <section className="mt-6 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] arch bg-petal/60">
          <ProductImage src={line.photo} alt={`Линия ${line.name}`} sizes="(min-width: 768px) 40vw, 100vw" priority />
        </div>
        <div>
          <p className="text-mute">Линия ухода PIYOL&rsquo;, {steps.length} шагов</p>
          <h1 className="mt-2 text-[48px] leading-[0.95] md:text-[76px]">{line.name}</h1>
          <p className="mt-4 max-w-md text-[18px]">{line.tagline}</p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="text-2xl font-semibold">{formatPrice(total)}</span>
            {retail > total && <s className="text-mute">{formatPrice(retail)}</s>}
            <span className="text-[14px] text-mute">за весь ритуал</span>
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
            <AddRitualButton skus={steps.map((p) => p.sku)} total={formatPrice(total)} />
            <a
              href={waLink(buildRitualMessage(line.name, steps))}
              target="_blank"
              rel="noreferrer"
              className="btn border border-moss text-moss hover:bg-moss hover:text-white"
            >
              <WhatsAppIcon className="size-5" /> Спросить про ритуал
            </a>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
        <div className="rounded-[28px] bg-petal/55 p-6 md:p-9">
          <h2 className="text-[32px]">Для кого</h2>
          <ul className="mt-4 space-y-2 text-[16px]">
            {line.forWhom.map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden className="text-rose">✦</span>{t}</li>
            ))}
          </ul>
          {concern && (
            <Link href={`/catalog?concern=${concern.slug}`} className="mt-5 inline-block text-[14px] underline underline-offset-4 hover:text-moss">
              Все средства: {concern.title.toLowerCase()}
            </Link>
          )}
        </div>
        <div className="rounded-[28px] bg-sage/70 p-6 md:p-9">
          <h2 className="text-[32px]">Что внутри</h2>
          <ul className="mt-4 space-y-2 text-[16px]">
            {line.actives.map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden className="text-moss">✦</span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {casesFor({ line: line.slug }).length > 0 && (
        <section className="mt-16 md:mt-24" aria-labelledby="line-cases">
          <h2 id="line-cases" className="text-[40px] md:text-[52px]">До и после</h2>
          <div className="mt-6"><BeforeAfterGallery cases={casesFor({ line: line.slug })} columns={2} /></div>
        </section>
      )}

      <section className="mt-16 md:mt-24" aria-labelledby="steps">
        <h2 id="steps" className="text-[40px] md:text-[52px]">Шаги ритуала</h2>
        <p className="mt-2 max-w-prose text-mute">Утром и вечером, в этом порядке. Каждое средство можно купить отдельно.</p>
        <ol className="mt-8 border-t border-line">
          {steps.map((p, i) => (
            <li key={p.sku} className="grid grid-cols-[28px_72px_1fr] items-center gap-4 border-b border-line py-5 sm:grid-cols-[56px_96px_1fr_auto] md:gap-6">
              <span className="font-display text-[40px] leading-none text-rose md:text-[52px]">{i + 1}</span>
              <Link href={`/product/${encodeURIComponent(p.sku)}`} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-petal/60">
                <ProductImage src={p.images[0]} alt="" sizes="96px" />
              </Link>
              <div className="min-w-0">
                <p className="text-[13px] text-mute">{stepOf(p).label}{p.volume ? `, ${p.volume}` : ""}</p>
                <Link href={`/product/${encodeURIComponent(p.sku)}`} className="font-medium leading-snug hover:text-moss">
                  {displayName(p.name)}
                </Link>
                {p.nameRu && <p className="text-[13px] text-mute">{p.nameRu}</p>}
                <p className="mt-1 font-semibold sm:hidden">{formatPrice(p.price)}</p>
              </div>
              <div className="col-span-2 col-start-2 flex items-center gap-4 sm:col-span-1 sm:col-start-auto sm:flex-col sm:items-end">
                <span className="hidden font-semibold sm:block">{formatPrice(p.price)}</span>
                <div className="w-40"><AddToCartButton sku={p.sku} compact /></div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="other-lines">
        <h2 id="other-lines" className="text-[32px]">Другие линии</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {LINES.filter((l) => l.slug !== line.slug).map((l) => (
            <li key={l.slug}>
              <Link href={`/lines/${l.slug}`} className="block rounded-full border border-line bg-white/50 px-4 py-2 text-[14px] hover:border-ink/40">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
