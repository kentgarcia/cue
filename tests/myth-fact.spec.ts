import { test, expect } from "@playwright/test";

test("swipe storyboard keeps the vote white, moves right to FACT, then explains on green", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/tests/chapter-preview.html?mythfact");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const frames = page.locator(".review-frame");
  const vote = frames.nth(0);
  await expect(vote.locator(".chapter-canvas")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(vote.getByTestId("quiz-correct-background")).toHaveCSS("opacity", "0");
  await expect(vote.getByTestId("quiz-answer")).toHaveCount(0);
  await expect(vote.locator(".myth-fact__statement")).toHaveText("Bananas areradioactive.");
  await expect(vote.locator(".myth-fact__card")).toHaveCSS("border-bottom-width", "12px");
  const geometry = await vote.evaluate(element => {
    const myth = element.querySelector(".myth-fact__choice--myth")!.getBoundingClientRect();
    const card = element.querySelector(".myth-fact__card-wrap")!.getBoundingClientRect();
    const fact = element.querySelector(".myth-fact__choice--fact")!.getBoundingClientRect();
    return { mythLeft: myth.right < card.left, factRight: fact.left > card.right };
  });
  expect(geometry).toEqual({ mythLeft: true, factRight: true });
  const cardOffset = (element: Element) => {
    const canvas = element.querySelector("[data-slide-frame]")!.getBoundingClientRect();
    const card = element.querySelector(".myth-fact__card-wrap")!.getBoundingClientRect();
    return (card.x - canvas.x) / canvas.width;
  };
  const settled = await vote.evaluate(cardOffset);
  const swiping = await frames.nth(2).evaluate(cardOffset);
  expect(swiping).toBeGreaterThan(settled + .15);
  await expect(frames.nth(2).getByTestId("quiz-explanation")).toHaveCount(0);
  const result = frames.last();
  await expect(result.getByTestId("quiz-correct-background")).toHaveCSS("opacity", "1");
  await expect(result.getByTestId("quiz-correct-background")).toHaveCSS("background-color", "rgb(34, 165, 101)");
  await expect(result.getByTestId("quiz-statement-card")).toHaveCSS("opacity", "0");
  await expect(result.getByRole("heading", { name: "FACT.", exact: true })).toBeVisible();
  await expect(result.getByTestId("quiz-explanation")).toContainText("You chose FACT. That’s right!");
  await expect(result.getByTestId("quiz-explanation")).toContainText("potassium-40");
  await expect(result.getByRole("img", { name: /Schrödi explaining/ })).toBeVisible();
  await page.screenshot({ path: "test-results/myth-fact-storyboard.png", fullPage: true });
  await vote.screenshot({ path: "test-results/myth-fact-vote.png" });
  await result.screenshot({ path: "test-results/myth-fact-result.png" });
});

test("small screen and reduced motion preserve the game and answer cue", async ({ page }) => {
  await page.setViewportSize({ width: 760, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /^Go to slide 12:/ }).click();
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "24");
  await expect(player.getByTestId("quiz-statement-card")).toHaveCSS("transform", "none");
  await expect(player.getByTestId("quiz-answer")).toHaveCount(0);
  await player.click();
  await expect(player).toHaveAttribute("data-frame", "120");
  await expect(player).toHaveAttribute("data-phase", "paused");
  await expect(player.getByTestId("quiz-explanation")).toBeVisible();
  await expect(player.locator(".myth-fact__schrodi")).toHaveCSS("transform", "none");
  expect(await player.evaluate(element => {
    const canvas = element.getBoundingClientRect();
    return [...element.querySelectorAll(".myth-fact__bubble, .myth-fact__schrodi, .myth-fact__source")].every(item => {
      const bounds = item.getBoundingClientRect();
      return bounds.left >= canvas.left && bounds.right <= canvas.right + 1 && bounds.bottom <= canvas.bottom + 1 && item.scrollWidth <= item.clientWidth + 1;
    });
  })).toBe(true);
});
