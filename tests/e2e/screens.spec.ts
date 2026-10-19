import { test, expect } from "@playwright/test";

const PAGES = ["/", "/catalog", "/product/ACTIVE-HYDRA-MOIST-SERUM", "/product/INTENSE-PURIFYING-ACNE-SERUM", "/lines/intense-purifying-acne", "/lines/active-hydra-moist", "/product/BIO-CELL-EXTRA-COLLAGEN-BOOSTER-CREAM", "/cart", "/about", "/delivery", "/contacts"];

for (const path of PAGES) {
  test(`no horizontal scroll on ${path}`, async ({ page }, info) => {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
    await page.screenshot({ path: `test-results/shots/${info.project.name}${path.replace(/\W+/g, "_")}.png` });
  });
}

test("catalog → product → cart → WhatsApp message", async ({ page }) => {
  // wa.me is not reachable from CI; record the URL the site tries to open instead.
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = (u?: string | URL) => { (window as unknown as { __opened: string[] }).__opened.push(String(u)); return null; };
  });
  await page.goto("/catalog?category=" + encodeURIComponent("Линии ухода PIYOL'"));
  await page.getByRole("link", { name: "Active Hydra-Moist Serum", exact: true }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Active Hydra-Moist Serum");
  const add = page.getByRole("button", { name: /В корзину|Добавлено/ }).first();
  await add.click();
  await expect(add).toHaveText("Добавлено");
  await add.click();
  await page.goto("/cart");
  await expect(page.getByText("Итого:")).toContainText("29\u00a0980\u00a0₸");

  // Empty name is rejected before WhatsApp opens.
  await page.getByRole("button", { name: "Отправить заказ в WhatsApp" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Укажите имя" })).toBeVisible();
  await expect(page.getByLabel("Ваше имя")).toBeFocused();

  await page.getByLabel("Ваше имя").fill("Айгерим");
  await page.getByRole("button", { name: "Отправить заказ в WhatsApp" }).click();
  const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
  expect(opened).toHaveLength(1);
  const url = new URL(opened[0]);
  expect(url.origin + url.pathname).toBe("https://wa.me/77080503518");
  const text = url.searchParams.get("text") ?? "";
  expect(text).toContain("1) PIYOL' Active Hydra-Moist Serum — PIYOL', 50 мл — 2 шт × 14\u00a0990\u00a0₸");
  expect(text).toContain("Итого: 29\u00a0980\u00a0₸");
  expect(text).toContain("Имя: Айгерим");
});

test("cart survives blocked localStorage", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/product/ACTIVE-HYDRA-MOIST-SERUM");
  await page.getByRole("button", { name: "В корзину" }).first().click();
  await expect(page.getByRole("link", { name: /Корзина, товаров: 1/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("задача кожи → каталог; линия → весь ритуал в корзину", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Упругость и морщины/ }).first().click();
  await expect(page).toHaveURL(/concern=firmness/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Упругость и морщины");

  await page.goto("/lines/active-hydra-moist");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Active Hydra-Moist");
  await page.getByRole("button", { name: /Весь ритуал в корзину/ }).click();
  await expect(page.getByRole("link", { name: /Корзина, товаров: 5/ })).toBeVisible();
});

test("тест подбора → программа → в корзину; корзина предлагает дополнить ритуал", async ({ page }) => {
  await page.goto("/quiz");
  for (const answer of ["42–55", "Морщины, потеря упругости", "Комфортная", "Нет, ухаживаю дома", "Не хочу, ищу мягкую альтернативу"]) {
    await page.getByRole("button", { name: answer }).click();
  }
  await expect(page.getByRole("heading", { level: 2, name: "Упругость и морщины" })).toBeVisible();
  await expect(page.getByText(/Основа: ритуал Bio Cell Extra Collagen/)).toBeVisible();
  await page.getByRole("button", { name: /Начать с главного/ }).click();
  await page.getByRole("link", { name: "Оформить заказ" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole("heading", { name: /Дополните ритуал Bio Cell Extra Collagen/ })).toBeVisible();
});

test("панель покупки появляется на телефоне после прокрутки", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "только для телефона");
  await page.goto("/product/ACTIVE-HYDRA-MOIST-SERUM");
  const bar = page.locator(".buy-bar");
  await expect(bar).toHaveAttribute("aria-hidden", "true");
  await page.evaluate(() => scrollTo(0, 1600));
  await expect(bar).toHaveAttribute("aria-hidden", "false");
});

test("кейсы до/после: открываются крупно и ведут к ритуалу", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Открыть фото: Bio Cell Extra Collagen/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Смотреть ритуал" }).click();
  await expect(page).toHaveURL(/\/lines\/bio-cell-extra-collagen$/);
  await expect(page.getByRole("heading", { name: "До и после" })).toBeVisible();
});

test("отзывы с Kaspi: скриншоты открываются на сайте", async ({ page }) => {
  await page.goto("/lines/intense-purifying-acne");
  await expect(page.getByRole("heading", { name: "Отзывы покупательниц" })).toBeVisible();
  await expect(page.getByText("21 отзыв покупательниц на Kaspi.kz")).toBeVisible();
  await page.getByRole("button", { name: "Смотреть скриншоты с Kaspi" }).click();
  const dialog = page.getByRole("dialog", { name: "Скриншоты отзывов с Kaspi.kz" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveCount(7);
  await dialog.getByRole("button", { name: "Закрыть" }).click();
  await expect(dialog).toBeHidden();
  expect(page.url()).toContain("/lines/intense-purifying-acne");
});
