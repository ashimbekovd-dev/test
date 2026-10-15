"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";
import { caseHref, type Case } from "@/lib/cases";

/** Подписи «до» и «после» поверх склейки — на какой стороне что. */
function Labels({ split }: { split: Case["split"] }) {
  const tag = "absolute rounded-full bg-milk/90 px-2.5 py-0.5 text-[12px] font-semibold text-ink";
  return split === "horizontal" ? (
    <>
      <span className={`${tag} left-2 top-2`}>до</span>
      <span className={`${tag} left-[calc(50%+8px)] top-2`}>после</span>
    </>
  ) : (
    <>
      <span className={`${tag} left-2 top-2`}>до</span>
      <span className={`${tag} left-2 top-[calc(50%+8px)]`}>после</span>
    </>
  );
}

/** Галерея кейсов: лента на телефоне, сетка на компьютере; по нажатию — фото крупно. */
export function BeforeAfterGallery({ cases, columns = 4 }: { cases: Case[]; columns?: 2 | 4 }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const current = open !== null ? cases[open] : null;

  return (
    <>
      <ul className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-4"} md:overflow-visible md:px-0`}>
        {cases.map((c, i) => (
          <li key={c.image} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto">
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Открыть фото: ${c.title}, ${c.result.toLowerCase()}`}>
              <span className="relative block aspect-square overflow-hidden rounded-[24px] bg-petal/60">
                <Image src={c.image} alt="" fill sizes={columns === 2 ? "(min-width: 768px) 40vw, 78vw" : "(min-width: 768px) 25vw, 78vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <Labels split={c.split} />
              </span>
              <span className="mt-3 block text-[13px] text-mute">{c.result}</span>
              <span className="block font-medium group-hover:text-moss">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        className="m-auto max-h-[92dvh] w-[min(92vw,900px)] rounded-[28px] bg-milk p-0 backdrop:bg-ink/70"
        aria-label={current ? `${current.title}: до и после` : undefined}
      >
        {current && (
          <div className="p-3 md:p-4">
            <div className="relative overflow-hidden rounded-[20px]">
              <Image src={current.image} alt={`${current.title}: до и после — ${current.result.toLowerCase()}`} width={current.width} height={current.height} sizes="900px" className="h-auto max-h-[72dvh] w-full object-contain" />
              <Labels split={current.split} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4">
              <div>
                <p className="text-[13px] text-mute">{current.result}</p>
                <p className="font-display text-[26px] leading-tight">{current.title}</p>
              </div>
              <div className="flex gap-2">
                <Link href={caseHref(current)} onClick={() => setOpen(null)} className="btn bg-ink text-white hover:bg-ink/85">
                  {current.line ? "Смотреть ритуал" : "Смотреть средство"}
                </Link>
                <button type="button" onClick={() => setOpen(null)} className="grid size-12 place-items-center rounded-full border border-line" aria-label="Закрыть">
                  <CloseIcon className="size-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
