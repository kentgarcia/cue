import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const player = (page: Page) => page.getByTestId("presentation-player");
async function atFrame(page: Page, frame: number, timeout = 6000) {
  await expect(player(page)).toHaveAttribute("data-frame", String(frame), {
    timeout,
  });
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
  await expect(player(page).locator("[data-slide-frame]")).toHaveAttribute(
    "data-slide-frame",
    String(frame),
  );
}
async function unfocus(page: Page) {
  await page.locator(".slide-heading h1").click();
}

test("opening holds, four independent profession cues, reverse seeking, and persistent Player", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await atFrame(page, 30);
  await page.waitForTimeout(250);
  await atFrame(page, 30);
  await page.keyboard.press("ArrowRight");
  await expect(player(page)).toHaveAttribute(
    "data-slide",
    "chapter-01-aspirations",
  );
  await atFrame(page, 14);
  await expect(
    player(page).locator('[data-profession][aria-hidden="false"]'),
  ).toHaveCount(0);
  await page.evaluate(() =>
    document
      .querySelector('[data-testid="presentation-player"] > div')
      ?.setAttribute("data-persistent", "yes"),
  );
  for (const [index, frame] of [31, 48, 65, 82].entries()) {
    await page.keyboard.press("ArrowRight");
    await atFrame(page, frame);
    await expect(
      player(page).locator('[data-profession][aria-hidden="false"]'),
    ).toHaveCount(index + 1);
    await page.waitForTimeout(120);
    await atFrame(page, frame);
  }
  await expect(page.locator('[data-persistent="yes"]')).toHaveCount(1);
  await page.keyboard.press("ArrowLeft");
  await atFrame(page, 65);
  await expect(
    player(page).locator('[data-profession][aria-hidden="false"]'),
  ).toHaveCount(3);
  await page
    .getByRole("button", { name: "Restart slide", exact: true })
    .click();
  await atFrame(page, 14);
  await expect(page.locator('[data-persistent="yes"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("custom transitions, chapter boundary, Home, End, and final deck hold", async ({
  page,
}) => {
  await page.goto("/");
  await atFrame(page, 30);
  await page.getByRole("button", { name: /Go to slide 2:/ }).click();
  await atFrame(page, 14);
  await page
    .getByRole("button", { name: "Seek to cue 5: Architect", exact: true })
    .click();
  await atFrame(page, 82);
  await unfocus(page);
  await page.keyboard.press("Enter");
  await expect(player(page)).toHaveAttribute(
    "data-slide",
    "chapter-01-start-now",
  );
  await atFrame(page, 26);
  await expect(page.locator(".transition-layer")).toHaveCount(0);
  await page.keyboard.press("Space");
  await atFrame(page, 14);
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-02-nuclear");
  await page.keyboard.press("End");
  await atFrame(page, 72);
  await expect(
    page.getByRole("button", { name: "Next checkpoint or slide", exact: true }),
  ).toBeDisabled();
  for (const frame of [0, 253, 72, 48, 24, 0]) {
    await page.keyboard.press("ArrowLeft");
    await atFrame(page, frame);
  }
  await page.keyboard.press("ArrowLeft");
  await expect(player(page)).toHaveAttribute("data-slide", "chapter-06-first-step");
  await atFrame(page, 30);
  await page.keyboard.press("Home");
  await atFrame(page, 30);
  await page.keyboard.press("End");
  await atFrame(page, 72);
  await page.keyboard.press("Home");
  await atFrame(page, 30);
});

