import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products/source";
import { CONTACTS } from "@/lib/config";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroVisual } from "@/components/HeroVisual";
import { ConcernPicker } from "@/components/ConcernPicker";
import { LineCards } from "@/components/LineCards";
import { TrustStrip } from "@/components/TrustStrip";
import { CategoryBento } from "@/components/CategoryBento";
import { BeforeAfterGallery } from "@/components/BeforeAfter";
import { CASES } from "@/lib/cases";

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();
  const categories = getCategories(products);
  const hits = products.filter((p) => p.hit).slice(0, 4);
  const sale = products.filter((p) => p.oldPrice).slice(0, 4);

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
            <Link href="/quiz" className="btn border border-ink/30 hover:border-ink">Подобрать уход за минуту</Link>
          </div>
        </div>
        <HeroVisual lineHref="/lines/active-hydra-moist" />
      </section>

      <section className="wrap mt-14 border-y border-line py-8" aria-label="Почему PIYOL'">
        <TrustStrip />
      </section>

      <section className="wrap mt-16 md:mt-24" aria-labelledby="concerns">
        <h2 id="concerns" className="text-[40px] md:text-[52px]">Что хотите решить?</h2>
        <p className="mt-2 max-w-xl text-[16px] text-mute">Начните с задачи кожи — покажем средства, которые с ней работают.</p>
        <div className="mt-8"><ConcernPicker products={products} /></div>
        <Link href="/quiz" className="group mt-3 flex flex-col gap-3 rounded-[28px] bg-ink px-6 py-6 text-milk sm:flex-row sm:items-center sm:justify-between md:px-8">
          <span>
            <span className="block font-display text-[28px] leading-tight md:text-[34px]">Не знаете, с чего начать?</span>
            <span className="mt-1 block text-[15px] text-milk/75">Пять вопросов о коже — и готовая программа с ценой.</span>
          </span>
          <span className="btn shrink-0 bg-milk text-ink group-hover:bg-white">Пройти тест</span>
        </Link>
      </section>

      <section className="wrap mt-20 md:mt-28" aria-labelledby="cases">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
          <h2 id="cases" className="text-[40px] md:text-[52px]">Результаты клиенток</h2>
          <p className="max-w-sm text-[15px] text-mute">Более 10 000 реальных кейсов до и после. Здесь — несколько из них, по линиям и средствам.</p>
        </div>
        <div className="mt-8"><BeforeAfterGallery cases={CASES} /></div>
      </section>

      <section className="wrap mt-20 md:mt-28" aria-labelledby="cats">
        <h2 id="cats" className="text-[40px] md:text-[52px]">Разделы каталога</h2>
        <div className="mt-8"><CategoryBento categories={categories} products={products} /></div>
      </section>

      <section id="lines" className="wrap mt-20 scroll-mt-24 md:mt-28" aria-labelledby="lines-title">
        <h2 id="lines-title" className="text-[40px] md:text-[52px]">Линии ухода</h2>
        <p className="mt-2 max-w-xl text-[16px] text-mute">Готовые ритуалы из нескольких шагов: от очищения до крема. Можно взять целиком или по одному средству.</p>
        <div className="mt-8"><LineCards products={products} /></div>
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
