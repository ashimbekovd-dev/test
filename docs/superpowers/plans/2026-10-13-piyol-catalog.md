# PIYOL' Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сайт-каталог PIYOL' на Next.js: товары из Google Таблицы (CSV), корзина в браузере, заказ одним сообщением в WhatsApp.

**Architecture:** Next.js App Router, серверные страницы с ISR (`revalidate = 300`). Данные проходят один путь: CSV (URL таблицы или локальный `data/products.csv`) → чистый парсер → типизированный `Product[]`. Вся логика (парсер, фильтры каталога, корзина, текст WhatsApp) — чистые функции под Vitest; React-слой только отображает.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS 4, Vitest, Playwright (скриншоты), `papaparse` для CSV.

**Spec:** `docs/superpowers/specs/2026-10-13-piyol-catalog-design.md`

## Global Constraints

- Язык интерфейса — русский; валюта — тенге, формат `13 490 ₸` (неразрывный пробел между тысячами и перед ₸).
- `revalidate = 300` для всех страниц с товарами.
- Номер WhatsApp — `process.env.NEXT_PUBLIC_WHATSAPP`, по умолчанию `77080503518` (без `+`).
- Источник CSV — `process.env.PRODUCTS_CSV_URL`; если не задан, читается `data/products.csv`.
- Количество на позицию 1–20.
- Mobile-first: каталог 2 колонки на 390 px, 3–4 на ≥ 1024 px; боковые отступы ≥ 16 px; без горизонтального скролла.
- Слоган главной: «Уход, в который можно влюбиться».
- Самовывоз: «ТРЦ Forum Almaty, 2 этаж»; часы «ежедневно 10:00–22:00».
- Supabase и Resend не подключаются.
- Коммиты на `main` маленькие, по задачам; сообщения заканчиваются строками атрибуции сессии.

## Review Focus

1. Цена в таблице записана как `13 490 ₸`, `13 490` (неразрывный пробел) или `13490,00` → разбирается в `13490`, а не `NaN`/пропуск строки. (Task 2)
2. Товар лежит в корзине у клиента, а менеджер удалил его или поставил `in_stock = нет` → корзина не падает, позиция помечена «нет в наличии» и исключена из сообщения и итога. (Task 5)
3. `localStorage` недоступен (приватный режим, Safari) → корзина работает до перезагрузки, без ошибок в консоли. (Task 6)
4. Картинка с домена, не разрешённого в `next/image` → страница не падает: используется `unoptimized` для внешних URL. (Task 7)
5. Поиск/фильтры без результатов или неизвестная категория в `?category=` → пустое состояние «Ничего не нашли» + кнопка «Сбросить фильтры», не 500. (Task 4, Task 8)

---

## File Structure

```
app/
  layout.tsx            шрифты, Header, Footer, CartProvider, плавающая кнопка WA
  page.tsx              главная
  catalog/page.tsx      каталог (searchParams → query)
  product/[sku]/page.tsx
  cart/page.tsx         клиентская корзина + форма
  about/page.tsx  delivery/page.tsx  contacts/page.tsx
  not-found.tsx
  globals.css           Tailwind + токены дизайна
components/
  ProductCard.tsx  ProductGrid.tsx  Price.tsx  CatalogFilters.tsx (client)
  Header.tsx  Footer.tsx  WhatsAppFab.tsx  AddToCartButton.tsx (client)
  cart/CartProvider.tsx (client)  cart/CartView.tsx (client)
lib/
  products/types.ts     Product
  products/parse.ts     parseProductsCsv
  products/source.ts    getProducts / getProduct / getCategories / getBrands
  catalog/query.ts      queryCatalog
  cart/cart.ts          чистая логика корзины
  whatsapp.ts           buildOrderMessage / buildSingleProductMessage / waLink
  format.ts             formatPrice
  config.ts             WHATSAPP_NUMBER, CONTACTS
data/products.csv
tests/                  *.test.ts (Vitest)  e2e/screens.spec.ts (Playwright)
```

---

### Task 1: Каркас проекта

**Files:**
- Delete: `index.html`
- Create: Next.js-приложение в корне (`package.json`, `tsconfig.json`, `next.config.ts`, `app/`, `vitest.config.ts`), `lib/config.ts`, `lib/format.ts`, `tests/format.test.ts`

**Interfaces:**
- Produces: `formatPrice(value: number): string`; `WHATSAPP_NUMBER: string`; `CONTACTS` (адрес, часы, телефоны, instagram, telegram).