test("fonts are loaded before the first Player mounts and typography has no overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await atFrame(page, 30);
  expect(
    await page.evaluate(() =>
      [500, 600, 700, 800].every((weight) =>
        document.fonts.check(`${weight} 48px "Inter"`),
      ),
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/chapter-01-preview.png", fullPage: true });
  for (const [index, frame] of [
    [1, 30],
    [2, 82],
    [3, 26],
  ] as const) {
    if (index > 1) {
      await page
        .getByRole("button", { name: new RegExp(`Go to slide ${index}:`) })
        .click();
      await expect(player(page)).toHaveAttribute("data-phase", "paused");
      if (index === 2)
        await page
          .getByRole("button", {
            name: "Seek to cue 5: Architect",
            exact: true,
          })
          .click();
    }
    await atFrame(page, frame);
    const contained = await player(page).evaluate((element) => {
      const canvas = element.getBoundingClientRect();
      return [...element.querySelectorAll("h1, [data-profession], p")].every(
        (text) => {
          const bounds = text.getBoundingClientRect();
          return (
            bounds.left >= canvas.left &&
            bounds.right <= canvas.right + 1 &&
            bounds.top >= canvas.top &&
            bounds.bottom <= canvas.bottom + 1 &&
            text.scrollWidth <= text.clientWidth + 1
          );
        },
      );
    });
    expect(contained).toBe(true);
    const centered = await player(page).evaluate((element) => {
      const canvas = element.getBoundingClientRect();
      const center = (canvas.left + canvas.right) / 2;
      return [...element.querySelectorAll("h1, [data-profession], p")].every((text) => {
        const range = document.createRange();
        range.selectNodeContents(text);
        const bounds = range.getBoundingClientRect();
        return Math.abs((bounds.left + bounds.right) / 2 - center) < 2;
      });
    });
    expect(centered).toBe(true);
  }
});

test("Next interrupts an active cue immediately without waiting or remounting", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/tests/harness.html?playback");
  await atFrame(page, 2);
  await page.evaluate(() => document.querySelector('[data-testid="presentation-player"] > div')?.setAttribute("data-fast-cue", "persistent"));
  await player(page).click();
  await expect(player(page)).toHaveAttribute("data-target", "80");
  const next = page.getByRole("button", { name: "Next checkpoint or slide", exact: true });
  await expect(next).toBeEnabled();
  await next.click();
  await expect(player(page)).toHaveAttribute("data-target", "119");
  await expect(player(page)).toHaveAttribute("data-phase", "playing");
  await expect.poll(async () => Number(await player(page).getAttribute("data-frame"))).toBeGreaterThanOrEqual(80);
  await next.click();
  await atFrame(page, 119);
  await expect(next).toBeDisabled();
  await expect(page.locator('[data-fast-cue="persistent"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("frame updates do not rerender the editor context", async ({ page }) => {
  await page.goto("/tests/harness.html?playback");
  await atFrame(page, 2);
  const probe = page.getByTestId("engine-renders");
  const before = Number(await probe.getAttribute("data-count"));
  await page.getByRole("button", { name: "Play next animation", exact: true }).click();
  await atFrame(page, 80, 12000);
  const renders = Number(await probe.getAttribute("data-count")) - before;
  console.log(`Editor context renders across 78 source frames: ${renders} (baseline: 154)`);
  expect(renders).toBeLessThanOrEqual(6);
});

test("pause resumes its segment and editing controls preserve native keys", async ({
  page,
}) => {
  await page.goto("/tests/harness.html?playback");
  await atFrame(page, 2);
  await page
    .getByRole("button", { name: "Play next animation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  await expect(player(page)).toHaveAttribute("data-phase", "paused");
  const frame = await player(page).getAttribute("data-frame");
  expect(Number(frame)).toBeLessThan(80);
  await page.waitForTimeout(150);
  await expect(player(page)).toHaveAttribute("data-frame", frame!);
  await page
    .getByRole("button", { name: "Play next animation", exact: true })
    .click();
  await atFrame(page, 80, 12000);
  await page.evaluate(() => {
    const input = document.createElement("input");
    input.id = "test-input";
    document.body.append(input);
    input.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await atFrame(page, 80);
  await page.evaluate(() =>
    window.addEventListener(
      "keydown",
      (event) => {
        document.documentElement.dataset.escapePrevented = String(
          event.defaultPrevented,
        );
      },
      { once: true },
    ),
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute(
    "data-escape-prevented",
    "false",
  );
  await page
    .getByRole("button", { name: "Keyboard shortcuts", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await atFrame(page, 80);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("fullscreen persists across slides and denied fullscreen exits immediately with Escape", async ({
  page,
}) => {
  await page.goto("/");
  await atFrame(page, 30);
  await page.getByRole("button", { name: /^Present F$/ }).click();
  await expect(page.locator(".presentation-stage")).toHaveClass(
    /is-presenting/,
  );
  await page.keyboard.press("End");
  await atFrame(page, 72);
  await expect(page.locator(".presentation-stage")).toHaveClass(
    /is-presenting/,
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".presentation-stage")).not.toHaveClass(
    /is-presenting/,
  );
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () =>
      Promise.reject(new Error("Fullscreen denied for test"));
  });
  await page.reload();
  await atFrame(page, 30);
  await page.getByRole("button", { name: /^Present F$/ }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".presentation-stage")).not.toHaveClass(
    /is-presenting/,
  );
});

test("mobile reduced motion and a long browser frame preserve checkpoint control", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await atFrame(page, 30);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /Go to slide 2:/ }).click();
  await atFrame(page, 14);
  await page
    .getByRole("button", { name: "Next checkpoint or slide", exact: true })
    .click();
  await page.evaluate(() => {
    const started = performance.now();
    while (performance.now() - started < 1600) {
      Math.sqrt(performance.now());
    }
  });
  await atFrame(page, 31);
  await page.getByRole("tab", { name: "Slide details" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Reduced");
});

test("a failed custom slide can recover to a healthy slide and a none transition", async ({
  page,
}) => {
  await page.goto("/tests/harness.html");
  await expect(page.locator(".player-error")).toBeVisible();
  await page.getByRole("button", { name: /Go to slide 2:/ }).click();
  await atFrame(page, 14);
  await expect(page.locator(".player-error")).toHaveCount(0);
  await page.getByRole("button", { name: /Go to slide 3:/ }).click();
  await atFrame(page, 30);
  await expect(page.locator(".transition-layer")).toHaveCount(0);
});

test("visual review includes initial, mid-animation, and settled frames of every slide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1560, height: 1080 });
  await page.goto("/tests/chapter-preview.html");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  await expect(page.locator(".review-frame")).toHaveCount(9);
  await page.screenshot({ path: "test-results/chapter-01-review.png", fullPage: true });
  await page.goto("/tests/chapter-preview.html?transitions");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  await expect(page.locator(".review-frame")).toHaveCount(6);
  await page.screenshot({
    path: "test-results/chapter-01-transitions.png",
    fullPage: true,
  });
});

test("kinetic professions stay readable and honor reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await atFrame(page, 30);
  await page.getByRole("button", { name: /Go to slide 2:/ }).click();
  await atFrame(page, 14);
  for (const [label, frame] of [
    ["Engineer", 31],
    ["Scientist", 48],
    ["Doctor", 65],
    ["Architect", 82],
  ] as const) {
    await page
      .getByRole("button", { name: new RegExp(`Seek to cue \\d: ${label}$`) })
      .click();
    await atFrame(page, frame);
    const textIsContained = await player(page).evaluate((element) => {
      const canvas = element.getBoundingClientRect();
      return [
        ...element.querySelectorAll('[data-profession][aria-hidden="false"]'),
      ].every((word) => {
        const range = document.createRange();
        range.selectNodeContents(word);
        const bounds = range.getBoundingClientRect();
        return (
          bounds.left >= canvas.left &&
          bounds.right <= canvas.right + 1 &&
          bounds.top >= canvas.top &&
          bounds.bottom <= canvas.bottom + 1
        );
      });
    });
    expect(textIsContained).toBe(true);
    const transform = await player(page)
      .locator('[data-profession="ENGINEER?"]')
      .getAttribute("style");
    await page.waitForTimeout(100);
    await expect(
      player(page).locator('[data-profession="ENGINEER?"]'),
    ).toHaveAttribute("style", transform!);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(player(page).locator('[data-profession="ENGINEER?"]')).toHaveCSS(
    "transform",
    "none",
  );
  expect(
    await player(page)
      .locator("[data-profession]")
      .evaluateAll((lines) =>
        lines.every((line) => getComputedStyle(line).transform === "none"),
      ),
  ).toBe(true);
  await page.setViewportSize({ width: 1560, height: 1080 });
  await page.goto("/tests/chapter-preview.html?kinetic");
  await expect(page.locator('[data-review-ready="true"]')).toBeVisible();
  await expect(page.locator(".review-frame")).toHaveCount(12);
  await page.screenshot({
    path: "test-results/chapter-01-kinetic-review.png",
    fullPage: true,
  });
});
