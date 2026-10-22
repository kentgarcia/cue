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

test("quiz waits for audience votes, reveals on command, and reverses without leaking the answer", async ({ page }) => {
  await page.goto("/");
  await open(page, 12, 24);
  await expect(player(page).getByTestId("quiz-answer")).toHaveCount(0);
  await page.waitForTimeout(1300);
  await hold(page, 24);
  await expect(player(page).getByTestId("quiz-answer")).toHaveCount(0);
  await player(page).click();
  await hold(page, 120);
  await expect(player(page).getByTestId("quiz-answer")).toContainText("FACT.");
  await page.keyboard.press("ArrowLeft");
  await hold(page, 24);
  await expect(player(page).getByTestId("quiz-answer")).toHaveCount(0);
  await player(page).click();
  await hold(page, 120);
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 24);
  await expect(player(page).getByTestId("quiz-answer")).toHaveCount(0);
});

test("champion and Japan photos reveal together with centered orange titles", async ({ page }) => {
  await page.goto("/");
  for (const [number, testId] of [[13, "award-photo"], [14, "arrival-photo"]] as const) {
    await open(page, number, 24);
    const photo = player(page).getByTestId(testId);
    const caption = photo.locator("[data-photo-caption]");
    await expect(caption).toBeVisible();
    await expect(caption).toHaveText(number === 13 ? "CHAMPION — 2025" : "JAPAN · July 2026");
    await expect(caption).toHaveCSS("font-size", "54px");
    await expect(caption).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(caption).toHaveCSS("background-image", "linear-gradient(135deg, rgb(255, 173, 50), rgb(255, 116, 29) 43%, rgb(255, 142, 36))");
    await expect(page.getByRole("button", { name: /^Seek to cue / })).toHaveCount(1);
    await expect(photo).toHaveAttribute("aria-hidden", "false");
    await expect(photo).toHaveCSS("opacity", "1");
    const image = photo.locator("img");
    await expect(image).toHaveAttribute("src", `/media/journey/${number === 13 ? "champion" : "japan"}.png`);
    await expect(image).toHaveCSS("object-fit", "cover");
    expect(await image.evaluate(element => {
      const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
      const bounds = element.getBoundingClientRect();
      return element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0 && (["left", "top", "right", "bottom"] as const).every(edge => Math.abs(bounds[edge] - canvas[edge]) < 1);
    })).toBe(true);
    await player(page).screenshot({ path: `test-results/slide-${number}-full-screen.png` });
    await player(page).click();
    await expect(player(page)).toHaveAttribute("data-slide", number === 13 ? "chapter-04-destination" : "chapter-04-science");
  }
});

test("Chapters 03–04 fit the canvas, respect reduced motion, and continue to Chapter 05", async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (const reduced of [false, true]) {
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    for (const [number, entry, final] of [[8, 90, 90], [9, 54, 252], [10, 54, 336], [11, 48, 432], [12, 24, 120], [13, 24, 24], [14, 24, 24], [15, 24, 72], [16, 36, 36]]) {
      await open(page, number!, entry!);
      if (entry !== final) {
        await page.getByRole("button", { name: /^Seek to cue / }).last().click();
        await hold(page, final!);
      }
      const fits = await player(page).evaluate((element) => {
        const canvas = element.getBoundingClientRect();
        return [...element.querySelectorAll("h1, p, [data-media]")].every((text) => {
          const bounds = text.getBoundingClientRect();
          return bounds.left >= canvas.left - 1 && bounds.right <= canvas.right + 1 && bounds.top >= canvas.top - 1 && bounds.bottom <= canvas.bottom + 1 && text.scrollWidth <= text.clientWidth + 1;
        });
      });
      expect(fits, `slide ${number}, reduced motion ${reduced}`).toBe(true);
      if (reduced) {
        expect(await player(page).locator('[aria-hidden="false"]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transform === "none"))).toBe(true);
      }
      if (number === 16) {
        await expect(player(page).getByTestId("interview-0")).toHaveCSS("transform", reduced ? "none" : "matrix(1, 0, 0, 1, 0, 0)");
      }
    }
  }
  await page.waitForTimeout(300);
  await hold(page, 36);
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-04-human");
  await player(page).click();
  await hold(page, 30);
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-05-international");
  expect(errors).toEqual([]);
});

test("chapter review sheets render all cue holds for visual inspection", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const chapter of [3, 4]) {
    await page.goto(`/tests/chapter-preview.html?chapter${chapter}`);
    await expect(page.locator('[data-review-ready=true]')).toBeVisible();
    await expect(page.locator(".review-frame").last()).toBeVisible();
    await page.screenshot({ path: `test-results/chapter-0${chapter}-review.png`, fullPage: true });
  }
});

