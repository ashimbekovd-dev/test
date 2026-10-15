import Link from "next/link";
import { CONTACTS } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sage/50">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-10" />
          <p className="mt-4 max-w-xs text-mute">Корейская косметика в Алматы. Подберём уход и ответим на вопросы в WhatsApp.</p>
        </div>
        <div>
          <h2 className="text-xl">Магазин</h2>
          <p className="mt-3">{CONTACTS.pickupAddress}<br />{CONTACTS.hours}</p>
          <p className="mt-3">
            {CONTACTS.phones.slice(0, 2).map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-moss">{p}</a>
            ))}
          </p>
        </div>
        <div>
          <h2 className="text-xl">Покупателям</h2>
          <ul className="mt-3 space-y-1">
            <li><Link href="/catalog" className="hover:text-moss">Каталог</Link></li>
            <li><Link href="/delivery" className="hover:text-moss">Доставка и оплата</Link></li>
            <li><a href={CONTACTS.instagram} className="hover:text-moss" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={CONTACTS.telegram} className="hover:text-moss" target="_blank" rel="noreferrer">Telegram</a></li>
          </ul>
        </div>
      </div>
      <p className="wrap pb-8 text-[13px] text-mute">© {new Date().getFullYear()} PIYOL&rsquo;</p>
    </footer>
  );
}
