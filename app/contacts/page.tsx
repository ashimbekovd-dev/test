import type { Metadata } from "next";
import { CONTACTS } from "@/lib/config";
import { waLink } from "@/lib/whatsapp";
import { InfoPage } from "@/components/InfoPage";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Контакты и магазин в Алматы",
  description: "Магазин PIYOL' в Алматы: ул. Жандосова, 310г (мкр Таугуль-3), ежедневно с 9:00 до 21:00. WhatsApp, телефон, Instagram и Telegram.",
  alternates: { canonical: "/contacts" },
};

export default function Contacts() {
  return (
    <InfoPage title="Контакты">
      <section>
        <h2>Магазин</h2>
        <p>{CONTACTS.city}, {CONTACTS.pickupAddress}<br />Работаем {CONTACTS.hours}</p>
        <a href={CONTACTS.mapUrl} target="_blank" rel="noreferrer" className="btn mt-4 border border-ink/30 hover:border-ink">Открыть в 2ГИС</a>
      </section>
      <section>
        <h2>Связаться</h2>
        <a href={waLink("Здравствуйте! У меня вопрос по косметике PIYOL'.")} target="_blank" rel="noreferrer" className="btn mt-3 bg-moss text-white">
          <WhatsAppIcon className="size-5" /> Написать в WhatsApp
        </a>
        <ul>
          {CONTACTS.phones.map((p) => <li key={p}><a className="underline-offset-2 hover:underline" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a></li>)}
          <li><a className="underline-offset-2 hover:underline" href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a></li>
        </ul>
      </section>
      <section>
        <h2>Соцсети</h2>
        <ul>
          <li><a className="underline" href={CONTACTS.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a className="underline" href={CONTACTS.telegram} target="_blank" rel="noreferrer">Telegram</a></li>
          <li><a className="underline" href={CONTACTS.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
        </ul>
      </section>
    </InfoPage>
  );
}