- [ ] **Step 1:** `npx create-next-app@15 . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm` (после удаления `index.html`), добавить `vitest`, `@vitejs/plugin-react`, скрипт `"test": "vitest run"`.
- [ ] **Step 2: Failing test** `tests/format.test.ts`:
  `expect(formatPrice(13490)).toBe("13 490 ₸")`, `expect(formatPrice(500)).toBe("500 ₸")`, `expect(formatPrice(1250000)).toBe("1 250 000 ₸")`.
- [ ] **Step 3:** Run `npm test` → FAIL (module not found).
- [ ] **Step 4:** Implement `formatPrice` (группировка по 3 цифры вручную, без `Intl` — выход не зависит от ICU). `lib/config.ts`: `WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "77080503518"`, `CONTACTS` из Global Constraints и спеки.
- [ ] **Step 5:** `npm test` → PASS; `npm run build` → успешно.
- [ ] **Step 6:** Commit `chore: scaffold Next.js app`. Пуш → проверить, что Vercel-деплой зелёный (`gh api repos/ashimbekovd-dev/test/commits/main/status` → `success`).

### Task 2: Модель товара и парсер CSV

**Files:**
- Create: `lib/products/types.ts`, `lib/products/parse.ts`, `tests/parse.test.ts`, `tests/fixtures/products.csv`

**Interfaces:**
- Produces:
  ```ts
  type Product = { sku: string; name: string; nameRu?: string; brand: string; category: string;
    price: number; oldPrice?: number; volume?: string; description?: string; howToUse?: string;
    images: string[]; hit: boolean; inStock: boolean };
  type ParseResult = { products: Product[]; errors: { row: number; reason: string }[] };
  parseProductsCsv(csv: string): ParseResult
  ```

- [ ] **Step 1: Failing tests** `tests/parse.test.ts`:
  - корректная строка → все поля; `images` из `"a.jpg|b.jpg"` и из значения с переносом строки → `["a.jpg","b.jpg"]`;
  - цена `"13 490 ₸"`, `"13 490"`, `"13490,00"` → `13490`;
  - `old_price` ≤ `price` → `oldPrice` = `undefined`;
  - `hit`: `"да"`, `"Да"`, `"yes"`, `"1"` → `true`; пусто → `false`;
  - `in_stock`: `"нет"` → товар **не** в `products`; пусто → в наличии;
  - строка без `sku`/`name`/`price`/`images` → в `errors` с номером строки (считая заголовок строкой 1), в `products` нет;
  - дубликат `sku` → первая строка остаётся, вторая в `errors` с `reason` содержащим `"duplicate"`;
  - пробелы по краям значений обрезаются; заголовки нечувствительны к регистру.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement `parseProductsCsv` через `papaparse` (`header: true, skipEmptyLines: true`).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: product CSV parser`.

### Task 3: Перенос данных с piyolbeauty.kz

**Files:**
- Create: `data/products.csv`, `tests/data.test.ts`

**Interfaces:**
- Consumes: `parseProductsCsv` (Task 2).

- [ ] **Step 1: Failing test** `tests/data.test.ts`: читает `data/products.csv`, `parseProductsCsv` → `errors.length === 0`, `products.length >= 30`, у каждого `images[0]` начинается с `https://`, есть ≥ 5 разных категорий.
- [ ] **Step 2:** Собрать товары с piyolbeauty.kz через WebFetch (разделы каталога → страницы товаров): `sku` = slug товара со страницы, остальные поля по спеке §4; категории — названия из спеки §4. Неполные товары (нет цены/фото) не включать — записать их список в описание коммита.
- [ ] **Step 3:** `npm test` → PASS.
- [ ] **Step 4:** Commit `data: import catalog from piyolbeauty.kz`.

### Task 4: Источник данных и запросы каталога

**Files:**
- Create: `lib/products/source.ts`, `lib/catalog/query.ts`, `tests/query.test.ts`

**Interfaces:**
- Consumes: `Product`, `parseProductsCsv`.
- Produces:
  ```ts
  getProducts(): Promise<Product[]>          // fetch(PRODUCTS_CSV_URL, { next: { revalidate: 300 } }) или data/products.csv; errors → console.warn
  getProduct(sku: string): Promise<Product | undefined>
  getCategories(products: Product[]): string[]   // в порядке спеки §4, неизвестные — в конец по алфавиту
  getBrands(products: Product[]): string[]       // по алфавиту
  type CatalogQuery = { category?: string; brand?: string; q?: string; sort?: "default" | "price-asc" | "price-desc" };
  queryCatalog(products: Product[], query: CatalogQuery): Product[]
  parseCatalogQuery(params: Record<string, string | string[] | undefined>): CatalogQuery
  ```

