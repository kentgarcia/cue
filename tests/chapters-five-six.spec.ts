import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const player = (page: Page) => page.getByTestId("presentation-player");
async function hold(page: Page, frame: number) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame));
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
  await expect(player(page).locator("[data-slide-frame]")).toHaveAttribute("data-slide-frame", String(frame));
}
async function open(page: Page, number: number, frame: number) {
  await page.getByRole("button", { name: new RegExp(`Go to slide ${number}:`) }).click();
  await hold(page, frame);
}

test("international chapter uses a full-screen media slot, large counts, and the result", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Go to slide .*Bringing the experience home/ })).toHaveCount(0);
  await open(page, 17, 30);
  await expect(page.locator(".demo-badge")).toHaveText("CHAPTER 05");
  await expect(player(page).getByRole("heading")).toHaveText("The InternationalStage.");
  expect(await player(page).evaluate((element) => {
    const canvas = element.getBoundingClientRect();
    const media = element.querySelector("[data-media]")!.getBoundingClientRect();
    return Math.abs(canvas.width - media.width) < 1 && Math.abs(canvas.height - media.height) < 1;
  })).toBe(true);
  await expect(player(page).locator('img[src="/media/journey/international.png"]')).toBeVisible();
  await expect(player(page).locator('[data-placeholder="true"]')).toHaveCount(0);
  await player(page).screenshot({ path: "test-results/slide-17-international.png" });
  await expect(page.getByRole("tabpanel")).toContainText("ANENT Myth Smashers International Finals");
  await open(page, 18, 24);
  await expect(player(page).getByTestId("competition-teams")).toContainText("17");
  await expect(player(page).getByTestId("competition-countries")).toHaveCSS("opacity", "0");
  await player(page).click();
  await hold(page, 48);
  await expect(player(page).getByTestId("competition-countries")).toHaveCSS("opacity", "1");
  await open(page, 19, 36);
  await expect(player(page).getByRole("heading")).toContainText("2ND");
  await expect(player(page).getByRole("heading")).toContainText("PLACE.");
});

test("closing restores branding, automatically transitions to the animated QR, and holds for scanning", async ({ page }) => {
  await page.goto("/");
  await open(page, 21, 24);
  for (const [frame, count] of [[24, 1], [48, 2], [72, 3]]) {
    if (frame !== 24) await player(page).click();
    await hold(page, frame!);
    await expect(player(page).locator('[data-testid^="closing-line-"]')).toHaveCount(count!);
    await expect(player(page).getByTestId("closing-brand")).toHaveCount(0);
  }
  await player(page).click();
  await expect(player(page).locator('[data-atomiq-entrance="settled"]')).toBeVisible({ timeout: 7000 });
  await expect(player(page).getByTestId("atomiq-tagline")).toHaveText("When facts are clear, there’s nothing to fear.");
  await expect(player(page).getByTestId("promotional-qr")).toHaveCount(0);
  await player(page).screenshot({ path: "test-results/closing-brand-before-qr.png" });
  // No presenter action between branding and the QR slide.
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-06-discover", { timeout: 8000 });
  await hold(page, 72);
  const qr = player(page).getByTestId("promotional-qr");
  await expect(qr).toHaveAttribute("src", "/media/atomiq/promo-qr.svg");
  await expect(qr.locator("..")).toHaveAttribute("href", "https://atomiq-pi.vercel.app/");
  await expect(player(page).getByRole("heading", { name: "Curiosity starts here." })).toBeVisible();
  const bounds = await qr.boundingBox();
  const canvas = await player(page).boundingBox();
  expect(bounds!.width / canvas!.width).toBeGreaterThan(0.4);
  const mascot = player(page).locator(".promo-finale__mascot");
  const before = await mascot.evaluate(element => getComputedStyle(element).transform);
  await page.waitForTimeout(700);
  expect(await qr.boundingBox()).toEqual(bounds);
  expect(await mascot.evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  await hold(page, 72);
  await expect(page.getByRole("button", { name: "Next checkpoint or slide", exact: true })).toBeDisabled();
  await player(page).screenshot({ path: "test-results/closing-website-qr.png" });
  await qr.screenshot({ path: "test-results/promotional-qr-rendered.png" });
  await page.keyboard.press("ArrowLeft");
  await hold(page, 0);
  await page.keyboard.press("ArrowLeft");
  await hold(page, 253);
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-06-closing");
  await page.waitForTimeout(400);
  await hold(page, 253);
  await page.keyboard.press("ArrowLeft");
  await hold(page, 72);
  await expect(player(page).locator('[data-testid^="closing-line-"]')).toHaveCount(3);
});

test("new slides fit the canvas and closing remains still in reduced motion", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const [number, frame] of [[17, 30], [18, 24], [19, 36], [20, 30], [21, 24], [22, 72]]) {
    await open(page, number!, frame!);
    if (number === 18 || number === 21) {
      await page.getByRole("button", { name: /^Seek to cue / }).last().click();
      await hold(page, number === 18 ? 48 : 253);
    }
    expect(await player(page).evaluate((element) => {
      const canvas = element.getBoundingClientRect();
      return [...element.querySelectorAll("h1, p, [data-media]")].every((text) => {
        const bounds = text.getBoundingClientRect();
        return bounds.left >= canvas.left - 1 && bounds.right <= canvas.right + 1 && bounds.top >= canvas.top - 1 && bounds.bottom <= canvas.bottom + 1 && text.scrollWidth <= text.clientWidth + 1;
      });
    }), `slide ${number}`).toBe(true);
    expect(await player(page).locator('[aria-hidden="false"]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transform === "none"))).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("review sheets include the new chapters and closing transition", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const chapter of [5, 6]) {
    await page.goto(`/tests/chapter-preview.html?chapter${chapter}`);
    await expect(page.locator('[data-review-ready=true]')).toBeVisible();
    await expect(page.locator(".review-frame").last()).toBeVisible();
    await page.screenshot({ path: `test-results/chapter-0${chapter}-review.png`, fullPage: true });
  }
});
