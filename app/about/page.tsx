import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "О бренде" };

const PARTNERS = ["l'mele", "la muse", "Mom's Bath Recipe", "belusta", "let me skin", "Wellderma", "allthat2ne's", "moremo"];

export default function About() {
  return (
    <InfoPage title="О бренде PIYOL'">
      <section>
        <p className="font-display text-3xl leading-tight">Уход, в который можно влюбиться.</p>
        <p>Бренд стремится вдохновлять на здоровую и красивую жизнь и воплощать это с помощью выдающихся технологий.</p>
        <p>Доступная космецевтика и линии ухода, исключительные составы для улучшения состояния кожи.</p>
      </section>
      <section>
        <h2>Бренды-партнёры</h2>
        <p>Кроме линий PIYOL&rsquo;, в каталоге корейские бренды:</p>
        <ul className="!list-none !pl-0 flex flex-wrap gap-2">
          {PARTNERS.map((b) => (
            <li key={b}><Link href={`/catalog?brand=${encodeURIComponent(b)}`} className="inline-block rounded-full border border-line px-4 py-2 hover:border-ink/40">{b}</Link></li>
          ))}
        </ul>
      </section>
    </InfoPage>
  );
}
