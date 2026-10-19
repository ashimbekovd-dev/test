"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";
import Link from "next/link";
import { getLine } from "@/lib/lines";
import { averageRating, reviewsWord, type Review, type ReviewShot } from "@/lib/reviews";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`tracking-[0.1em] text-rose ${className}`} aria-label={`Оценка ${value} из 5`}>
      {"★★★★★".slice(0, Math.round(value))}
      <span className="text-line">{"★★★★★".slice(Math.round(value))}</span>
    </span>
  );
}

/** Отзывы с Kaspi: карточки с текстом + оригинальные скриншоты, которые открываются прямо на сайте. */
export function KaspiReviews({
  reviews,
  shots,
  limit = 6,
  showLine = false,
  currentSku,
}: {
  reviews: Review[];
  shots: ReviewShot[];
  limit?: number;
  /** Плашка «Ритуал …» на отзывах о наборах (для главной) */
  showLine?: boolean;
  /** На странице этого товара плашку со средством не показываем */
  currentSku?: string;
}) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  if (!reviews.length) return null;
  const avg = averageRating(reviews).toFixed(1).replace(".", ",");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-petal/55 px-5 py-4 md:px-7">
        <div className="flex items-center gap-4">
          <span className="font-display text-[48px] leading-none">{avg}</span>
          <span>
            <Stars value={averageRating(reviews)} className="text-[20px]" />
            <span className="block text-[14px] text-mute">
              {reviews.length} {reviewsWord(reviews.length)} покупательниц на Kaspi.kz
            </span>
          </span>
        </div>
        {shots.length > 0 && (
          <button type="button" onClick={() => setOpen(true)} className="btn bg-ink text-white hover:bg-ink/85">
            Смотреть скриншоты с Kaspi
          </button>
        )}
      </div>

      <ul className="-mx-4 mt-5 flex items-start snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:items-start md:overflow-visible md:px-0" aria-label="Отзывы">
        {reviews.map((r, i) => (
          <li
            key={`${r.name}-${r.date}-${i}`}
            className={`flex w-[82%] shrink-0 snap-start flex-col rounded-[24px] border border-line bg-white/60 p-5 sm:w-[46%] md:w-auto ${!all && i >= limit ? "md:hidden" : ""}`}
          >
            <Stars value={r.rating} className="text-[16px]" />
            {r.sku && r.product && r.sku !== currentSku ? (
              <Link href={`/product/${encodeURIComponent(r.sku)}`} className="mt-2 self-start rounded-full bg-petal px-3 py-0.5 text-[12px] hover:bg-petal-deep/40">
                {r.product}
              </Link>
            ) : !r.sku && showLine && getLine(r.line) ? (
              <Link href={`/lines/${r.line}`} className="mt-2 self-start rounded-full bg-sage/70 px-3 py-0.5 text-[12px] hover:bg-sage">
                Ритуал {getLine(r.line)!.name}
              </Link>
            ) : null}
            <p className="mt-3 flex-1 text-[15px] leading-relaxed">«{r.text}»</p>
            <p className="mt-4 flex items-baseline justify-between gap-3 text-[13px]">
              <span className="font-medium">{r.name}</span>
              <span className="text-mute">{r.date} · Kaspi</span>
            </p>
          </li>
        ))}
      </ul>
      {reviews.length > limit && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-5 hidden text-[15px] underline underline-offset-4 hover:text-moss md:block">
          {all ? "Свернуть" : `Показать все ${reviews.length} ${reviewsWord(reviews.length)}`}
        </button>
      )}

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-auto max-h-[92dvh] w-[min(94vw,980px)] rounded-[28px] bg-milk p-0 backdrop:bg-ink/70"
        aria-label="Скриншоты отзывов с Kaspi.kz"
      >
        {open && (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="font-display text-[26px] leading-tight">Отзывы с Kaspi.kz</p>
                <p className="text-[13px] text-mute">Оригинальные скриншоты из нашего магазина на Kaspi</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid size-12 shrink-0 place-items-center rounded-full border border-line" aria-label="Закрыть">
                <CloseIcon className="size-5" />
              </button>
            </div>
            <p className="px-5 pt-3 text-[12px] text-mute md:hidden">Листайте вбок и вниз, чтобы прочитать отзывы целиком</p>
            <div className="space-y-3 overflow-auto p-3 md:p-5">
              {shots.map((s, i) => (
                <Image
                  key={s.image}
                  src={s.image}
                  alt={`Скриншот отзывов с Kaspi.kz, часть ${i + 1}`}
                  width={s.width}
                  height={s.height}
                  sizes="(min-width: 1000px) 940px, 680px"
                  loading="eager"
                  className="h-auto w-full min-w-[680px] rounded-[16px] border border-line bg-white md:min-w-0"
                />
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
