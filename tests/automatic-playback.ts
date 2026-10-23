import { expect, type Page } from "@playwright/test";

/** Record short-lived demo stages without clicking or slowing down the film. */
export async function recordDemo(page: Page, testId: string, attribute: string) {
  await page.evaluate(({ testId, attribute }) => {
    const samples: { stage: string; frame: number; headingTransform: string }[] = [];
    Object.assign(window, { demoSamples: samples });
    const sample = () => {
      const demo = document.querySelector(`[data-testid="presentation-player"] [data-testid="${testId}"]`);
      if (!demo) return;
      const canvas = demo.closest("[data-slide-frame]")!;
      const heading = demo.querySelector("h1");
      samples.push({ stage: demo.getAttribute(attribute)!, frame: Number(canvas.getAttribute("data-slide-frame")), headingTransform: heading ? getComputedStyle(heading).transform : "none" });
    };
    new MutationObserver(sample).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: [attribute, "data-slide-frame"] });
    sample();
  }, { testId, attribute });
}

export async function expectDemoStages(page: Page, expected: string[], titleFrame: number) {
  const samples = await page.evaluate(() => (window as typeof window & {
    demoSamples: { stage: string; frame: number; headingTransform: string }[];
  }).demoSamples);
  const stages = [...new Set(samples.map(sample => sample.stage))];
  expect(stages).toEqual(expected);
  const titleHold = samples.filter(sample => sample.frame > titleFrame + 4 && sample.frame < titleFrame + 32);
  expect(titleHold.length).toBeGreaterThan(10);
  expect(new Set(titleHold.map(sample => sample.headingTransform)).size).toBe(1);
}
