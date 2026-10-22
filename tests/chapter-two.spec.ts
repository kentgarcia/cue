import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const player = (page: Page) => page.getByTestId("presentation-player");
async function hold(page: Page, frame: number) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame));
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
  await expect(player(page).locator("[data-slide-frame]")).toHaveAttribute("data-slide-frame", String(frame));
}
async function openSlide(page: Page, number: number, frame: number) {
  await page.getByRole("button", { name: new RegExp(`Go to slide ${number}:`) }).click();
  await hold(page, frame);
}

test("Chapter 02 reveals full-height image columns over centered NUCLEAR and reverses exact cues", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await openSlide(page, 4, 14);
  await expect(page.locator(".demo-badge")).toHaveText("CHAPTER 02");
  await expect(page.locator(".slide-heading .eyebrow")).toContainText("THE CHALLENGE");
  const visible = player(page).locator('[data-testid^="association-"][aria-hidden="false"]');
  const center = await player(page).locator("h1").evaluate(element => {
    const title = element.getBoundingClientRect();
    const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
    return { x: title.x + title.width / 2 - canvas.x - canvas.width / 2, y: title.y + title.height / 2 - canvas.y - canvas.height / 2 };
  });
  expect(Math.abs(center.x)).toBeLessThan(1);
  expect(Math.abs(center.y)).toBeLessThan(1);
  await expect(player(page).locator('[data-testid^="association-"]')).not.toContainText(["Bombs.", "Radiation.", "Disasters."]);
  await expect(visible).toHaveCount(0);
  await expect(player(page).getByTestId("nuclear-red-background")).toHaveCSS("opacity", "0");
  await player(page).click();
  await hold(page, 31);
  await expect(visible).toHaveCount(0);
  await expect(player(page).getByTestId("nuclear-red-background")).toHaveCSS("opacity", "1");
  for (const [index, frame] of [48, 65, 82].entries()) {
    await player(page).click();
    await hold(page, frame);
    await expect(visible).toHaveCount(index + 1);
    const column = visible.nth(index);
    const image = column.locator("img");
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const canvas = (await player(page).boundingBox())!;
    const bounds = (await column.boundingBox())!;
    expect(Math.abs(bounds.width - canvas.width / 3)).toBeLessThan(1);
    expect(Math.abs(bounds.height - canvas.height)).toBeLessThan(1);
    expect(Math.abs(bounds.x - (canvas.x + index * canvas.width / 3))).toBeLessThan(1);
    expect(Math.abs(bounds.y - canvas.y)).toBeLessThan(1);
    await expect(image).toHaveCSS("object-fit", "cover");
    await player(page).screenshot({ path: `test-results/nuclear-column-${index + 1}.png` });

    await page.waitForTimeout(120);
    await hold(page, frame);
  }
  await expect(player(page).getByRole("heading", { name: "NUCLEAR.", exact: true })).toHaveCount(0);
  await page.keyboard.press("ArrowLeft");
  await hold(page, 65);
  await expect(visible).toHaveCount(2);
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 14);
  await expect(visible).toHaveCount(0);
  await expect(player(page).getByTestId("nuclear-red-background")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test("four real comic panels reveal independently and the final question stands alone", async ({ page }) => {
  await page.goto("/");
  await openSlide(page, 5, 14);
  await expect(player(page).getByRole("heading", { name: "What comes to mind?", exact: true })).toBeVisible();
  const visible = player(page).locator('[data-comic-panel] [data-testid^="fiction-"][aria-hidden="false"]');
  await expect(visible).toHaveCount(0);
  const names = ["Teenage Mutant Ninja Turtles", "Hulk", "Gagamboy", "The Powerpuff Girls"];
  for (const [index, frame] of [31, 48, 65, 82].entries()) {
    await player(page).click();
    await hold(page, frame);
    await expect(visible).toHaveCount(index + 1);
    const image = visible.nth(index).getByRole("img", { name: names[index]!, exact: true });
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(image).toHaveCSS("object-fit", "cover");
    await expect(player(page).getByTestId("fiction-question")).toHaveCSS("opacity", "0");
    await player(page).screenshot({ path: `test-results/comic-panel-${index + 1}.png` });
  }
  await expect(player(page).locator("figcaption, [data-placeholder=true]")).toHaveCount(0);
  const panels = await player(page).locator("[data-comic-panel]").evaluateAll(elements => elements.map(element => {
    const bounds = element.getBoundingClientRect();
    const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
    return { height: bounds.height, canvasHeight: canvas.height, clip: getComputedStyle(element).clipPath };
  }));
  for (const panel of panels) {
    expect(Math.abs(panel.height - panel.canvasHeight)).toBeLessThan(1);
    expect(panel.clip).toMatch(/^polygon/);
  }
  await page.keyboard.press("ArrowLeft");
  await hold(page, 65);
  await expect(visible).toHaveCount(3);
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 14);
  await expect(visible).toHaveCount(0);
  await expect(player(page).getByRole("heading", { name: "What comes to mind?", exact: true })).toBeVisible();
  await openSlide(page, 7, 24);
  await expect(player(page).getByRole("heading", { name: "What if we could change the way people see nuclear science?" })).toBeVisible();
  await expect(player(page).locator("img, svg, [data-media]")).toHaveCount(0);
  await player(page).click();
  await hold(page, 90);
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-03-meet");
});