- [ ] **Step 1: Failing tests** `tests/query.test.ts` (на фикстуре Task 2):
  - фильтр по `category` и `brand` (точное совпадение без учёта регистра);
  - `q` ищет по `name`, `nameRu`, `brand` без учёта регистра и ё/е (`"крем"` находит `"Крем"`);
  - сортировка `price-asc`/`price-desc`; `default` — сначала `hit`, затем исходный порядок;
  - неизвестная категория → `[]` (не исключение);
  - `parseCatalogQuery` с массивом значений берёт первое; неизвестный `sort` → `"default"`.
  - `getCategories` порядок: категории спеки впереди.
- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** Implement. **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: product source and catalog query`.

### Task 5: Корзина и сообщение WhatsApp (логика)

**Files:**
- Create: `lib/cart/cart.ts`, `lib/whatsapp.ts`, `tests/cart.test.ts`, `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: `Product`, `formatPrice`, `WHATSAPP_NUMBER`.
- Produces:
  ```ts
  type CartItem = { sku: string; qty: number };
  addItem(items: CartItem[], sku: string, qty?: number): CartItem[]   // суммирует, ограничивает 1..20
  setQty(items: CartItem[], sku: string, qty: number): CartItem[]     // qty<1 → удалить
  removeItem(items: CartItem[], sku: string): CartItem[]
  type CartLine = { product?: Product; sku: string; qty: number; available: boolean; lineTotal: number };
  resolveCart(items: CartItem[], products: Product[]): { lines: CartLine[]; total: number; count: number }
  type OrderForm = { name: string; delivery: "pickup" | "delivery"; address?: string; comment?: string };
  validateOrderForm(form: OrderForm): Record<string, string>   // пусто = ок; name обяз.; address обяз. при delivery
  buildOrderMessage(lines: CartLine[], total: number, form: OrderForm): string
  buildSingleProductMessage(p: Product): string
  waLink(text: string, number?: string): string
  ```