test("science photos fill three blended columns with matching bottom titles", async ({ page }) => {
  await page.goto("/");
  await open(page, 15, 24);
  const stage = player(page);
  await expect(stage).not.toContainText("Science beyond the classroom.");
  await expect(stage.getByTestId("science-photo-0")).toHaveCSS("opacity", "1");
  await expect(stage.getByTestId("science-photo-1")).toHaveCSS("opacity", "0");
  await expect(stage.getByTestId("science-caption-1")).toHaveCSS("opacity", "0");
  await stage.click();
  await hold(page, 48);
  await expect(stage.getByTestId("science-photo-1")).toHaveCSS("opacity", "1");
  await expect(stage.getByTestId("science-photo-2")).toHaveCSS("opacity", "0");
  await stage.click();
  await hold(page, 72);
  for (const [index, name] of ["museum", "equipment", "facility"].entries()) {
    const photo = stage.getByTestId(`science-photo-${index}`);
    await expect(photo).toHaveCSS("opacity", "1");
    await expect(photo.locator("img")).toHaveAttribute("src", `/media/journey/${name}.jpg`);
    await expect(photo.locator("[data-placeholder=true]")).toHaveCount(0);
    await expect(stage.getByTestId(`science-caption-${index}`).locator("h1")).toHaveCSS("color", "rgb(255, 255, 255)");
    if (index > 0) await expect(photo).toHaveCSS("mask-image", "linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0) 192px)");
  }
  expect(await stage.getByTestId("science-columns").evaluate(element => {
    const canvas = element.getBoundingClientRect();
    const columns = [...element.querySelectorAll('[data-testid^="science-photo-"]')].map(photo => photo.getBoundingClientRect());
    const captions = [...element.querySelectorAll("[data-photo-caption]")].map(title => title.getBoundingClientRect());
    return columns.every(photo => Math.abs(photo.top - canvas.top) < 1 && Math.abs(photo.bottom - canvas.bottom) < 1)
      && Math.abs(columns[0]!.left - canvas.left) < 1 && Math.abs(columns[2]!.right - canvas.right) < 1
      && columns[0]!.right > columns[1]!.left && columns[1]!.right > columns[2]!.left
      && captions.every((title, index) => Math.abs((title.left + title.right) / 2 - canvas.left - canvas.width * (index + .5) / 3) < 1);
  })).toBe(true);
  await stage.screenshot({ path: "test-results/slide-15-blended-columns.png" });
  await page.keyboard.press("ArrowLeft");
  await hold(page, 48);
  await expect(stage.getByTestId("science-photo-2")).toHaveCSS("opacity", "0");
});

test("resident interviews fill two blended columns with one centered title", async ({ page }) => {
  for (const reduced of [false, true]) {
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    await page.goto("/");
    await open(page, 16, 36);
    const stage = player(page);
    await expect(stage.locator("[data-photo-caption]")).toHaveCount(1);
    const caption = stage.getByRole("heading", { name: "Behind every scientific issue are real people.", exact: true });
    await expect(caption).toBeVisible();
    await expect(caption).toHaveCSS("color", "rgb(255, 255, 255)");
    for (const index of [0, 1]) {
      const photo = stage.getByTestId(`interview-${index}`);
      await expect(photo).toHaveCSS("opacity", "1");
      await expect(photo.locator("img")).toHaveAttribute("src", `/media/journey/interview-${index + 1}.jpg`);
      await expect(photo.locator("[data-placeholder=true]")).toHaveCount(0);
      if (reduced) await expect(photo).toHaveCSS("transform", "none");
    }
    await expect(stage.getByTestId("interview-1")).toHaveCSS("mask-image", "linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0, 0, 0) 192px)");
    expect(await stage.getByTestId("interview-columns").evaluate(element => {
      const canvas = element.getBoundingClientRect();
      const left = element.querySelector('[data-testid="interview-0"]')!.getBoundingClientRect();
      const right = element.querySelector('[data-testid="interview-1"]')!.getBoundingClientRect();
      const title = element.querySelector("[data-photo-caption]")!.getBoundingClientRect();
      return [left, right].every(photo => Math.abs(photo.top - canvas.top) < 1 && Math.abs(photo.bottom - canvas.bottom) < 1)
        && Math.abs(left.left - canvas.left) < 1 && Math.abs(right.right - canvas.right) < 1 && left.right > right.left
        && Math.abs((title.left + title.right) / 2 - (canvas.left + canvas.right) / 2) < 1 && title.bottom < canvas.bottom;
    })).toBe(true);
    if (!reduced) await stage.screenshot({ path: "test-results/slide-16-blended-columns.png" });
  }
});
