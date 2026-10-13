import { test, expect } from "@playwright/test";

const PAGES = ["/", "/catalog", "/product/ACTIVE-HYDRA-MOIST-SERUM", "/cart", "/about", "/delivery", "/contacts"];

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
