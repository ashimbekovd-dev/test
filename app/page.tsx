import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { catalogHref, getCategories } from "@/lib/catalog/query";
import { CONTACTS, SLOGAN } from "@/lib/config";
import { getProducts } from "@/lib/products/source";

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const categories = getCategories(products);
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

  const hits = products.filter((p) => p.hit).slice(0, 8);
  const sale = products.filter((p) => p.oldPrice).slice(0, 8);
  const heroProduct =
    products.find((p) => p.brand === "PIYOL'" && p.category === "Космецевтика PIYOL'") ?? products[0];
  const ownLine = products.filter((p) => p.brand === "PIYOL'").slice(0, 8);

  return (
    <>
      <section className="container-page grid items-center gap-10 pb-16 pt-10 md:grid-cols-[1.15fr_1fr] md:gap-16 md:pb-24 md:pt-16">
        <div className="hero-rise">
          <h1 className="text-[3.3rem] leading-[0.98] sm:text-[4.6rem] lg:text-[5.6rem]">{SLOGAN}</h1>
          <p className="mt-6 max-w-[34ch] text-[17px] text-graphite-soft md:text-lg">
            Корейская космецевтика PIYOL&rsquo; и проверенные бренды для домашнего ухода. Подберём средства под вашу кожу
            в ТРЦ Forum или в WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog" className="rounded-full bg-graphite px-7 py-3.5 text-milk transition-colors hover:bg-black">
              Смотреть каталог
            </Link>
            <Link
              href={catalogHref({ category: "Космецевтика PIYOL'" })}
              className="rounded-full border border-graphite px-7 py-3.5 transition-colors hover:bg-graphite hover:text-milk"
            >
              Космецевтика PIYOL&rsquo;
            </Link>
          </div>
        </div>

        {heroProduct && (
          <Link
            href={`/product/${heroProduct.sku}`}
            className="group relative mx-auto block w-full max-w-[420px] md:mr-0 md:max-w-[440px]"
            aria-label={`${heroProduct.name} — открыть товар`}
          >
            <div className="arch bg-powder p-3 sm:p-4">
              <div className="arch">
                <ProductImage
                  src={heroProduct.images[0]}
                  alt={heroProduct.nameRu ?? heroProduct.name}
                  sizes="(min-width: 768px) 45vw, 90vw"
                  priority
                  className="transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
            <p className="mt-4 text-center text-[14px] text-graphite-soft">
              {heroProduct.name}
              {heroProduct.nameRu ? `. ${heroProduct.nameRu}` : ""}
            </p>
          </Link>
        )}
      </section>

      <section className="container-page" aria-labelledby="cats">
        <h2 id="cats" className="text-[2.2rem] md:text-[3rem]">Что ищете</h2>
        <ul className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
          {categories.map((c) => (
            <li key={c} className="border-b border-line">
              <Link
                href={catalogHref({ category: c })}
                className="group flex items-baseline justify-between gap-4 py-4 md:py-5"
              >
                <span className="font-serif text-[1.65rem] leading-tight transition-colors group-hover:text-powder-deep md:text-[2rem]">
                  {c}
                </span>
                <span className="shrink-0 text-[14px] tabular-nums text-graphite-soft">{counts.get(c)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {hits.length > 0 && (
        <section className="container-page mt-20 md:mt-28" aria-labelledby="hits">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="hits" className="text-[2.2rem] md:text-[3rem]">Хиты продаж</h2>
            <Link href="/catalog" className="shrink-0 text-[15px] underline underline-offset-4">Весь каталог</Link>
          </div>
          <ProductGrid products={hits} />
        </section>
      )}

      {sale.length > 0 && (
        <section className="container-page mt-20 md:mt-28" aria-labelledby="sale">
          <h2 id="sale" className="mb-8 text-[2.2rem] md:text-[3rem]">Скидки</h2>
          <ProductGrid products={sale} />
        </section>
      )}

      <section className="mt-20 bg-sage/50 py-16 md:mt-28 md:py-24" aria-labelledby="brand">
        <div className="container-page grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 id="brand" className="text-[2.4rem] md:text-[3.4rem]">Стать своим косметологом</h2>
          </div>
          <div className="max-w-prose text-[16px] md:text-[17px]">
            <p>
              PIYOL&rsquo; появился в 2022 году. Это собственная космецевтика, которую производят на заводах Южной Кореи:
              ампулы с PDRN и пептидами, многослойная гиалуроновая кислота, линии для чувствительной и проблемной кожи.
            </p>
            <p className="mt-4">
              За брендом — почти тридцать лет знакомства с корейским уходом и работа с клиниками Сеула. Наша задача —
              чтобы процедурный результат был доступен дома, а уход хотелось продолжать.
            </p>
            <Link href="/about" className="mt-6 inline-block underline underline-offset-4">О бренде</Link>
          </div>
        </div>
      </section>

      {ownLine.length > 0 && hits.length < 4 && (
        <section className="container-page mt-20" aria-labelledby="own">
          <h2 id="own" className="mb-8 text-[2.2rem] md:text-[3rem]">Космецевтика PIYOL&rsquo;</h2>
          <ProductGrid products={ownLine} />
        </section>
      )}

      <section className="container-page mt-20 md:mt-28" aria-labelledby="store">
        <div className="grid gap-8 rounded-[var(--radius-card)] bg-powder/60 p-6 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <h2 id="store" className="text-[2.2rem] md:text-[3rem]">Приходите в магазин</h2>
            <p className="mt-4 max-w-prose text-[16px]">
              Можно рассмотреть баночки, нанести пробник и обсудить уход с консультантом. Заказ с сайта тоже можно
              забрать здесь.
            </p>
          </div>
          <div className="text-[16px]">
            <p className="font-medium">{CONTACTS.address}</p>
            <p>{CONTACTS.city}</p>
            <p className="mt-2">{CONTACTS.hours}</p>
            <p className="mt-2">
              <a href={CONTACTS.phones[0].href} className="underline underline-offset-4">{CONTACTS.phones[0].value}</a>
            </p>
            <Link href="/contacts" className="mt-5 inline-block rounded-full bg-graphite px-6 py-3 text-milk">
              Как добраться
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
