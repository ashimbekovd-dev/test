import type { Metadata } from "next";
import { CONTACTS, DELIVERY_FROM } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Доставка корейской косметики PIYOL' по Алматы и всему Казахстану, самовывоз из магазина на ул. Жандосова. Заказ в WhatsApp, оплата после подтверждения.",
  alternates: { canonical: "/delivery" },
};

export default function Delivery() {
  return (
    <InfoPage title="Доставка и оплата">
      <section>
        <h2>Получение заказа</h2>
        <ul>
          <li>Самовывоз из магазина в Алматы ({CONTACTS.pickupAddress}): бесплатно</li>
          <li>Доставка по Алматы: от {formatPrice(DELIVERY_FROM.almaty)}</li>
          <li>Доставка по Казахстану: от {formatPrice(DELIVERY_FROM.kazakhstan)}</li>
        </ul>
        <p>После отправки заказа в WhatsApp менеджер подтвердит наличие, стоимость и срок доставки.</p>
      </section>
      <section>
        <h2>Оплата</h2>
        <p>Способ оплаты менеджер согласует при подтверждении заказа. По вопросам оплаты: <a className="underline" href={`tel:${CONTACTS.paymentPhone.replace(/\s/g, "")}`}>{CONTACTS.paymentPhone}</a>.</p>
      </section>
      <section>
        <h2>Обмен и возврат</h2>
        <ul>
          <li>В течение 14 календарных дней возможен обмен или возврат товара надлежащего качества.</li>
          <li>Товар должен сохранить товарный вид, потребительские свойства, пломбы и фабричные ярлыки; нужен фискальный чек.</li>
          <li>Обращение рассматривается в течение 3 рабочих дней.</li>
          <li>Возврат товара надлежащего качества осуществляется без учёта стоимости доставки.</li>
        </ul>
        <p>Вопросы по возврату: WhatsApp <a className="underline" href={`https://wa.me/${CONTACTS.returnsWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{CONTACTS.returnsWhatsapp}</a>.</p>
      </section>
    </InfoPage>
  );
}
