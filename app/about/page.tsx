import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACTS } from "@/lib/config";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "О бренде",
  description: "PIYOL' — космецевтика с заботой. Эксклюзивные составы, созданные вместе с технологами Южной Кореи.",
};

const PARTNERS = ["l'mele", "la muse", "Mom's Bath Recipe", "belusta", "let me skin", "Wellderma", "allthat2ne's", "moremo"];

const PRINCIPLES = [
  { label: "Позиционирование", text: "Дать женщинам ритуал, который усилит их любовь к себе." },
  { label: "Видение", text: "Научить женщин быть прекрасными с помощью новейших разработок в космецевтике и уходе." },
  { label: "Слоган", text: "Открой свою вселенную!" },
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

export default function About() {
  return (
    <div className="wrap pt-6 md:pt-10">
      {/* ── Герой ── */}
      <section className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div>
          <p className="text-mute">О бренде PIYOL&rsquo;</p>
          <h1 className="mt-3 text-[46px] leading-[0.95] md:text-[76px]">Косметика с&nbsp;заботой</h1>
          <p className="mt-6 max-w-md font-display text-[26px] leading-tight text-rose md:text-[30px]">
            Мы дарим вам ритуал, вы дарите любовь к самой себе.
          </p>
          <p className="mt-6 max-w-lg text-[17px]">
            PIYOL&rsquo; — молодой бренд космецевтики. Мы начали свой путь в 2022 году с разработки уходовых средств и
            создаём эксклюзивные составы вместе с технологами Южной Кореи на лучших корейских заводах.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="btn bg-ink text-white hover:bg-ink/85">Подобрать уход</Link>
            <Link href="/#lines" className="btn border border-ink/25 hover:border-ink">Линии ухода</Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[480px] overflow-hidden arch bg-petal/60">
          <Image src="/brand/founder-products.jpg" alt="Основательница PIYOL' с линией ухода Bio Cell Extra Collagen" fill priority sizes="(min-width: 768px) 42vw, 100vw" className="object-cover object-[30%_center]" />
        </div>
      </section>

      {/* ── Основательница ── */}
      <section className="mt-20 grid items-center gap-8 rounded-[32px] bg-petal/50 p-6 md:mt-28 md:grid-cols-[220px_1fr] md:gap-12 md:p-12">
        <div className="relative mx-auto size-44 overflow-hidden rounded-full md:size-[220px]">
          <Image src="/brand/founder.png" alt="Жулдыз Сарсебекова, основательница PIYOL'" fill sizes="220px" className="object-cover" />
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

      {/* ── Что мы делаем ── */}
      <section className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="relative mx-auto aspect-[400/460] w-full max-w-[360px] overflow-hidden rounded-[28px] bg-petal/60">
          <Image src="/brand/formulas.jpg" alt="Средства PIYOL' Bio Cell Extra Collagen" fill sizes="360px" className="object-cover" />
        </div>
        <div>
          <h2 className="text-[38px] leading-tight md:text-[52px]">Исключительные составы. Новейшие разработки. Эффективный уход.</h2>
          <p className="mt-5 max-w-prose text-[17px]">
            Мы выпускаем космецевтическую линию ухода, которой пользуются и профессиональные косметологи, и те, кто
            просто любит заботиться о себе.
          </p>
          <ul className="mt-6 space-y-2 text-[16px]">
            {["Производство на заводах Южной Кореи", "Составы, разработанные с корейскими технологами", "Для профессионального и домашнего ухода"].map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden className="text-rose">✦</span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Позиционирование / видение / слоган ── */}
      <section className="mt-20 md:mt-28" aria-labelledby="principles">
        <h2 id="principles" className="text-[38px] md:text-[52px]">Во что мы верим</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.label} className={`rounded-[28px] p-6 md:p-8 ${i === 1 ? "bg-sage/70" : "bg-petal/55"}`}>
              <p className="text-[13px] uppercase tracking-[0.12em] text-mute">{p.label}</p>
              <p className="mt-3 font-display text-[26px] leading-tight md:text-[30px]">{p.text}</p>
            </li>
          ))}
        </ul>
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

      {/* ── Бренды-партнёры ── */}
      <section className="mt-20 md:mt-28" aria-labelledby="partners">
        <h2 id="partners" className="text-[32px] md:text-[40px]">Бренды-партнёры</h2>
        <p className="mt-2 text-mute">Кроме линий PIYOL&rsquo;, в каталоге — корейские бренды:</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {PARTNERS.map((b) => (
            <li key={b}>
              <Link href={`/catalog?brand=${encodeURIComponent(b)}`} className="inline-block rounded-full border border-line px-4 py-2 hover:border-ink/40">{b}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