- [ ] **Step 1: Failing tests:**
  - `addItem` дважды по 15 → `qty === 20`; `setQty(…, 0)` удаляет;
  - `resolveCart`: товар отсутствует в `products` или не в наличии → `available: false`, `lineTotal: 0`, не входит в `total`, `count` считает только доступные;
  - `buildOrderMessage` для 2 позиций даёт **ровно** текст из спеки §6 (с `formatPrice`), недоступные позиции не попадают; без комментария строка «Комментарий» отсутствует; доставка → `Получение: доставка, адрес: …`;
  - `buildSingleProductMessage` → `Здравствуйте! Хочу заказать: <name> — <brand>[, <volume>], <price>`;
  - `waLink("a b\nc")` → `https://wa.me/77080503518?text=a%20b%0Ac`;
  - `validateOrderForm({name:" ", delivery:"pickup"})` → ошибка `name`; `delivery` без адреса → ошибка `address`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: cart logic and WhatsApp message`.

### Task 6: Дизайн-система, лейаут и CartProvider

**Files:**
- Create: `app/globals.css` (токены), `app/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/WhatsAppFab.tsx`, `components/cart/CartProvider.tsx`, `tests/cart-storage.test.ts`

**Interfaces:**
- Consumes: функции Task 5, `CONTACTS`, `WHATSAPP_NUMBER`.
- Produces: `useCart(): { items: CartItem[]; add(sku, qty?); setQty(sku, qty); remove(sku); clear(); count: number }`; `loadCart(storage?: Storage): CartItem[]`, `saveCart(items, storage?)` (экспорт из `CartProvider.tsx` или `lib/cart/storage.ts`).

- [ ] **Step 1: Failing test** `tests/cart-storage.test.ts`: `loadCart` с хранилищем, чей `getItem` бросает → `[]`; с мусорным JSON → `[]`; `saveCart` с бросающим `setItem` не бросает.
- [ ] **Step 2:** FAIL → implement `lib/cart/storage.ts` → PASS.
- [ ] **Step 3:** Загрузить skill `frontend-design`; задать токены по спеке §7 (молочный фон, пудрово-розовый и шалфейный акценты, графитовый текст), шрифты с кириллицей через `next/font/google` (заголовки с засечками, текст — гротеск). Header: лого, меню (Каталог, О бренде, Доставка, Контакты), поиск → `/catalog?q=`, иконка корзины со счётчиком; мобильное меню. Footer: контакты, соцсети. `WhatsAppFab` только < 768 px.
- [ ] **Step 4:** `npm run build` → успешно; `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: layout, design tokens, cart provider`.

### Task 7: Каталог и карточка товара

**Files:**
- Create: `components/Price.tsx`, `components/ProductCard.tsx`, `components/ProductGrid.tsx`, `components/CatalogFilters.tsx`, `components/AddToCartButton.tsx`, `app/catalog/page.tsx`, `app/product/[sku]/page.tsx`, `app/not-found.tsx`

**Interfaces:**
- Consumes: `getProducts`, `getProduct`, `getCategories`, `getBrands`, `queryCatalog`, `parseCatalogQuery`, `useCart`, `buildSingleProductMessage`, `waLink`, `formatPrice`.

- [ ] **Step 1:** `next.config.ts`: `images.remotePatterns` для домена фото piyolbeauty.kz; `ProductCard` использует `next/image` с `unoptimized` для URL вне разрешённых доменов (Review Focus 4). Фото 4:5.
- [ ] **Step 2:** `/catalog`: `export const revalidate = 300`; фильтры как ссылки/формы с состоянием в URL; пустой результат → «Ничего не нашли» + «Сбросить фильтры» (Review Focus 5).
- [ ] **Step 3:** `/product/[sku]`: `generateStaticParams` из `getProducts`; галерея, цена со скидкой, описание (абзацы по пустой строке), способ применения, `AddToCartButton`, «Заказать в WhatsApp», 4 похожих из той же категории; неизвестный `sku` → `notFound()`; `generateMetadata` с названием товара.
- [ ] **Step 4:** `npm run build` → успешно; `npm run dev` + `curl -s localhost:3000/catalog?category=нет-такой` → 200 и текст «Ничего не нашли»; `curl -o /dev/null -w "%{http_code}" localhost:3000/product/no-such-sku` → `404`.
- [ ] **Step 5:** Commit `feat: catalog and product pages`.

### Task 8: Главная, корзина и информационные страницы

**Files:**
- Create: `app/page.tsx`, `app/cart/page.tsx`, `components/cart/CartView.tsx`, `app/about/page.tsx`, `app/delivery/page.tsx`, `app/contacts/page.tsx`

**Interfaces:**
- Consumes: всё выше; `resolveCart`, `validateOrderForm`, `buildOrderMessage`, `waLink`.

- [ ] **Step 1:** Главная: первый экран со слоганом, плитки категорий (ссылки `/catalog?category=`), «Хиты» (`hit`, до 8), «Скидки» (`oldPrice`, до 8; блок скрыт, если пусто), блок о бренде, магазин в ТРЦ Forum.
- [ ] **Step 2:** `/cart`: `CartView` получает `products` с сервера, позиции через `resolveCart`, недоступные помечены «нет в наличии» с кнопкой удалить; форма по спеке §5; ошибки `validateOrderForm` под полями; кнопка открывает `waLink(buildOrderMessage(...))` в новой вкладке; «Очистить корзину»; пустая корзина → ссылка в каталог.
- [ ] **Step 3:** `/about`, `/delivery`, `/contacts` — тексты с piyolbeauty.kz (WebFetch соответствующих страниц), карта на контактах — ссылка на 2ГИС/Google Maps, без встраиваемого скрипта.
- [ ] **Step 4:** `npm run build` → успешно; `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: home, cart and info pages`.

### Task 9: Проверка, Google Таблица, деплой

**Files:**
- Create: `tests/e2e/screens.spec.ts`, `playwright.config.ts`

- [ ] **Step 1:** Playwright (Chromium из `/opt/pw-browsers/chromium`): скриншоты `/`, `/catalog`, первой карточки товара, `/cart` с 2 товарами на 390×844 и 1440×900; тест падает, если `document.documentElement.scrollWidth > innerWidth`. Просмотреть скриншоты, исправить вёрстку.
- [ ] **Step 2:** Lighthouse mobile на production-сборке (`npx lighthouse` по `npm start`) для `/` и `/catalog` → Performance и Accessibility ≥ 90; исправить, если ниже.
- [ ] **Step 3:** Создать Google Таблицу «PIYOL' — товары» из `data/products.csv` на Google Drive пользователя; передать ссылку и инструкцию публикации в CSV. Когда пользователь пришлёт CSV-ссылку — задать `PRODUCTS_CSV_URL` в Vercel (через панель, т.к. коннектор без доступа к команде) и проверить, что изменение цены видно ≤ 5 мин.
- [ ] **Step 4:** Пуш, деплой `success` в статусах GitHub; открыть production-URL и пройти сценарий: каталог → товар → корзина → «Отправить в WhatsApp» (проверить текст ссылки).
- [ ] **Step 5:** Commit `test: visual and e2e checks`.