test("opportunity uses the real local poster and survives a missing media asset", async ({ page }) => {
  await page.goto("/");
  await openSlide(page, 6, 24);
  const image = player(page).getByRole("img", { name: "Myth Smashers competition announcement", exact: true });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await image.evaluate((element) => {
    const imageBounds = element.getBoundingClientRect();
    const mediaBounds = element.parentElement!.getBoundingClientRect();
    return imageBounds.width <= mediaBounds.width + 1 && imageBounds.height <= mediaBounds.height + 1;
  })).toBe(true);
  await expect(image).toHaveAttribute("src", "/media/slide-6/poster.png");
  await expect(player(page).locator("h1")).toHaveCount(0);
  const bounds = (await image.boundingBox())!;
  const canvas = (await player(page).boundingBox())!;
  expect(Math.abs(bounds.width - canvas.width)).toBeLessThan(1);
  expect(Math.abs(bounds.height - canvas.height)).toBeLessThan(1);
  expect(Math.abs(bounds.x - canvas.x)).toBeLessThan(1);
  expect(Math.abs(bounds.y - canvas.y)).toBeLessThan(1);
  await player(page).screenshot({ path: "test-results/slide-6-poster.png" });
  await page.route("**/media/slide-6/poster.png", (route) => route.abort());
  await page.reload();
  await openSlide(page, 6, 24);
  await expect(player(page).getByRole("img", { name: "Image placeholder: Myth Smashers competition announcement", exact: true })).toBeVisible();
  await expect(page.locator(".player-error")).toHaveCount(0);
});

test("Chapter 02 respects reduced motion and keeps the final question centered", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openSlide(page, 7, 24);
  await expect(player(page).locator("[data-kinetic-type] h1").first()).toHaveCSS("transform", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const centerOffset = await player(page).evaluate((element) => {
    const canvas = element.getBoundingClientRect();
    const text = element.querySelector("h1")!.getBoundingClientRect();
    return Math.abs((text.left + text.right) / 2 - (canvas.left + canvas.right) / 2);
  });
  expect(centerOffset).toBeLessThan(1);
});

test("Chapter 02 has centered, contained typography and reviewable motion frames", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1080 });
  await page.goto("/");
  for (const [number, entry, final] of [[4, 14, 82], [5, 14, 82], [6, 24, 24], [7, 24, 24]]) {
    await openSlide(page, number!, entry!);
    if (number === 4) {
      await page.getByRole("button", { name: "Seek to cue 5: Disasters", exact: true }).click();
      await hold(page, final!);
    }
    if (number === 5) {
      await page.getByRole("button", { name: "Seek to cue 5: Powerpuff Girls", exact: true }).click();
      await hold(page, final!);
    }
    const fits = await player(page).evaluate((element) => {
      const canvas = element.getBoundingClientRect();
      return [...element.querySelectorAll("h1, figcaption")].every((text) => {
        const bounds = text.getBoundingClientRect();
        return bounds.left >= canvas.left && bounds.right <= canvas.right + 1 && bounds.top >= canvas.top && bounds.bottom <= canvas.bottom + 1 && text.scrollWidth <= text.clientWidth + 1 && getComputedStyle(text).textAlign === "center";
      });
    });
    expect(fits).toBe(true);
  }
  await page.goto("/tests/chapter-preview.html?chapter2");
  await expect(page.locator('[data-review-ready=true]')).toBeVisible();
  await expect(page.locator(".review-frame")).toHaveCount(15);
  await page.screenshot({ path: "test-results/chapter-02-review.png", fullPage: true });
});

test("nuclear columns fade in place for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openSlide(page, 4, 14);
  await page.getByRole("button", { name: "Seek to cue 3: Bombs", exact: true }).click();
  await hold(page, 48);
  const first = player(page).getByTestId("association-bombs");
  await expect(first).toHaveCSS("transform", "none");
  await expect(first).toHaveCSS("opacity", "1");
  await expect(first.getByRole("img", { name: "Bombs", exact: true })).toBeVisible();
  await expect(player(page).getByTestId("association-radiation")).toHaveCSS("opacity", "0");
});

test("comic panel images fade in place with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openSlide(page, 5, 14);
  await page.getByRole("button", { name: "Seek to cue 5: Powerpuff Girls", exact: true }).click();
  await hold(page, 82);
  for (const panel of await player(page).locator('[data-comic-panel] [data-testid^="fiction-"][aria-hidden="false"]').all()) {
    await expect(panel).toHaveCSS("transform", "none");
    await expect(panel).toHaveCSS("opacity", "1");
  }
  await expect(player(page).locator('[data-comic-panel] [data-testid^="fiction-"][aria-hidden="false"]')).toHaveCount(4);
});
