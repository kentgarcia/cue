import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
const player = (page: Page) => page.getByTestId("presentation-player");
async function hold(page: Page, frame: number) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame));
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
}

test("Minigames demonstrates the picker, profile, streak, awards and leaderboard at separate cues", async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 10: Minigames/ }).click();
  await hold(page, 54);
  const demo = player(page).getByTestId("minigames-demo");
  await expect(demo).toHaveAttribute("data-games-stage", "picker");
  for (const game of ["Myth Buster", "Atom Maze", "Lab Experiment", "Encyclopedia"]) await expect(player(page).getByTestId("game-picker-ui")).toContainText(game);
  expect(await player(page).locator("img").evaluateAll(images => images.every(image => !/mockup-/.test(image.getAttribute("src") ?? "")))).toBe(true);
  await player(page).screenshot({ path: "test-results/minigames-picker.png" });
  await player(page).click();
  await hold(page, 108);
  await expect(player(page).locator('.minigames-demo__choices [data-game-choice]')).toHaveCount(4);
  await expect(player(page).getByTestId("profile-hand-cursor")).toHaveCSS("opacity", "0");
  await player(page).screenshot({ path: "test-results/minigames-choices.png" });
  await player(page).click();
  await hold(page, 174);
  await expect(demo).toHaveAttribute("data-games-stage", "profile");
  await expect(player(page).getByTestId("gamified-profile-ui")).toHaveAttribute("data-profile-focus", "overview");
  await expect(player(page).getByTestId("profile-identity")).toContainText("Level 1");
  await expect(player(page).getByTestId("profile-identity")).toContainText("0 XP");
  await expect(player(page).getByTestId("streak-feature")).toHaveCSS("opacity", "0");
  await page.waitForTimeout(500);
  await hold(page, 174);
  await player(page).screenshot({ path: "test-results/minigames-profile.png" });
  for (const [frame, focus, id, text] of [[228, "streak", "streak-feature", "0 day streak"], [282, "awards", "awards-feature", "0/5 unlocked"], [336, "leaderboard", "leaderboard-feature", "Rank #11 of 11"]] as const) {
    await player(page).click();
    await hold(page, frame);
    await expect(demo).toHaveAttribute("data-games-stage", focus);
    await expect(player(page).getByTestId(id)).toHaveCSS("opacity", "1");
    await expect(player(page).getByTestId(id)).toContainText(text);
    await expect(player(page).getByTestId("gamified-profile-ui")).toHaveAttribute("data-profile-focus", focus);
    await player(page).screenshot({ path: `test-results/minigames-${focus}.png` });
  }
  await page.keyboard.press("ArrowLeft");
  await hold(page, 282);
  await expect(demo).toHaveAttribute("data-games-stage", "awards");
  await expect(player(page).getByTestId("leaderboard-feature")).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Restart slide", exact: true }).click();
  await hold(page, 54);
  await expect(demo).toHaveAttribute("data-games-stage", "picker");
  await expect(player(page).getByTestId("minigames-profile-device")).toHaveCSS("opacity", "0");
});

test("Minigames storyboard shows a hand clicking Profile and preserves the supplied locked awards", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/tests/chapter-preview.html?minigames");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const frames = page.locator(".review-frame");
  await expect(frames).toHaveCount(8);
  const clicking = frames.nth(3);
  await expect(clicking.getByTestId("profile-nav-tap")).toHaveAttribute("data-clicked", "true");
  const hand = (await clicking.getByTestId("profile-hand-cursor").boundingBox())!;
  const icon = (await clicking.locator('.minigames-demo__dock img[alt="profile navigation icon"]').boundingBox())!;
  const tip = { x: hand.x + hand.width * .4625, y: hand.y + hand.height * .0417 };
  expect(tip.x).toBeGreaterThan(icon.x);
  expect(tip.x).toBeLessThan(icon.x + icon.width);
  expect(tip.y).toBeGreaterThan(icon.y);
  expect(tip.y).toBeLessThan(icon.y + icon.height);
  await expect(frames.nth(6).getByTestId("awards-feature").locator('[data-award-state="locked"]')).toHaveCount(5);
  for (const [index, panel] of [[5, "streak-feature"], [6, "awards-feature"], [7, "leaderboard-feature"]] as const) {
    const frame = frames.nth(index);
    const caption = (await frame.locator('.minigames-demo__copy[aria-hidden="false"]').boundingBox())!;
    const detail = (await frame.getByTestId(panel).boundingBox())!;
    expect(caption.y + caption.height).toBeLessThan(detail.y);
  }
  await page.screenshot({ path: "test-results/minigames-storyboard.png", fullPage: true });
});

test("Minigames supports reduced motion and its enlarged panels fit on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Go to slide 10: Minigames/ }).click();
  await hold(page, 54);
  await expect(player(page).getByTestId("minigames-picker-device")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: /^Seek to cue / }).last().click();
  await hold(page, 336);
  await expect(player(page).getByTestId("minigames-profile-device")).toHaveCSS("transform", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await player(page).getByTestId("leaderboard-feature").evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
    return bounds.left >= canvas.left && bounds.right <= canvas.right && bounds.top >= canvas.top && bounds.bottom <= canvas.bottom;
  })).toBe(true);
});
