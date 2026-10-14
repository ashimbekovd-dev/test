import Link from "next/link";
import { CONTACTS, WHATSAPP_NUMBER } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 bg-graphite text-milk/85">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-[2.2rem] leading-none text-milk">PIYOL&rsquo;</p>
          <p className="mt-4 max-w-xs text-[15px]">
            Корейская космецевтика и уход для кожи. Магазин в Алматы, доставка по Казахстану.
          </p>
        </div>
        <div className="text-[15px]">
          <p className="mb-3 font-serif text-xl text-milk">Магазин</p>
          <p>{CONTACTS.address}</p>
          <p>{CONTACTS.city}</p>
          <p className="mt-2">{CONTACTS.hours}</p>
        </div>
        <div className="text-[15px]">
          <p className="mb-3 font-serif text-xl text-milk">Связаться</p>
          <ul className="space-y-1">
            <li><a className="hover:text-powder" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a className="hover:text-powder" href={CONTACTS.instagram} target="_blank" rel="noopener">Instagram</a></li>
            <li><a className="hover:text-powder" href={CONTACTS.telegram} target="_blank" rel="noopener">Telegram</a></li>
            <li><a className="hover:text-powder" href={CONTACTS.phones[0].href}>{CONTACTS.phones[0].value}</a></li>
          </ul>
        </div>
        <div className="text-[15px]">
          <p className="mb-3 font-serif text-xl text-milk">Покупателям</p>
          <ul className="space-y-1">
            <li><Link className="hover:text-powder" href="/catalog">Каталог</Link></li>
            <li><Link className="hover:text-powder" href="/delivery">Доставка и оплата</Link></li>
            <li><Link className="hover:text-powder" href="/about">О бренде</Link></li>
            <li><Link className="hover:text-powder" href="/contacts">Контакты</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page border-t border-milk/15 py-6 text-[13px] text-milk/60">
        © {new Date().getFullYear()} PIYOL&rsquo;. Алматы, Казахстан
      </div>
    </footer>
  );
}
