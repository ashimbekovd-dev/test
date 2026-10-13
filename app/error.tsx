"use client";

import { waLink } from "@/lib/whatsapp";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap py-24">
      <div className="arch mx-auto max-w-md bg-petal/50 px-8 pb-12 pt-20 text-center">
        <h1 className="text-4xl">Каталог временно не загрузился</h1>
        <p className="mt-3 text-mute">Обновите страницу через минуту или напишите нам, и мы поможем с заказом.</p>
        <div className="mt-6 flex flex-col gap-3">
          <button type="button" onClick={reset} className="btn bg-ink text-white">Обновить</button>
          <a href={waLink("Здравствуйте! Не загружается каталог на сайте, хочу сделать заказ.")} target="_blank" rel="noreferrer" className="btn border border-moss text-moss">
            Написать в WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
