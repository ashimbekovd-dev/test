import type { Metadata } from "next";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { CONTACTS, WHATSAPP_NUMBER } from "@/lib/config";

export const metadata: Metadata = { title: "Доставка и оплата" };

export default function DeliveryPage() {
  return (
    <InfoPage
      title="Доставка и оплата"
      lead="Соберите корзину на сайте и отправьте заказ в WhatsApp. Менеджер подтвердит наличие, сумму доставки и способ оплаты."
    >
      <InfoSection title="Самовывоз">
        <p>Бесплатно из магазина: {CONTACTS.address}, {CONTACTS.city}. Работаем {CONTACTS.hours}.</p>
        <p>Заберите заказ в удобное время — менеджер напишет, когда он будет собран.</p>
      </InfoSection>

      <InfoSection title="Доставка по Алматы">
        <ul>
          <li>В пределах «золотого квадрата» — в день заказа, за 4–6 часов в рабочее время магазина.</li>
          <li>За чертой города и по Алматинской области — 1–3 рабочих дня.</li>
          <li>Стоимость — от 2 000 ₸. Бесплатно при заказе от 80 000 ₸.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Доставка по Казахстану">
        <ul>
          <li>Отправляем из Алматы курьерской службой; в некоторые регионы — Казпочтой.</li>
          <li>Когда посылка приедет в ваш город, курьер свяжется и согласует дату.</li>
          <li>Стоимость — от 2 000 ₸ за посылку до 5 кг. Бесплатно при заказе от 80 000 ₸.</li>
          <li>Посылка хранится на складе 14 календарных дней.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Оплата">
        <p>Способ оплаты согласуете с менеджером в WhatsApp при подтверждении заказа. Заказ отправляем после оплаты.</p>
        <p>
          Вопросы по оплате и работе сайта:{" "}
          <a className="underline underline-offset-4" href={CONTACTS.phones[1].href}>{CONTACTS.phones[1].value}</a>
        </p>
      </InfoSection>

      <InfoSection title="Возврат и обмен">
        <ul>
          <li>В течение 14 календарных дней можно вернуть или обменять товар надлежащего качества.</li>
          <li>Товар не использовался, сохранены вид, пломбы и ярлыки, есть чек.</li>
          <li>Обменять можно на аналогичный или другой товар с перерасчётом разницы в цене.</li>
          <li>Обращение рассматриваем 3 рабочих дня; стоимость доставки при возврате не компенсируется.</li>
          <li>
            Для возврата денег на карту отправьте заявление и копию удостоверения личности на{" "}
            <a className="underline underline-offset-4" href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>. Деньги
            вернутся в течение 7 рабочих дней.
          </li>
        </ul>
        <p>
          Консультант по возвратам:{" "}
          <a className="underline underline-offset-4" href={CONTACTS.phones[2].href}>{CONTACTS.phones[2].value}</a>
        </p>
      </InfoSection>

      <InfoSection title="Остались вопросы">
        <p>
          Напишите нам в{" "}
          <a className="underline underline-offset-4" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">WhatsApp</a>{" "}
          или позвоните: <a className="underline underline-offset-4" href={CONTACTS.phones[0].href}>{CONTACTS.phones[0].value}</a>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
