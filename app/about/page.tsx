import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACTS } from "@/lib/config";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";
import { LineCards } from "@/components/LineCards";
import { BeforeAfterGallery } from "@/components/BeforeAfter";
import { KaspiReviews } from "@/components/KaspiReviews";
import { CASES } from "@/lib/cases";
import { allReviews, averageRating, REVIEW_SHOTS, REVIEWS, reviewsWord } from "@/lib/reviews";
import { getProducts } from "@/lib/products/source";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "О бренде — корейская космецевтика",
  alternates: { canonical: "/about" },
  description: "PIYOL' — система ухода для улучшения качества кожи в домашних условиях. Клинические компоненты, корейское производство, понятный ритуал.",
};

const USP = [
  {
    title: "Клинические компоненты дома",
    text: "PDRN, пептиды, многослойная гиалуроновая кислота — компоненты, с которыми работают в корейских косметологических клиниках.",
  },
  {
    title: "Корейское производство, локальная адаптация",
    text: "Средства производятся в Южной Корее, а линейка разработана под сухой воздух, перепады температур и задачи кожи 35+.",
  },
  {
    title: "Система, а не набор баночек",
    text: "Вы понимаете, что, когда и в каком порядке наносить, и видите результат регулярного ухода. Средства сочетаются между собой, поэтому качество кожи улучшается постоянно.",
  },
];

const FAQ: { q: string; a: string[] }[] = [
  {
    q: "Что такое космецевтика?",
    a: [
      "Термин «космецевтика» — слияние двух слов: «косметика» и «фармацевтика». Это направление, которое объединяет косметологию, медицину и современные технологии.",
      "В отличие от обычной косметики, космецевтические средства не просто маскируют недостатки, а работают с состоянием кожи в глубоких слоях эпидермиса. Ведь красота — это не слои косметики, а здоровая кожа.",
      "Космецевтика позволяет получить профессиональный уход в домашних условиях.",
    ],
  },
  {
    q: "Почему космецевтика с каждым годом всё популярнее?",
    a: [
      "Космецевтика — это уходовые средства с активными компонентами. Но сравнивать её с лекарствами неправильно: лекарственные препараты проходят клинические испытания и обычно содержат один активный компонент в большой концентрации, который решает одну задачу.",
      "Космецевтика — многокомпонентная и работает сразу в нескольких направлениях. Все ингредиенты в её составе проходят апробацию.",
    ],
  },
  {
    q: "Какие преимущества у космецевтики?",
    a: [
      "• Без гормонов и парабенов.",
      "• Высококачественные, многократно протестированные ингредиенты, без отдушек и красителей — поэтому риск аллергии и побочных реакций минимален.",
      "• Комплексно решает задачи кожи: компоненты подобраны так, что усиливают и дополняют друг друга.",
      "• Уход можно подобрать под индивидуальные особенности кожи — так он работает максимально эффективно.",
    ],
  },
];

