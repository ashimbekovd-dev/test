import Link from "next/link";
import { CONCERNS } from "@/lib/concerns";
import type { Product } from "@/lib/products/types";

const plural = (n: number) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "средство";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "средства";
  return "средств";
};

/** Вход в каталог «с вопросом»: шесть задач кожи, у каждой — кому это и сколько средств. */
export function ConcernPicker({ products }: { products: Product[] }) {
  const count = (slug: string) => products.filter((p) => p.concerns.includes(slug)).length;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CONCERNS.filter((c) => count(c.slug) > 0).map((c, i) => (
        <li key={c.slug}>
          <Link
            href={`/catalog?concern=${c.slug}`}
            className={`group flex h-full flex-col rounded-[28px] p-6 transition-colors md:p-7 ${
              i % 3 === 1 ? "bg-sage/70 hover:bg-sage" : "bg-petal/55 hover:bg-petal"
            }`}
          >
            <span className="font-display text-[28px] leading-tight md:text-[32px]">{c.title}</span>
            <span className="mt-2 text-[15px] text-ink/75">{c.lead}</span>
            <span className="mt-auto flex items-center justify-between pt-5 text-[14px]">
              <span className="text-mute">{count(c.slug)} {plural(count(c.slug))}</span>
              <span className="underline-offset-4 group-hover:underline">Подобрать</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
