import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function meetAtomIQ(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("presentation-player")).toHaveAttribute("data-frame", "30");
  await page.getByRole("button", { name: /Go to slide 8:/ }).click();
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-slide", "chapter-03-meet");
  await expect(player).toHaveAttribute("data-frame", "90");
  await expect(player).toHaveAttribute("data-phase", "paused");
  return player;
}

test("white AtomIQ introduction uses the real artwork and idles automatically during the cue hold", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const player = await meetAtomIQ(page);
  await expect(player.locator("[data-slide-frame]")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(player.getByRole("heading", { name: "AtomIQ", exact: true })).toBeVisible();
  await expect(player.getByTestId("atomiq-tagline")).toHaveText("When facts are clear, there’s nothing to fear.");
  const field = player.locator("[data-atomiq-idle]");
  await expect(field).toHaveAttribute("data-atomiq-idle", "playing");
  for (const image of await player.locator("img").all()) {
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await expect(player.getByTestId("atomiq-logo")).toHaveAttribute("src", "/media/atomiq/icon.png");
  await expect(player.getByTestId("atomiq-phone")).toHaveAttribute("src", "/media/atomiq/phone.png");
  await expect(player.getByTestId("atomiq-mascot").locator("img")).toHaveAttribute("src", "/media/atomiq/discover.svg");
  const phone = player.getByTestId("atomiq-phone");
  const phoneBefore = (await phone.boundingBox())!;
  const title = (await player.getByRole("heading", { name: "AtomIQ", exact: true }).boundingBox())!;
  expect(title.x + title.width / 2).toBeLessThan(phoneBefore.x);
  await expect(player.locator("h1")).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(player.getByTestId("atomiq-tagline")).toHaveCSS("-webkit-text-fill-color", "rgb(0, 0, 0)");
  const logo = (await player.getByTestId("atomiq-logo").boundingBox())!;
  expect(logo.x + logo.width / 2).toBeCloseTo(title.x + title.width / 2, 0);
  const mascot = player.getByTestId("atomiq-mascot");
  const orbit = player.locator(".atomiq-meet__wave--cream");
  await expect(mascot).toHaveCSS("animation-name", "atomiq-mascot-float");
  await expect(orbit).toHaveCSS("animation-name", "atomiq-wave-drift");
  const mascotBefore = await mascot.evaluate(element => getComputedStyle(element).transform);
  const orbitBefore = await orbit.evaluate(element => getComputedStyle(element).transform);
  await page.waitForTimeout(1200);
  expect(await mascot.evaluate(element => getComputedStyle(element).transform)).not.toBe(mascotBefore);
  expect(await orbit.evaluate(element => getComputedStyle(element).transform)).not.toBe(orbitBefore);
  expect(await phone.boundingBox()).toEqual(phoneBefore);
  await expect(player).toHaveAttribute("data-frame", "90");
  await expect(player).toHaveAttribute("data-phase", "paused");
  await expect(page.locator('.slide-card [data-atomiq-idle="playing"]')).toHaveCount(0);
  await player.screenshot({ path: "test-results/atomiq-introduction-live.png" });
});

test("AtomIQ idle motion respects reduced motion and keeps previews static", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const player = await meetAtomIQ(page);
  await expect(player.locator("[data-atomiq-idle]")).toHaveAttribute("data-atomiq-idle", "still");
  for (const element of await player.locator(".atomiq-meet__mascot, .atomiq-meet__wave").all()) await expect(element).toHaveCSS("animation-name", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await player.evaluate(element => {
    const canvas = element.getBoundingClientRect();
    return [...element.querySelectorAll("h1, p, [data-testid=atomiq-logo], .atomiq-meet__mascot img")].every(child => {
      const bounds = child.getBoundingClientRect();
      return bounds.left >= canvas.left - 1 && bounds.right <= canvas.right + 1 && bounds.top >= canvas.top - 1 && bounds.bottom <= canvas.bottom + 1;
    });
  })).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(player.getByTestId("atomiq-mascot")).toHaveCSS("animation-name", "atomiq-mascot-float");
  await page.goto("/tests/chapter-preview.html?chapter3");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  await expect(page.locator('[data-atomiq-idle="still"]')).toHaveCount(3);
  for (const mascot of await page.locator(".atomiq-meet__mascot").all()) await expect(mascot).toHaveCSS("animation-name", "none");
});

test("AtomIQ mascot and accents composite without repeated painting or layout", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Chromium tracing measures rendering work");
  await page.setViewportSize({ width: 1920, height: 1080 });
  const player = await meetAtomIQ(page);
  await page.getByRole("button", { name: /^Present/ }).click();
  await expect(page.locator(".presentation-stage")).toHaveClass(/is-presenting/);
  await page.waitForTimeout(3000);
  const client = await page.context().newCDPSession(page);
  const completed = new Promise<string>((resolve, reject) => client.once("Tracing.tracingComplete", event => event.stream ? resolve(event.stream) : reject(new Error("Missing browser trace"))));
  await client.send("Tracing.start", { categories: "devtools.timeline", transferMode: "ReturnAsStream" });
  await page.waitForTimeout(1200);
  await client.send("Tracing.end");
  const stream = await completed;
  let data = "";
  for (;;) {
    const part = await client.send("IO.read", { handle: stream });
    data += part.data;
    if (part.eof) break;
  }
  await client.send("IO.close", { handle: stream });
  await client.detach();
  const events = (JSON.parse(data) as { traceEvents: { name: string; ph: string }[] }).traceEvents;
  expect(events.filter(event => event.ph === "X" && ["Paint", "Layout"].includes(event.name))).toEqual([]);
  await expect(player).toHaveAttribute("data-frame", "90");
  await expect(player).toHaveAttribute("data-phase", "paused");
});


test("app launch travels from the centered icon into the reference layout in one automatic entrance", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1000 });
  await page.goto("/tests/chapter-preview.html?atomiq");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const frames = page.locator(".review-frame");
  await expect(frames).toHaveCount(6);
  const firstIcon = await frames.nth(1).getByTestId("atomiq-logo").boundingBox();
  const firstCanvas = await frames.nth(1).boundingBox();
  expect((firstIcon!.x + firstIcon!.width / 2 - firstCanvas!.x) / firstCanvas!.width).toBeCloseTo(.5, 2);
  const settled = frames.last();
  await expect(settled.locator("[data-atomiq-entrance]")).toHaveAttribute("data-atomiq-entrance", "settled");
  await expect(settled.getByRole("heading", { name: "AtomIQ" })).toHaveCSS("opacity", "1");
  await expect(settled.getByTestId("atomiq-tagline")).toHaveCSS("opacity", "1");
  const phone = (await settled.getByTestId("atomiq-phone").boundingBox())!;
  const canvas = (await settled.boundingBox())!;
  expect(phone.y + phone.height).toBeGreaterThan(canvas.y + canvas.height);
  await page.screenshot({ path: "test-results/atomiq-launch-storyboard.png", fullPage: true });
});