export default async function About() {
  const products = await getProducts();
  const stats = [
    { value: "2022", label: "год основания бренда" },
    { value: "Корея", label: "производство на заводах Южной Кореи" },
    { value: "10 000+", label: "реальных кейсов до и после" },
    { value: `${averageRating(REVIEWS).toFixed(1).replace(".", ",")} ★`, label: `${REVIEWS.length} ${reviewsWord(REVIEWS.length)} на Kaspi` },
  ];

  return (
    <div className="wrap pt-6 md:pt-10">
      <JsonLd data={faqJsonLd(FAQ)} />
      {/* ── Герой ── */}
      <section className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div>
          <p className="text-mute">О бренде PIYOL&rsquo;</p>
          <h1 className="mt-3 text-[46px] leading-[0.95] md:text-[76px]">Косметика с&nbsp;заботой</h1>
          <p className="mt-6 max-w-md font-display text-[26px] leading-tight text-rose md:text-[30px]">
            Мы дарим вам ритуал, вы дарите любовь к самой себе.
          </p>
          <p className="mt-6 max-w-lg text-[17px]">
            PIYOL&rsquo; — система ухода для улучшения качества кожи в домашних условиях. Мы начали свой путь в 2022 году
            и создаём эксклюзивные составы вместе с технологами Южной Кореи на лучших корейских заводах.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="btn bg-ink text-white hover:bg-ink/85">Подобрать уход</Link>
            <Link href="/#lines" className="btn border border-ink/25 hover:border-ink">Линии ухода</Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden arch bg-petal/60">
          <Image src="/brand/founder-hero.jpg" alt="Основательница PIYOL' с сывороткой PIYOL'" fill priority sizes="(min-width: 768px) 42vw, 100vw" className="object-cover object-top" />
        </div>
      </section>

      {/* ── Цифры доверия ── */}
      <section aria-label="PIYOL' в цифрах" className="mt-14 md:mt-20">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="bg-milk px-5 py-6 md:px-8 md:py-8">
              <p className="font-display text-[38px] leading-none text-rose md:text-[52px]">{s.value}</p>
              <p className="mt-2 text-[14px] text-mute">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Основательница ── */}
      <section className="mt-20 grid items-center gap-8 rounded-[32px] bg-petal/50 p-6 md:mt-28 md:grid-cols-[220px_1fr] md:gap-12 md:p-12">
        <div className="relative mx-auto size-44 overflow-hidden rounded-full md:size-[220px]">
          <Image src="/brand/founder-portrait.jpg" alt="Жулдыз Сарсебекова, основательница PIYOL'" fill sizes="220px" className="object-cover" />
        </div>
        <div>
          <span aria-hidden className="font-display text-[64px] leading-[0.5] text-rose">“</span>
          <blockquote className="font-display text-[26px] leading-tight md:text-[34px]">
            Красота женщины зависит не от природы, а от того, насколько она ухаживает за собой. Это даёт внутреннюю
            уверенность и подчёркивает характер.
          </blockquote>
          <p className="mt-5 text-[15px]">
            <span className="font-medium">Жулдыз Сарсебекова</span>
            <span className="text-mute">, основательница бренда PIYOL&rsquo;</span>
          </p>
          <p className="mt-4 max-w-prose text-[15px] text-mute">
            Основательница питает особую любовь к Южной Корее — к истокам натуральной и традиционной косметики.
          </p>
        </div>
      </section>

      {/* ── Позиционирование ── */}
      <section className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[0.8fr_1.2fr] md:gap-16" aria-labelledby="positioning">
        <div className="relative mx-auto aspect-[400/460] w-full max-w-[360px] overflow-hidden arch bg-petal/60">
          <Image src="/brand/positioning.jpg" alt="Сыворотки PIYOL' EXO Polydeox Booster и EXO Gluta Care" fill sizes="(min-width: 768px) 360px, 90vw" className="object-cover" />
        </div>
        <div>
          <p className="text-[13px] uppercase tracking-[0.12em] text-mute">Позиционирование</p>
          <h2 id="positioning" className="mt-3 text-[34px] leading-tight md:text-[48px]">
            Система ухода для улучшения качества кожи в&nbsp;домашних условиях
          </h2>
          <p className="mt-5 max-w-prose text-[17px]">
            Бренд помогает женщинам справиться с главными проявлениями возрастных изменений: сухостью, тусклостью,
            пигментацией, потерей упругости и морщинами.
          </p>
          <p className="mt-4 max-w-prose text-[17px]">
            Мы превращаем хаотичный уход в понятную систему, которая помогает коже выглядеть более увлажнённой, плотной,
            сияющей и ухоженной.
          </p>
        </div>
      </section>

      {/* ── УТП ── */}
      <section className="mt-16 md:mt-24" aria-labelledby="usp">
        <h2 id="usp" className="text-[38px] md:text-[52px]">Почему PIYOL&rsquo;</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {USP.map((u, i) => (
            <li key={u.title} className={`flex flex-col rounded-[28px] p-6 md:p-8 ${i === 1 ? "bg-sage/70" : "bg-petal/55"}`}>
              <span className="font-display text-[56px] leading-none text-rose md:text-[72px]">0{i + 1}</span>
              <h3 className="mt-4 font-display text-[26px] leading-tight md:text-[30px]">{u.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed">{u.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Слоган ── */}
      <section aria-label="Слоган" className="relative left-1/2 mt-20 w-screen -translate-x-1/2 overflow-hidden bg-ink py-16 text-milk md:mt-28 md:py-24">
        <span aria-hidden className="absolute left-[8%] top-8 text-[28px] text-petal/60 md:text-[40px]">✦</span>
        <span aria-hidden className="absolute bottom-10 left-[22%] text-[16px] text-petal/40">✦</span>
        <span aria-hidden className="absolute right-[10%] top-12 text-[20px] text-petal/50 md:text-[28px]">✦</span>
        <span aria-hidden className="absolute bottom-8 right-[24%] text-[32px] text-petal/60 md:text-[48px]">✦</span>
        <div className="wrap text-center">
          <p className="font-display text-[44px] leading-[0.95] md:text-[88px]">PIYOL&rsquo; — your skin system</p>
          <p className="mt-5 font-display text-[22px] text-petal md:text-[30px]">Открой свою вселенную!</p>
        </div>
      </section>

      {/* ── Линии ── */}
      <section className="mt-20 md:mt-28" aria-labelledby="about-lines">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="about-lines" className="text-[38px] md:text-[52px]">Наши линии ухода</h2>
          <Link href="/quiz" className="text-[15px] underline underline-offset-4 hover:text-moss">Не знаете, с чего начать? Пройдите подбор</Link>
        </div>
        <div className="mt-8"><LineCards products={products} /></div>
      </section>

      {/* ── Результаты ── */}
      <section className="mt-20 md:mt-28" aria-labelledby="about-results">
        <h2 id="about-results" className="text-[38px] md:text-[52px]">Результаты клиенток</h2>
        <p className="mt-2 max-w-prose text-mute">Более 10 000 реальных кейсов до и после — вот несколько из них.</p>
        <div className="mt-8"><BeforeAfterGallery cases={CASES.slice(0, 4)} /></div>
        <div className="mt-12"><KaspiReviews reviews={allReviews()} shots={REVIEW_SHOTS} limit={3} showLine /></div>
      </section>

      {/* ── FAQ: космецевтика ── */}
      <section className="mt-20 grid gap-8 md:mt-28 md:grid-cols-[0.8fr_1.2fr] md:gap-16" aria-labelledby="faq">
        <div>
          <h2 id="faq" className="text-[38px] leading-tight md:text-[52px]">Почему именно космецевтика?</h2>
          <p className="mt-4 text-mute">Отвечаем на частые вопросы.</p>
        </div>
        <div className="border-t border-line">
          {FAQ.map((f, i) => (
            <details key={f.q} className="group border-b border-line py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[19px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-[18px] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 space-y-3 text-[16px] leading-relaxed">
                {f.a.map((t) => <p key={t}>{t}</p>)}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Забота о клиенте ── */}
      <section className="mt-20 overflow-hidden rounded-[32px] bg-sage/60 md:mt-28 md:grid md:grid-cols-2">
        <div className="relative aspect-[16/11] md:aspect-auto">
          <Image src="/brand/team.jpg" alt="Клиентки PIYOL'" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="p-6 md:p-12">
          <p className="text-[13px] uppercase tracking-[0.12em] text-mute">Ещё немного о нас</p>
          <h2 className="mt-3 text-[34px] leading-tight md:text-[46px]">Мы заботимся о каждой клиентке</h2>
          <p className="mt-5 text-[17px]">
            В нашем магазине вы получите бесплатную консультацию профессионального косметолога и персональный подбор ухода.
          </p>
          <p className="mt-4 text-[17px]">
            Правильно подобранная космецевтика решает задачи кожи дома, поддерживает результат между визитами к
            косметологу и экономит ваше время.
          </p>
          <p className="mt-6 text-[15px]">
            {CONTACTS.pickupAddress}, {CONTACTS.hours}.{" "}
            <a href={CONTACTS.mapUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-moss">На карте</a>
          </p>
          <a href={waLink("Здравствуйте! Хочу получить консультацию по подбору ухода.")} target="_blank" rel="noreferrer" className="btn mt-6 bg-moss text-white hover:bg-moss/90">
            <WhatsAppIcon className="size-5" /> Получить консультацию
          </a>
        </div>
      </section>

    </div>
  );
}
