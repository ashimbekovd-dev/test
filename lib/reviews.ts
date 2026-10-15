/**
 * Отзывы покупательниц с Kaspi.kz — дословно, со скриншотов магазина.
 * Ничего не придумываем и не правим: только то, что написано на Kaspi.
 * Скриншоты лежат в public/reviews и открываются на сайте, без перехода на Kaspi.
 */

export type Review = {
  name: string;
  /** ДД.ММ.ГГГГ, как на Kaspi */
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  line: string;
  /** Показывать первыми: отзывы о действии средств */
  featured?: boolean;
};

export type ReviewShot = { image: string; width: number; height: number; line: string };

const ACNE = "intense-purifying-acne";

export const REVIEWS: Review[] = [
  { name: "Аида", date: "14.10.2026", rating: 5, line: ACNE, featured: true, text: "Очень хорошо помогает от акне." },
  { name: "Алиям", date: "09.10.2026", rating: 5, line: ACNE, text: "Шикарная упаковка. Очень хорошая уходовая косметика! Приятная текстура, хорошо увлажняет кожу и делает её мягкой. Качество отличное, покупкой довольна. Обязательно закажу ещё!" },
  { name: "Салтанат", date: "09.10.2026", rating: 5, line: ACNE, text: "Ұнады маған, керемет. Бетіңді тартып тастады менің." },
  { name: "Умитжан", date: "09.10.2026", rating: 5, line: ACNE, text: "Набор отличный." },
  { name: "Айдана", date: "08.10.2026", rating: 5, line: ACNE, text: "Только взяла, отлично выглядит." },
  { name: "Арайлым", date: "07.10.2026", rating: 5, line: ACNE, text: "Спасибо, как всегда, лучший товар и доставили быстро." },
  { name: "Перизат", date: "06.10.2026", rating: 5, line: ACNE, text: "Очень хороший набор, девочкам моим понравился!" },
  { name: "Перизат", date: "06.10.2026", rating: 5, line: ACNE, featured: true, text: "Отличный набор, заказываю уже второй набор для второй дочери, очень понравился. Рекомендую!" },
  { name: "Карина", date: "06.10.2026", rating: 5, line: ACNE, text: "Косметика выглядит дорого, стильно, украсит полочку в ванной однозначно. Но о качестве продукта пока судить не могу, поскольку покупала на подарок подруге. Спасибо большое." },
  { name: "Адемы", date: "06.10.2026", rating: 5, line: ACNE, text: "Супер спасибо." },
  { name: "Айнель", date: "05.10.2026", rating: 5, line: ACNE, featured: true, text: "Набор доставили раньше обещанного срока, всего за 2 дня. Упаковка премиум-класса. Баночки такие красивые. Умывашка под цифрой 1 в виде пенки, что очень удобно. Без отдушек. Тонер 2 не имеет липкости, сыворотка 3 быстро впитывается, эмульсия 4 в виде желе, густая, снимает покраснения. Спасибо за набор по уходу за лицом PIYOL." },
  { name: "Алтынгүл", date: "04.10.2026", rating: 5, line: ACNE, featured: true, text: "Пользуюсь набором 5 дней, вижу небольшой эффект. Действительно подсушивает прыщи. Но если у вас жирная или комбинированная кожа, то средства подойдут вам. Расход не экономичный, думаю набора хватит на месяца 2, не больше." },
  { name: "Владимир", date: "03.10.2026", rating: 5, line: ACNE, text: "Товар пришёл вовремя. Спасибо за быструю доставку." },
  { name: "Дилиха", date: "02.10.2026", rating: 5, line: ACNE, featured: true, text: "Заказываю третий раз! Мне нравится!" },
  { name: "Лайля", date: "28.09.2026", rating: 5, line: ACNE, text: "Прекрасный набор, доча очень обрадовалась." },
  { name: "Назым", date: "27.09.2026", rating: 5, line: ACNE, text: "Давно пользуюсь продукцией piyol, очень нравится. А тут такая акция, вообще круто. Срок хороший, доставка быстрая." },
  { name: "Томирис", date: "27.09.2026", rating: 5, line: ACNE, text: "Пришло раньше срока, упаковали все отлично. Еще не пользовалась, но очень хороший объем для такой цены." },
  { name: "Томирис", date: "21.09.2026", rating: 5, line: ACNE, featured: true, text: "Прекрасный набор, беру уже 2 раз, помогает поддерживать кожу от высыпаний." },
  { name: "Жадыра", date: "21.09.2026", rating: 5, line: ACNE, featured: true, text: "Купила для сына. Прыщиков стало меньше. Масло чайного дерева, алое вера в составе везде, что очень круто." },
  { name: "Асемгуль", date: "20.09.2026", rating: 5, line: ACNE, featured: true, text: "Очень понравился набор, брала доче, подросток, есть небольшие высыпания. Состав, консистенция очень понравилось, самое не забивает поры, не жирнит, остановились на этом наборе." },
  { name: "Айгерим", date: "19.09.2026", rating: 5, line: ACNE, text: "Доставка раньше указанного срока пришла, всё хорошо упаковано, дочке понравилось с первого применения, будем ждать хороших результатов." },
];

export const REVIEW_SHOTS: ReviewShot[] = [
  { image: "/reviews/kaspi-acne-1.png", width: 1208, height: 182, line: ACNE },
  { image: "/reviews/kaspi-acne-2.png", width: 1894, height: 276, line: ACNE },
  { image: "/reviews/kaspi-acne-3.png", width: 1448, height: 202, line: ACNE },
  { image: "/reviews/kaspi-acne-4.png", width: 1794, height: 1010, line: ACNE },
  { image: "/reviews/kaspi-acne-5.png", width: 1898, height: 1348, line: ACNE },
  { image: "/reviews/kaspi-acne-6.png", width: 1870, height: 654, line: ACNE },
  { image: "/reviews/kaspi-acne-7.png", width: 1864, height: 906, line: ACNE },
];

const dateKey = (d: string) => d.split(".").reverse().join("");

/** Отзывы линии: сначала про действие средств, затем остальные — от новых к старым. */
export function reviewsFor(line?: string): Review[] {
  if (!line) return [];
  return REVIEWS.filter((r) => r.line === line).sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || dateKey(b.date).localeCompare(dateKey(a.date)),
  );
}

export const shotsFor = (line?: string) => (line ? REVIEW_SHOTS.filter((s) => s.line === line) : []);

export function averageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

/** 1 отзыв, 3 отзыва, 21 отзыв, 11 отзывов */
export function reviewsWord(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "отзыв";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "отзыва";
  return "отзывов";
}
