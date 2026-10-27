import { test, expect } from "@playwright/test";

const posterDescription = "Beyond the Atom. Team AtomIQ presents, Polytechnic University of the Philippines. Friday, October 30, 2026. Veranza KCC Mall, General Santos City. Featuring Michelle, Kent, and Ezekiel.";

test("opening recreates the reference as editable vector layers and ambience keeps moving while the cue is paused", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "30");
  await expect(player).toHaveAttribute("data-phase", "paused");
  const artwork = player.getByTestId("opening-poster");
  await expect(artwork).toHaveAttribute("aria-label", posterDescription);
  const logoBar = player.getByTestId("partner-logo-bar");
  await expect(logoBar).toHaveAttribute("fill", "#ffffff");
  const barBounds = await logoBar.boundingBox();
  const posterBounds = await artwork.boundingBox();
  expect(Math.abs(barBounds!.width - posterBounds!.width)).toBeLessThan(1);
  expect(Math.abs(barBounds!.y - posterBounds!.y)).toBeLessThan(1);
  await expect(player.locator("image")).toHaveCount(8);
  expect(await player.locator("[data-partner]").evaluateAll(elements => elements.map(element => element.getAttribute("data-partner")))).toEqual(["Meralco", "YESS", "PUP", "Explicit", "AtomIQ"]);
  const divider = await player.getByTestId("partner-divider").boundingBox();
  const yess = await player.locator('[data-partner="YESS"]').boundingBox();
  const pup = await player.locator('[data-partner="PUP"]').boundingBox();
  expect(divider!.x).toBeGreaterThan(yess!.x + yess!.width);
  expect(divider!.x).toBeLessThan(pup!.x);
  expect(await player.locator("[data-presenter]").evaluateAll(elements => elements.map(element => element.getAttribute("data-presenter")))).toEqual(["Michelle", "Kent", "Ezekiel"]);
  // Verify the actual uploaded assets decode, rather than accepting empty circles.
  await player.locator("image").evaluateAll(elements => Promise.all(elements.map(element => new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Could not load ${element.getAttribute("href")}`));
    image.src = element.getAttribute("href")!;
  }))));
  await expect(player.locator('[data-editable="event-title"]')).toHaveAttribute("aria-label", "Beyond the Atom");
  expect(await player.locator("text").count()).toBeGreaterThan(30);
  expect(await page.evaluate(() => document.fonts.check('400 120px "Event Display"'))).toBe(true);
  const foreground = player.getByTestId("opening-foreground");
  const bounds = await foreground.boundingBox();
  const flow = player.locator(".event-poster__flow");
  const marquee = player.locator(".event-poster__marquee-track");
  const speaker = player.locator('[data-presenter="Michelle"]');
  const flare = player.locator(".event-poster__flare--one");
  await expect(flow).toHaveCSS("animation-name", "none");
  for (const layer of await player.locator(".event-poster__fluid").all()) await expect(layer).toHaveCSS("animation-name", "none");
  await expect(marquee).toHaveCSS("animation-name", "poster-marquee");
  await expect(speaker).toHaveCSS("animation-name", "poster-speaker");
  await expect(player.locator(".event-poster__flare")).toHaveCount(9);
  expect(await flow.evaluate(element => element instanceof HTMLDivElement)).toBe(true);
  expect(await flare.evaluate(element => element instanceof HTMLDivElement)).toBe(true);
  await expect(flow).toHaveCSS("will-change", "auto");
  await expect(marquee).toHaveCSS("will-change", "transform");
  await expect(marquee).toHaveCSS("animation-duration", "64s");
  await expect(player.getByTestId("opening-marquee")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(flare).toHaveCSS("animation-duration", "7.2s");
  await expect(player.locator("filter, feTurbulence")).toHaveCount(0);
  const flowBefore = await flow.evaluate((element) => getComputedStyle(element).transform);
  const marqueeBefore = await marquee.evaluate(element => getComputedStyle(element).transform);
  const speakerBefore = await speaker.evaluate(element => getComputedStyle(element).transform);
  // A changing matrix alone can pass with an imperceptible fraction of a pixel.
  // Require visible travel during the very first held cue, without pressing Play/Next.
  const flarePositions = () => player.locator(".event-poster__flare").evaluateAll(elements => elements.map(element => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: matrix.e, y: matrix.f };
  }));
  const flareBefore = await flarePositions();
  await page.waitForTimeout(1200);
  expect(await flow.evaluate((element) => getComputedStyle(element).transform)).toBe(flowBefore);
  expect(await marquee.evaluate(element => getComputedStyle(element).transform)).not.toBe(marqueeBefore);
  expect(await speaker.evaluate(element => getComputedStyle(element).transform)).not.toBe(speakerBefore);
  const flareAfter = await flarePositions();
  // Individual flares ease to a stop at their turning points. Their staggered
  // phases ensure the field still has visible travel, regardless of load time.
  expect(Math.max(...flareAfter.map((position, index) => Math.hypot(position.x - flareBefore[index]!.x, position.y - flareBefore[index]!.y)))).toBeGreaterThan(7);
  expect(await foreground.boundingBox()).toEqual(bounds);
  await expect(foreground).toHaveCSS("transform", "none");
  await expect(player).toHaveAttribute("data-frame", "30");
  await expect(player).toHaveAttribute("data-phase", "paused");
  await player.screenshot({ path: "test-results/opening-poster-live.png" });
  await player.click();
  await expect(player).toHaveAttribute("data-slide", "chapter-01-aspirations");
  await expect(player).toHaveAttribute("data-frame", "14");
  await expect(player.locator(".event-poster__flow")).toHaveCount(0);
});

test("poster is static for reduced motion, thumbnails and transition snapshots", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "30");
  await expect(player.locator("[data-poster-idle]")).toHaveAttribute("data-poster-idle", "still");
  for (const layer of await player.locator(".event-poster__flare, .event-poster__speaker, .event-poster__marquee-track").all()) await expect(layer).toHaveCSS("animation-name", "none");
  await expect(player.getByTestId("opening-poster")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(player.locator(".event-poster__marquee-track")).toHaveCSS("animation-name", "poster-marquee");
  await expect(player.locator(".event-poster__flow")).toHaveCSS("animation-name", "none");
  await expect(page.locator('.slide-card [data-poster-idle="still"]')).toHaveCount(1);
  await page.goto("/tests/chapter-preview.html?transitions");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  for (const flow of await page.locator(".event-poster__flare, .event-poster__speaker, .event-poster__marquee-track").all()) await expect(flow).toHaveCSS("animation-name", "none");
});

test("poster fits a small screen and remains intact in fullscreen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "30");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: /^Present$/ }).click();
  await expect(page.locator(".presentation-stage")).toHaveClass(/is-presenting/);
  await expect(player.getByTestId("opening-poster")).toHaveAttribute("viewBox", "0 0 1672 941");
  expect(await player.getByTestId("opening-poster").evaluate((element) => {
    const image = element.getBoundingClientRect();
    const canvas = element.closest(".player-layer")!.getBoundingClientRect();
    return Math.abs(image.width - canvas.width) < 1 && Math.abs(image.height - canvas.height) < 1;
  })).toBe(true);
});

test("held opening composites without repeated paint or layout work", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Chromium tracing verifies paint and layout work");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  const player = page.getByTestId("presentation-player");
  await expect(player).toHaveAttribute("data-frame", "30");
  await page.keyboard.press("f");
  await expect(page.locator(".presentation-stage")).toHaveClass(/is-presenting/);
  // Let fullscreen and the presenter-control fade settle before measuring idle motion.
  await page.waitForTimeout(3000);
  const client = await page.context().newCDPSession(page);
  const completed = new Promise<string>((resolve, reject) => client.once("Tracing.tracingComplete", event => {
    if (event.stream) resolve(event.stream);
    else reject(new Error("Chromium did not return its performance trace"));
  }));
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
  await expect(player).toHaveAttribute("data-frame", "30");
  await expect(player).toHaveAttribute("data-phase", "paused");
});
