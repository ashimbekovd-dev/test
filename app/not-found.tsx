import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24">
      <div className="arch mx-auto max-w-md bg-petal/50 px-8 pb-12 pt-20 text-center">
        <h1 className="text-5xl">Страница не найдена</h1>
        <p className="mt-3 text-mute">Возможно, товар закончился или ссылка устарела.</p>
        <Link href="/catalog" className="btn mt-6 bg-ink text-white">Открыть каталог</Link>
      </div>
    </div>
  );
}
