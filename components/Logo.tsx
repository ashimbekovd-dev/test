import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-piyol.png";

/** Фирменный логотип PIYOL' (цвет бренда, прозрачный фон). Высоту задаёт className, ширина — по пропорции. */
export function Logo({ className = "h-7 md:h-8" }: { className?: string }) {
  return (
    <Link href="/" aria-label="PIYOL' — на главную" className="inline-flex shrink-0 items-center">
      <Image src={logo} alt="PIYOL'" priority sizes="200px" className={`w-auto ${className}`} />
    </Link>
  );
}
