import { test, expect } from "@playwright/test";

test("opening white circle rises from the bottom and expands to cover the next slide", async ({ page }) => {
  await page.goto("/tests/chapter-preview.html?transitions");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const stages = page.getByTestId("opening-circle-transition");
  await expect(stages).toHaveCount(3);
  const poses = [];
  for (const stage of await stages.all()) {
    const canvas = (await stage.boundingBox())!;
    const circle = (await stage.getByTestId("transition-white-circle").boundingBox())!;
    poses.push({ x: (circle.x + circle.width / 2 - canvas.x) / canvas.width, y: (circle.y + circle.height / 2 - canvas.y) / canvas.height, scale: circle.width / canvas.width });
  }
  expect(poses[0]!.x).toBeCloseTo(0.5, 3);
  expect(poses[0]!.y).toBeGreaterThan(1);
  expect(poses[1]!.y).toBeLessThan(poses[0]!.y);
  expect(poses[1]!.scale).toBeGreaterThan(poses[0]!.scale);
  expect(poses[2]!.y).toBeCloseTo(0.5, 3);
  expect(poses[2]!.scale).toBeGreaterThan(1.14);
  await page.screenshot({ path: "test-results/opening-circle-review.png", fullPage: true });
});

test("aspirations question is centered and disappears before the question-mark professions", async ({ page }) => {
  await page.goto("/");
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "30");
  await page.getByRole("button", { name: /Go to slide 2:/ }).click();
  await expect(player).toHaveAttribute("data-frame", "14");
  const question = player.getByRole("heading", { name: "What do you want to become?", exact: true });
  await expect(question).toBeVisible();
  const offsets = await question.evaluate(element => {
    const text = element.getBoundingClientRect();
    const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
    return { x: (text.x + text.width / 2) - (canvas.x + canvas.width / 2), y: (text.y + text.height / 2) - (canvas.y + canvas.height / 2) };
  });
  expect(Math.abs(offsets.x)).toBeLessThan(1);
  expect(Math.abs(offsets.y)).toBeLessThan(1);
  await player.screenshot({ path: "test-results/aspirations-question-centered.png" });
  for (const [frame, word] of [[31, "ENGINEER?"], [48, "SCIENTIST?"], [65, "DOCTOR?"], [82, "ARCHITECT?"]] as const) {
    await player.click();
    await expect(player).toHaveAttribute("data-frame", String(frame));
    await expect(question).toHaveCount(0);
    await expect(player.locator(`[data-profession="${word}"]`)).toBeVisible();
    await expect(player.getByTestId("aspirations-question")).toHaveCSS("opacity", "0");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await expect(player).toHaveAttribute("data-frame", "14");
  await expect(question).toBeVisible();
  await expect(player.getByTestId("aspirations-question")).toHaveCSS("transform", "none");
});
