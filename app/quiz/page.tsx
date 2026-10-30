import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { getProducts } from "@/lib/products/source";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Подбор ухода за кожей за 1 минуту",
  alternates: { canonical: "/quiz" },
  description: "Пять вопросов о коже — и готовая программа ухода PIYOL' с ценой. Можно сразу заказать или обсудить с консультантом.",
};

export default async function QuizPage() {
  const products = await getProducts();
  return (
    <div className="wrap pt-8 md:pt-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[44px] leading-[0.98] md:text-[64px]">Подберём уход за минуту</h1>
        <p className="mt-3 text-[17px] text-mute">Пять вопросов о коже — и программа из средств PIYOL&rsquo; с ценой.</p>
      </div>
      <div className="mt-10"><Quiz products={products} /></div>
    </div>
  );
}
