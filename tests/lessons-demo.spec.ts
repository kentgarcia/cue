import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
const player = (page: Page) => page.getByTestId("presentation-player");
async function hold(page: Page, frame: number) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame));
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
}

test("Lessons recreates the UI and holds each demonstration until the presenter advances", async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 9: Lessons/ }).click();
  await hold(page, 54);
  await expect(player(page).getByTestId("lessons-demo")).toHaveAttribute("data-lesson-stage", "map");
  await expect(player(page).getByTestId("lesson-map-ui")).toContainText("Introduction to Nuclear Science");
  await expect(player(page).getByTestId("lesson-map-ui").locator(".lesson-tile")).toHaveCount(5);
  // The references are reconstructed DOM, not the flattened map/quiz images.
  expect(await player(page).locator("img").evaluateAll(images => images.every(image => !/mockup-(map|quiz)/.test(image.getAttribute("src") ?? "")))).toBe(true);
  await page.waitForTimeout(500);
  await hold(page, 54);
  await player(page).screenshot({ path: "test-results/lessons-map.png" });
  const mapBefore = (await player(page).getByTestId("lesson-map-device").boundingBox())!;
  await player(page).click();
  await hold(page, 90);
  await expect(player(page).getByTestId("lessons-demo")).toHaveAttribute("data-lesson-stage", "map-zoom");
  const enlarged = (await player(page).getByTestId("lesson-map-device").boundingBox())!;
  expect(enlarged.width).toBeGreaterThan(mapBefore.width * 2);
  await player(page).screenshot({ path: "test-results/lessons-map-zoom.png" });
  await expect(player(page).getByTestId("lesson-hand-cursor")).toHaveCSS("opacity", "0");
  await player(page).click();
  await hold(page, 174);
  await expect(player(page).getByTestId("lesson-question")).toContainText("Who discovered the nucleus of the atom?");
  await expect(player(page).locator('[data-selected="true"]')).toHaveCount(0);
  await player(page).screenshot({ path: "test-results/lessons-quiz.png" });
  await player(page).click();
  await hold(page, 210);
  await expect(player(page).getByTestId("lesson-answer-3")).toHaveAttribute("data-selected", "true");
  await expect(player(page).getByTestId("lesson-check")).toHaveText("CHECK");
  await player(page).click();
  await hold(page, 252);
  await expect(player(page).getByTestId("lesson-check")).toHaveText("CORRECT!");
  await player(page).screenshot({ path: "test-results/lessons-result.png" });
  await page.keyboard.press("ArrowLeft");
  await hold(page, 210);
  await expect(player(page).getByTestId("lesson-check")).toHaveText("CHECK");
  await page.keyboard.press("ArrowLeft");
  await hold(page, 174);
  await expect(player(page).locator('[data-selected="true"]')).toHaveCount(0);
  await page.keyboard.press("ArrowLeft");
  await hold(page, 90);
  await expect(player(page).getByTestId("lesson-node-tap")).toHaveAttribute("data-clicked", "false");
  await expect(player(page).getByTestId("lesson-hand-cursor")).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 54);
  await expect(player(page).getByTestId("lessons-demo")).toHaveAttribute("data-lesson-stage", "map");
  for (const [number, title, id] of [[10, "Minigames", "chapter-03-games"], [11, "Schrödi", "chapter-03-schrodi"]] as const) {
    await page.getByRole("button", { name: new RegExp(`Go to slide ${number}: ${title}`) }).click();
    await hold(page, number === 10 ? 54 : 48);
    await expect(player(page)).toHaveAttribute("data-slide", id);
  }
});

test("lesson storyboard shows the reconstructed map, quiz and selected answer without clipping", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/tests/chapter-preview.html?lessons");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  await expect(page.locator(".review-frame")).toHaveCount(9);
  await expect(page.locator(".review-frame").nth(1).getByTestId("lesson-map-device")).toHaveCSS("opacity", "1");
  await expect(page.locator(".review-frame").nth(6).getByTestId("lesson-check")).toHaveText("CHECK");
  await expect(page.locator(".review-frame").last().getByTestId("lesson-check")).toHaveText("CORRECT!");
  const clicking = page.locator(".review-frame").nth(4);
  await expect(clicking.getByTestId("lesson-node-tap")).toHaveAttribute("data-clicked", "true");
  const hand = (await clicking.getByTestId("lesson-hand-cursor").boundingBox())!;
  const node = (await clicking.locator(".lesson-map__node--start .lesson-tile").boundingBox())!;
  const fingertip = { x: hand.x + hand.width * .4625, y: hand.y + hand.height * .0417 };
  expect(fingertip.x).toBeGreaterThan(node.x);
  expect(fingertip.x).toBeLessThan(node.x + node.width);
  expect(fingertip.y).toBeGreaterThan(node.y);
  expect(fingertip.y).toBeLessThan(node.y + node.height);
  await clicking.screenshot({ path: "test-results/lessons-node-click.png" });
  await page.screenshot({ path: "test-results/lessons-storyboard.png", fullPage: true });
});

test("Lessons removes camera movement for reduced motion and fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 9: Lessons/ }).click();
  await hold(page, 54);
  await expect(player(page).getByTestId("lesson-map-device")).toHaveCSS("transform", "none");
  await player(page).click();
  await hold(page, 90);
  await expect(player(page).getByTestId("lessons-demo")).toHaveAttribute("data-lesson-stage", "map-zoom");
  await expect(player(page).getByTestId("lesson-hand-cursor")).toHaveCSS("opacity", "0");
  await player(page).click();
  await hold(page, 174);
  await expect(player(page).locator(".lesson-quiz__question-wrap")).toHaveCSS("transform", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await player(page).locator(".lesson-question__text").evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
});
