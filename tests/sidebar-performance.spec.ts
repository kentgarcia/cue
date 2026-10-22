import { test, expect } from "@playwright/test";

const stage = (page: import("@playwright/test").Page) => page.getByTestId("presentation-player");

test("sidebar stays within the viewport and only mounts nearby previews", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const requested: string[] = [];
  page.on("request", request => requested.push(request.url()));
  await page.goto("/");
  await expect(stage(page)).toHaveAttribute("data-frame", "30");
  const list = page.getByRole("region", { name: "Slides", exact: true });
  const sidebar = page.getByRole("complementary", { name: "Slide navigation" });
  await expect(sidebar.getByRole("button", { name: /^Go to slide / })).toHaveCount(21);
  await expect(list).toHaveCSS("overflow-y", "auto");
  const geometry = await sidebar.evaluate(element => {
    const list = element.querySelector(".slide-list")!;
    return { height: element.getBoundingClientRect().height, viewport: innerHeight, scrollable: list.scrollHeight > list.clientHeight };
  });
  expect(geometry.height).toBeLessThanOrEqual(geometry.viewport - 77);
  expect(geometry.scrollable).toBe(true);
  await page.waitForTimeout(300);
  expect(await sidebar.locator("[data-slide-frame]").count()).toBeLessThan(10);
  expect(requested.some(url => /journey|\/optimized\/(champion|international|japan)\./.test(url))).toBe(false);
  const before = await page.evaluate(() => scrollY);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("End");
  await expect(stage(page)).toHaveAttribute("data-frame", "163");
  const selected = sidebar.getByRole("button", { name: /^Go to slide 21:/ });
  await expect(selected).toHaveAttribute("aria-current", "step");
  await expect(selected.locator("[data-slide-frame]")).toHaveCount(1);
  expect(await list.evaluate(element => element.scrollTop)).toBeGreaterThan(1000);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(sidebar.getByRole("button", { name: /^Go to slide 1:/ }).locator("[data-slide-frame]")).toHaveCount(0);
  expect(await sidebar.locator("[data-slide-frame]").count()).toBeLessThan(10);
  await page.screenshot({ path: "test-results/sidebar-scrolling.png" });
  await page.getByRole("button", { name: "Hide slide sidebar", exact: true }).click();
  await expect(sidebar).toHaveCount(0);
  await page.getByRole("button", { name: "Show slide sidebar", exact: true }).click();
  await expect(sidebar.getByRole("button", { name: /^Go to slide 21:/ })).toHaveAttribute("aria-current", "step");
});

test("mobile navigation remains a compact horizontal strip", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(stage(page)).toHaveAttribute("data-frame", "30");
  const list = page.getByRole("region", { name: "Slides", exact: true });
  await expect(list).toHaveCSS("overflow-x", "auto");
  expect(await list.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: /^Go to slide 13:/ }).click();
  await expect(stage(page)).toHaveAttribute("data-slide", "chapter-03-achievement");
  await expect(stage(page)).toHaveAttribute("data-frame", "24");
  expect(await list.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  expect(await page.locator(".slide-card [data-slide-frame]").count()).toBeLessThan(9);
});

test("large images use compressed sources while retaining original editable URLs", async ({ page }) => {
  const originals: string[] = [];
  page.on("request", request => { if (/\/media\/(journey\/champion|atomiq\/(phone|icon))\.png$/.test(request.url())) originals.push(request.url()); });
  await page.goto("/");
  await page.getByRole("button", { name: /^Go to slide 13:/ }).click();
  await expect(stage(page)).toHaveAttribute("data-frame", "24");
  const photo = stage(page).getByTestId("award-photo").locator("img");
  await expect(photo).toHaveAttribute("src", "/media/journey/champion.png");
  await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).currentSrc)).toMatch(/\/media\/optimized\/champion\.[a-f0-9]+\.webp$/);
  await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("button", { name: /^Go to slide 8:/ }).click();
  await expect(stage(page)).toHaveAttribute("data-frame", "90");
  const phone = stage(page).getByTestId("atomiq-phone");
  await expect.poll(() => phone.evaluate(image => (image as HTMLImageElement).currentSrc)).toMatch(/\/media\/optimized\/phone\.[a-f0-9]+\.webp$/);
  expect(originals).toEqual([]);
});
