"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "./cart/CartProvider";
import { AddToCartButton } from "./AddToCartButton";
import { ProductImage } from "./ProductImage";
import { WhatsAppIcon } from "./icons";
import { getConcern } from "@/lib/concerns";
import { displayName, formatPrice } from "@/lib/format";
import { getLine } from "@/lib/lines";
import type { Product } from "@/lib/products/types";
import { buildQuizMessage, isComplete, QUESTIONS, recommend, type QuizAnswers } from "@/lib/quiz";
import { waLink } from "@/lib/whatsapp";

export function Quiz({ products }: { products: Product[] }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [step, setStep] = useState(0);
  const done = step >= QUESTIONS.length && isComplete(answers);

  if (done) return <QuizResult answers={answers} products={products} onRestart={() => { setAnswers({}); setStep(0); }} />;

  const q = QUESTIONS[step];
  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    setStep((s) => s + 1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-[14px] text-mute">
        <span>Вопрос {step + 1} из {QUESTIONS.length}</span>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="underline underline-offset-4 hover:text-ink">
            Назад
          </button>
        )}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-petal" aria-hidden>
        <div className="h-full rounded-full bg-rose transition-[width] duration-500" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>

      <fieldset key={q.id} className="quiz-step mt-10">
        <legend className="font-display text-[36px] leading-tight md:text-[48px]">{q.title}</legend>
        <div className="mt-8 grid gap-3">
          {q.options.map((o) => {
            const selected = answers[q.id] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.value)}
                aria-pressed={selected}
                className={`rounded-2xl border px-5 py-4 text-left text-[17px] transition-colors ${
                  selected ? "border-ink bg-white" : "border-line bg-white/60 hover:border-ink/40 hover:bg-white"
                }`}
              >
                {o.label}
                {o.hint && <span className="mt-0.5 block text-[13px] text-mute">{o.hint}</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function QuizResult({ answers, products, onRestart }: { answers: QuizAnswers; products: Product[]; onRestart: () => void }) {
  const r = useMemo(() => recommend(answers, products), [answers, products]);
  const { add } = useCart();
  const [added, setAdded] = useState<"" | "all" | "starter">("");
  const concern = getConcern(r.primary);
  const line = getLine(r.line);
  const starterTotal = r.starter.reduce((s, p) => s + p.price, 0);
  const put = (items: Product[], kind: "all" | "starter") => {
    items.forEach((p) => add(p.sku));
    setAdded(kind);
  };

  return (
    <div className="quiz-step">
      <p className="text-mute">Ваш подбор готов</p>
      <h2 className="mt-2 max-w-3xl text-[44px] leading-[0.98] md:text-[64px]">{concern?.title ?? "Ваш уход"}</h2>
      <p className="mt-4 max-w-xl text-[17px]">{r.note}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={() => put([...r.ritual, ...r.boosters], "all")} className="btn bg-ink text-white hover:bg-ink/85">
          Всю программу в корзину · {formatPrice(r.total)}
        </button>
        {r.starter.length > 1 && (
          <button type="button" onClick={() => put(r.starter, "starter")} className="btn border border-ink/40 hover:border-ink">
            Начать с главного · {formatPrice(starterTotal)}
          </button>
        )}
        <a
          href={waLink(buildQuizMessage(answers, r))}
          target="_blank"
          rel="noreferrer"
          className="btn border border-moss text-moss hover:bg-moss hover:text-white"
        >
          <WhatsAppIcon className="size-5" /> Обсудить подбор с консультантом
        </a>
      </div>
      <p className="mt-3 min-h-5 text-[14px] text-mute" aria-live="polite">
        {added && (
          <>
            {added === "all" ? "Программа в корзине." : "Главные средства в корзине."}{" "}
            <Link href="/cart" className="underline underline-offset-2">Оформить заказ</Link>
          </>
        )}
      </p>

      {r.ritual.length > 0 && (
        <section className="mt-12">
          <h3 className="text-[30px]">Основа: ритуал {line?.name}</h3>
          <p className="mt-1 text-mute">Утром и вечером, по шагам.{" "}
            {line && <Link href={`/lines/${line.slug}`} className="underline underline-offset-4 hover:text-ink">Подробнее о линии</Link>}
          </p>
          <ProductRows items={r.ritual} starter={r.starter} />
        </section>
      )}
      {r.boosters.length > 0 && (
        <section className="mt-12">
          <h3 className="text-[30px]">Усилители</h3>
          <p className="mt-1 text-mute">Курсом поверх основы — под вашу главную задачу.</p>
          <ProductRows items={r.boosters} starter={r.starter} />
        </section>
      )}

      <button type="button" onClick={onRestart} className="mt-10 text-[14px] text-mute underline underline-offset-4 hover:text-ink">
        Пройти тест заново
      </button>
    </div>
  );
}

function ProductRows({ items, starter }: { items: Product[]; starter: Product[] }) {
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.sku} className="flex gap-4 rounded-[24px] bg-white/60 p-3">
          <Link href={`/product/${encodeURIComponent(p.sku)}`} className="relative block h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-petal/60">
            <ProductImage src={p.images[0]} alt="" sizes="96px" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            {starter.includes(p) && <span className="text-[12px] font-semibold text-rose">Главное</span>}
            <Link href={`/product/${encodeURIComponent(p.sku)}`} className="font-medium leading-snug hover:text-moss">{displayName(p.name)}</Link>
            {p.nameRu && <span className="text-[13px] leading-snug text-mute">{p.nameRu}</span>}
            <span className="mt-1 font-semibold">{formatPrice(p.price)}</span>
            <div className="mt-auto pt-2"><AddToCartButton sku={p.sku} compact /></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
