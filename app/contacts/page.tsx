import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { CONTACTS, WHATSAPP_NUMBER } from "@/lib/config";

export const metadata: Metadata = { title: "Контакты" };

const link = "underline underline-offset-4";

export default function ContactsPage() {
  return (
    <InfoPage title="Контакты" lead={`Магазин PIYOL’ в Алматы. Работаем ${CONTACTS.hours}.`}>
      <InfoSection title="Адрес">
        <p className="text-lg">{CONTACTS.address}<br />{CONTACTS.city}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href={CONTACTS.map2gis} target="_blank" rel="noopener" className="rounded-full bg-graphite px-6 py-3 text-milk">Открыть в 2ГИС</a>
          <a href={CONTACTS.googleMaps} target="_blank" rel="noopener" className="rounded-full border border-graphite px-6 py-3">Google Карты</a>
        </div>
      </InfoSection>

      <InfoSection title="Телефоны">
        <ul>
          {CONTACTS.phones.map((p) => (
            <li key={p.href}>
              {p.label}: <a className={link} href={p.href}>{p.value}</a>
            </li>
          ))}
        </ul>
        <p>Почта: <a className={link} href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></p>
      </InfoSection>

      <InfoSection title="Мессенджеры и соцсети">
        <ul>
          <li><a className={link} href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">WhatsApp</a> — заказы и консультации</li>
          <li><a className={link} href={CONTACTS.instagram} target="_blank" rel="noopener">Instagram</a> — @piyol.space</li>
          <li><a className={link} href={CONTACTS.telegram} target="_blank" rel="noopener">Telegram</a> — @piyolspace</li>
        </ul>
      </InfoSection>
    </InfoPage>
  );
}
