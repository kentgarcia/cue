import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
const player = (page: Page) => page.getByTestId("presentation-player");
async function hold(page: Page, frame: number) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame), { timeout: 20000 });
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
}

test("one cue plays the whole Schrödi conversation and rewind restores the introduction", async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 11: Schrödi/ }).click();
  await hold(page, 48);
  const demo = player(page).getByTestId("schrodi-demo");
  const mascot = player(page).getByTestId("schrodi-mascot");
  await expect(demo).toHaveAttribute("data-chat-stage", "introduction");
  await expect(player(page).locator(".schrodi-chat__subtitle")).toHaveText("Science Assistant");
  await expect(player(page).locator(".schrodi-demo__description")).toHaveText("Science Assistant");
  await expect(demo).not.toContainText(/\bAI\b/);
  await expect(page.getByRole("button", { name: /^Seek to cue / })).toHaveCount(2);
  await expect(player(page).locator("[data-chat-role]")).toHaveCount(0);
  await player(page).screenshot({ path: "test-results/schrodi-introduction.png" });
  await player(page).click();
  await expect(player(page)).toHaveAttribute("data-target", "432");
  await expect(player(page)).toHaveAttribute("data-phase", "playing");
  await expect(player(page).getByTestId("schrodi-typing")).toBeVisible();
  await expect(player(page).getByTestId("schrodi-message-0")).toHaveText("What is an atom?");
  // No further click: both replies and the follow-up must complete automatically.
  await hold(page, 432);
  await expect(mascot).toHaveAttribute("data-pose", "idea");
  await expect(player(page).locator("[data-chat-role]")).toHaveCount(4);
  await expect(player(page).getByTestId("schrodi-message-1")).toContainText("tiny building block of matter");
  await expect(player(page).getByTestId("schrodi-message-2")).toHaveText("So what is the nucleus?");
  await expect(player(page).getByTestId("schrodi-message-3")).toContainText("in most atoms, neutrons");
  await expect(player(page).locator('[data-chat-role] [data-visible="false"]')).toHaveCount(0);
  await expect(player(page).getByTestId("schrodi-typing")).toHaveCount(0);
  const last = (await player(page).getByTestId("schrodi-message-3").boundingBox())!;
  const composer = (await player(page).getByTestId("schrodi-composer").boundingBox())!;
  expect(last.y + last.height).toBeLessThan(composer.y);
  await player(page).screenshot({ path: "test-results/schrodi-conversation.png" });
  await page.keyboard.press("ArrowLeft");
  await hold(page, 48);
  await expect(mascot).toHaveAttribute("data-pose", "happy_2");
  await expect(player(page).locator("[data-chat-role]")).toHaveCount(0);
  await player(page).click();
  await expect(player(page)).toHaveAttribute("data-target", "432");
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 48);
  await expect(player(page).locator("[data-chat-role]")).toHaveCount(0);
  await expect(page.locator('.slide-card [data-schrodi-idle="playing"]')).toHaveCount(0);
});

test("Schrödi replies accumulate words without moving previous words and thumbnails keep all poses still", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/tests/chapter-preview.html?schrodi");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const frames = page.locator(".review-frame");
  await expect(frames).toHaveCount(9);
  const middle = frames.nth(4).getByTestId("schrodi-message-1");
  const final = frames.nth(5).getByTestId("schrodi-message-1");
  const prefix = await middle.locator('[data-visible="true"]').count();
  expect(prefix).toBeGreaterThan(1);
  expect(prefix).toBeLessThan(await final.locator('[data-visible="true"]').count());
  const positions = [];
  for (const bubble of [middle, final]) positions.push(await bubble.locator('[data-chat-word="0"]').evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
    return { x: (bounds.x - canvas.x) / canvas.width, y: (bounds.y - canvas.y) / canvas.height };
  }));
  expect(positions[0]!.x).toBeCloseTo(positions[1]!.x, 4);
  expect(positions[0]!.y).toBeCloseTo(positions[1]!.y, 4);
  await expect(page.locator('[data-schrodi-idle="still"]')).toHaveCount(9);
  for (const element of await page.locator(".schrodi-demo__idle, .schrodi-chat__typing i").all()) await expect(element).toHaveCSS("animation-name", "none");
  const sources = await frames.last().locator("[data-pose-art] img").evaluateAll(images => images.map(image => image.getAttribute("src")));
  expect(sources).toEqual(["happy_2", "thinking", "explain", "idea"].map(name => `/media/atomiq/mascot/${name}.png`));
  await page.screenshot({ path: "test-results/schrodi-storyboard.png", fullPage: true });
});

test("Schrödi respects reduced motion and fits the whole conversation on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 11: Schrödi/ }).click();
  await hold(page, 48);
  await expect(player(page).getByTestId("schrodi-demo")).toHaveAttribute("data-schrodi-idle", "still");
  await expect(player(page).getByTestId("schrodi-mascot")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: /^Seek to cue / }).last().click();
  await hold(page, 432);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await player(page).evaluate(element => {
    const canvas = element.getBoundingClientRect();
    return [...element.querySelectorAll(".schrodi-chat, h1, [data-chat-role]")].every(child => {
      const bounds = child.getBoundingClientRect();
      return bounds.left >= canvas.left - 1 && bounds.right <= canvas.right + 1 && bounds.top >= canvas.top - 1 && bounds.bottom <= canvas.bottom + 1 && child.scrollWidth <= child.clientWidth + 1;
    });
  })).toBe(true);
  for (const element of await player(page).locator(".schrodi-demo__idle, [data-chat-role]").all()) await expect(element).toHaveCSS("transform", "none");
});
