"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import heroPhoto from "@/public/hero-hydra-moist.jpg";

/** Четырёхлучевая звезда — тот же знак, что на упаковке PIYOL'. */
function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="currentColor" />
    </svg>
  );
}

// [left, top, size(px), глубина параллакса, задержка мерцания]
const SPARKLES: [string, string, number, number, number][] = [
  ["-4%", "18%", 34, 1.6, 0],
  ["88%", "8%", 22, 2.4, 1.1],
  ["94%", "52%", 30, 1.2, 0.5],
  ["-7%", "64%", 18, 2.8, 1.7],
  ["78%", "88%", 16, 2, 2.3],
];

export function HeroVisual({ lineHref }: { lineHref: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let px = 0, py = 0, tx = 0, ty = 0, scroll = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const onScroll = () => {
      scroll = Math.min(window.scrollY, 900);
    };
    const tick = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      el.style.setProperty("--px", px.toFixed(4));
      el.style.setProperty("--py", py.toFixed(4));
      el.style.setProperty("--sy", String(scroll));
      raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={root} className="hero-visual relative mx-auto w-full max-w-[400px] md:mr-0 md:max-w-[440px]">
      <div className="hero-arch arch relative bg-petal p-3 sm:p-4">
        <div className="arch relative aspect-[3/4] bg-petal/60">
          <div className="hero-photo absolute inset-0">
            <Image
              src={heroPhoto}
              alt="Девушка с линией PIYOL' Active Hydra-Moist: пенка, тонер и сыворотка"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 440px, 90vw"
              className="object-cover object-[50%_62%]"
            />
          </div>
          <div className="hero-sheen pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>

      {SPARKLES.map(([left, top, size, depth, delay], i) => (
        <span
          key={i}
          className="hero-sparkle pointer-events-none absolute text-rose"
          style={{ left, top, width: size, height: size, "--depth": depth, "--delay": `${delay}s` } as React.CSSProperties}
        >
          <Sparkle className="size-full" />
        </span>
      ))}

      <Link
        href={lineHref}
        className="hero-caption mt-5 flex items-center justify-center gap-2 text-center text-[14px] text-mute transition-colors hover:text-ink"
      >
        <Sparkle className="size-3 text-rose" />
        <span>На фото линия Active Hydra-Moist: пенка, тонер и сыворотка</span>
      </Link>
    </div>
  );
}
