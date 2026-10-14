import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-[2.8rem] md:text-[4rem]">Такой страницы нет</h1>
      <p className="mx-auto mt-4 max-w-md text-graphite-soft">
        Возможно, товар закончился или ссылка устарела. Всё, что есть в наличии, — в каталоге.
      </p>
      <Link href="/catalog" className="mt-8 inline-block rounded-full bg-graphite px-7 py-3 text-milk">
        Открыть каталог
      </Link>
    </div>
  );
}
