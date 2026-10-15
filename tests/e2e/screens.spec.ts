import { expect, test } from "@playwright/test";

const PAGES = ["/", "/catalog", "/catalog?category=нет-такой", "/about", "/delivery", "/contacts", "/cart"];

for (const path of PAGES) {
  test(`без горизонтального скролла: ${path}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/screens/${info.project.name}${path.replace(/\W+/g, "_")}.png` });
  });
}

test("каталог → товар → корзина → сообщение WhatsApp", async ({ page }) => {
  await page.goto("/catalog", { waitUntil: "domcontentloaded" });
  const first = page.locator('main a[href^="/product/"]').first();
  const name = (await first.textContent())?.trim() ?? "";
  await first.click();
  await page.getByRole("button", { name: "В корзину" }).click();
  await page.getByRole("link", { name: /Корзина, товаров: 1/ }).click();
  await expect(page).toHaveURL(/\/cart$/);

  await page.evaluate(() => {
    (window as unknown as { __opened?: string }).__opened = undefined;
    window.open = ((url: string) => {
      (window as unknown as { __opened?: string }).__opened = url;
      return null;
    }) as typeof window.open;
  });
  await page.getByRole("button", { name: "Отправить заказ в WhatsApp" }).click();
  await expect(page.getByText("Укажите имя")).toBeVisible();

  await page.getByLabel("Имя").fill("Айгерим");
  await page.getByRole("button", { name: "Отправить заказ в WhatsApp" }).click();
  const opened = await page.evaluate(() => (window as unknown as { __opened?: string }).__opened);
  expect(opened).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  const text = decodeURIComponent(opened!.split("text=")[1]);
  expect(text).toContain(name);
  expect(text).toContain("Имя: Айгерим");
});

test("неизвестный товар → 404", async ({ page }) => {
  const res = await page.goto("/product/no-such-sku");
  expect(res?.status()).toBe(404);
});
