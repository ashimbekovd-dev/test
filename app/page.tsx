import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products/source";
import { CONTACTS } from "@/lib/config";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const categories = getCategories(products);
  const hits = products.filter((p) => p.hit).slice(0, 4);
  const sale = products.filter((p) => p.oldPrice).slice(0, 4);
  const cover = (c: string) => products.find((p) => p.category === c)?.images[0];
  const heroImage = (hits[0] ?? products[0])?.images[0];

  return (
    <>
      <section className="wrap grid items-end gap-8 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pt-16">
        <div className="pb-4 md:pb-16">
          <h1 className="text-[56px] leading-[0.95] sm:text-[76px] lg:text-[104px]">Уход, в который можно влюбиться</h1>
          <p className="mt-6 max-w-md text-[17px] text-mute">
            Корейская космецевтика и линии ухода PIYOL&rsquo;. Соберите корзину на сайте и отправьте заказ в WhatsApp, менеджер подтвердит наличие и доставку.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn bg-ink text-white hover:bg-ink/85">Смотреть каталог</Link>
            <Link href="/contacts" className="btn border border-ink/30 hover:border-ink">Магазин в Алматы</Link>
          </div>
        </div>
        {heroImage && (
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] arch bg-petal">
            <ProductImage src={heroImage} alt="" sizes="(min-width: 768px) 40vw, 100vw" priority />
          </div>
        )}
      </section>

      <section className="wrap mt-20" aria-labelledby="cats">
        <h2 id="cats" className="text-[40px] md:text-[52px]">Категории</h2>
        <ul className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6">
          {categories.map((c) => (
            <li key={c} className="w-36 shrink-0 snap-start md:w-auto">
              <Link href={`/catalog?category=${encodeURIComponent(c)}`} className="group block">
                <div className="relative aspect-[3/4] arch bg-sage">
                  {cover(c) && <ProductImage src={cover(c)!} alt="" sizes="(min-width: 1024px) 16vw, 144px" />}
                </div>
                <p className="mt-2 text-[14px] font-medium group-hover:text-moss">{c}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {hits.length > 0 && (
        <section className="wrap mt-20" aria-labelledby="hits">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="hits" className="text-[40px] md:text-[52px]">Хиты</h2>
            <Link href="/catalog" className="text-[14px] underline underline-offset-4 hover:text-moss">Весь каталог</Link>
          </div>
          <div className="mt-6"><ProductGrid products={hits} /></div>
        </section>
      )}

      {sale.length > 0 && (
        <section className="wrap mt-20" aria-labelledby="sale">
          <h2 id="sale" className="text-[40px] md:text-[52px]">Скидки</h2>
          <div className="mt-6"><ProductGrid products={sale} /></div>
        </section>
      )}

      <section className="wrap mt-24">
        <div className="grid gap-8 rounded-[32px] bg-petal/60 p-8 md:grid-cols-2 md:p-14">
          <div>
            <h2 className="text-[40px] md:text-[52px]">О бренде PIYOL&rsquo;</h2>
            <p className="mt-4 max-w-prose text-[17px]">
              Бренд стремится вдохновлять на здоровую и красивую жизнь и воплощать это с помощью выдающихся технологий. Доступная космецевтика и линии ухода, исключительные составы для улучшения состояния кожи.
            </p>
            <Link href="/about" className="mt-6 inline-block underline underline-offset-4 hover:text-moss">Подробнее о бренде</Link>
          </div>
          <div className="md:border-l md:border-ink/10 md:pl-10">
            <h3 className="text-3xl">Магазин в Алматы</h3>
            <p className="mt-3">{CONTACTS.pickupAddress}<br />{CONTACTS.hours}</p>
            <p className="mt-3 text-mute">Самовывоз бесплатно. Доставка по Алматы от 1500 ₸, по Казахстану от 1800 ₸.</p>
            <a href={CONTACTS.mapUrl} target="_blank" rel="noreferrer" className="btn mt-6 border border-ink/30 hover:border-ink">Открыть на карте</a>
          </div>
        </div>
      </section>
    </>
  );
}
