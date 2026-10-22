import { test, expect } from "@playwright/test";

test("words accumulate without shifting, swapping, or zooming on the orange gradient stage", async ({ page }) => {
  await page.setViewportSize({ width: 1560, height: 1080 });
  await page.goto("/tests/chapter-preview.html?kinetic");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  const frames = page.locator(".review-frame");
  const prefixes = ["Why", "Why not", "Why not start", "Why not start now?"];
  const positions: { x: number; y: number; width: number }[] = [];
  for (let index = 0; index < prefixes.length; index++) {
    const frame = frames.nth(8 + index);
    await expect(frame.getByRole("heading", { name: prefixes[index]!, exact: true })).toBeVisible();
    await expect(frame.locator("[data-slide-frame]")).toHaveCSS("background-image", "linear-gradient(135deg, rgb(255, 173, 50), rgb(255, 116, 29) 43%, rgb(255, 142, 36))");
    await expect(frame.locator("h1")).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(frame.locator("h1")).toHaveCSS("transform", "none");
    const firstWord = frame.locator('[data-kinetic-word="0"]');
    await expect(firstWord).toHaveAttribute("data-visible", "true");
    positions.push(await firstWord.evaluate((element) => {
      const word = element.getBoundingClientRect();
      const canvas = element.closest("[data-slide-frame]")!.getBoundingClientRect();
      return { x: (word.x - canvas.x) / canvas.width, y: (word.y - canvas.y) / canvas.height, width: word.width / canvas.width };
    }));
  }
  positions.slice(1).forEach((position) => {
    expect(position.x).toBeCloseTo(positions[0]!.x, 4);
    expect(position.y).toBeCloseTo(positions[0]!.y, 4);
    expect(position.width).toBeCloseTo(positions[0]!.width, 4);
  });
  await page.screenshot({ path: "test-results/cumulative-type-review.png", fullPage: true });
});

test("all chapters retain orange backgrounds, use orange gradient text on white, and keep flares exclusive to the opening", async ({ page }) => {
  test.setTimeout(60000);
  const gradient = "linear-gradient(135deg, rgb(255, 173, 50), rgb(255, 116, 29) 43%, rgb(255, 142, 36))";
  for (const chapter of ["", "?chapter2", "?chapter3", "?chapter4", "?chapter5", "?chapter6"]) {
    await page.goto(`/tests/chapter-preview.html${chapter}`);
    await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
    await expect(page.locator("[data-slide-frame]").first()).toBeVisible();
    const surfaces = await page.locator("[data-slide-frame]").evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      return { image: style.backgroundImage, color: style.backgroundColor, flareCount: element.querySelectorAll(".event-poster__flare").length,
        opening: element.classList.contains("event-poster"),
        appIntro: !!element.querySelector(".atomiq-meet"),
        text: element.classList.contains("chapter-canvas--light") ? Array.from(element.querySelectorAll('[data-kinetic-word], [data-profession], h1:not(:has(span, div)), p, figcaption, span:not(:has(*)), [data-gradient-text]')).map(leaf => {
          const textStyle = getComputedStyle(leaf);
          return { image: textStyle.backgroundImage, fill: textStyle.webkitTextFillColor };
        }) : [], };
    }));
    expect(surfaces.some(surface => surface.image === gradient)).toBe(true);
    // Chapter 04 is now entirely full-screen photography over the orange stage.
    if (chapter !== "?chapter4") expect(surfaces.some(surface => surface.color === "rgb(255, 255, 255)")).toBe(true);
    for (const surface of surfaces) {
      expect(surface.color).not.toBe("rgb(17, 17, 17)");
      if (surface.image !== "none") {
        expect(surface.image).toBe(gradient);

      }
      expect(surface.flareCount).toBe(surface.opening ? 9 : 0);
      if (surface.color === "rgb(255, 255, 255)") {
        expect(surface.text.length).toBeGreaterThan(0);
        for (const text of surface.text) {
          expect(text.image).toBe(surface.appIntro ? "none" : gradient);
          expect(text.fill).toBe(surface.appIntro ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0)");
        }
      }
    }
  }
});
