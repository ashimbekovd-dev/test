import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/InfoPage";
import { catalogHref } from "@/lib/catalog/query";

export const metadata: Metadata = { title: "О бренде" };

export default function AboutPage() {
  return (
    <InfoPage
      title="О бренде PIYOL’"
      lead="Космецевтика с корейскими технологиями для домашнего ухода. Миссия бренда — ритуал красоты и молодости, который помогает каждой женщине больше любить себя."
    >
      <InfoSection title="С чего всё началось">
        <p>
          В 1996–1997 годах основательница Жулдыз Сарсебекова работала по контракту в Южной Корее и познакомилась с
          натуральной и традиционной косметикой. Любовь к корейской культуре стала основой компании Arirang Company.
        </p>
        <ul>
          <li>2015 — медицинский центр Arirang Company: лечение казахстанцев в клиниках Южной Кореи с сопровождением.</li>
          <li>2017 — онлайн-магазин люксовых корейских брендов в Алматы.</li>
          <li>2019 — мультибрендовый магазин BEAUTYKOR для всего Казахстана.</li>
          <li>2022 — собственный бренд космецевтики PIYOL’.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Как устроен PIYOL’">
        <p>
          Средства производят на заводах Южной Кореи. В основе — составы, к которым приходят в кабинете косметолога:
          PDRN, пептиды, многослойная гиалуроновая кислота, коллаген, витамин C.
        </p>
        <p>
          Идея простая: стать своим косметологом дома. Поэтому у PIYOL’ есть и отдельные ампулы для точечных задач, и
          готовые линии ухода из нескольких шагов.
        </p>
        <p>
          <Link href={catalogHref({ category: "Космецевтика PIYOL'" })} className="underline underline-offset-4">Космецевтика PIYOL’</Link>
          {" · "}
          <Link href={catalogHref({ category: "Линии ухода PIYOL'" })} className="underline underline-offset-4">Линии ухода</Link>
        </p>
      </InfoSection>

      <InfoSection title="Бренды-партнёры">
        <p>
          Рядом с PIYOL’ в магазине — корейские бренды, которые мы сами проверили и с которыми работаем напрямую.
        </p>
        <ul>
          <li>
            <Link href={catalogHref({ brand: "Beausta" })} className="underline underline-offset-4">Beausta</Link> — линия
            Cicarecipe с центеллой, солнцезащита и миниатюры для поездок.
          </li>
          <li>
            <Link href={catalogHref({ brand: "Lebelage" })} className="underline underline-offset-4">Lebelage</Link> — кремы
            и ампулы с коллагеном, витамином C и муцином улитки.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Связь с клиниками Кореи">
        <p>
          Компания сотрудничает с крупными медицинскими центрами Южной Кореи. Этот опыт помогает выбирать составы и
          объяснять, как сочетать домашний уход с процедурами.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
