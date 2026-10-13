import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="PIYOL' — на главную" className={`font-display text-[28px] font-semibold leading-none tracking-[0.04em] ${className}`}>
      PIYOL&rsquo;
    </Link>
  );
}
