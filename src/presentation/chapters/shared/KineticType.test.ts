import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { KineticType } from "./KineticType";
import { chapterTheme, openingGradient } from "../chapter-01/theme";

const timeline = vi.hoisted(() => ({ frame: 0 }));
vi.mock("remotion", async (original) => ({
  ...await original<typeof import("remotion")>(),
  useCurrentFrame: () => timeline.frame,
}));
const props = { lines: ["Beyond what", "we know."], settle: 25, reducedMotion: false };
const render = (frame: number, reducedMotion = false) => {
  timeline.frame = frame;
  return renderToStaticMarkup(createElement(KineticType, { ...props, reducedMotion }));
};

describe("Cumulative word typography", () => {
  it("uses Inter with the shared opening gradient and white surfaces", () => {
    expect(chapterTheme.font).toBe('"Inter", sans-serif');
    expect(chapterTheme.colors.dark).toBe(openingGradient);
    expect(openingGradient).toBe("linear-gradient(135deg, #ffad32, #ff741d 43%, #ff8e24)");
    expect(chapterTheme.colors.light).toBe("#ffffff");
    expect(chapterTheme.colors.ink).toBe("#111111");
  });
  it("adds words without removing previously revealed words", () => {
    for (const [frame, count] of [[3, 1], [9, 2], [15, 3], [25, 4]]) {
      const markup = render(frame!);
      expect(markup).toContain(`data-visible-words="${count}"`);
      for (let index = 0; index < count!; index++)
        expect(markup).toContain(`data-kinetic-word="${index}" data-visible="true"`);
      expect(markup).not.toContain("transform:");
      expect(markup).not.toContain("data-kinetic-beat");
    }
    expect(render(25)).toContain('aria-label="Beyond what we know."');
  });
  it("keeps the speaking hold still and reconstructs identical reverse frames", () => {
    const earlier = render(9);
    const hold = render(25);
    expect(render(10000)).toBe(hold);
    expect(render(9)).toBe(earlier);
  });
  it("uses a single whole-headline fade for reduced motion", () => {
    expect(render(0, true)).toContain('data-visible-words="0"');
    for (const frame of [3, 7, 17, 25]) {
      const markup = render(frame, true);
      expect(markup).toContain('data-visible-words="4"');
      expect(markup).not.toContain("transform:");
    }
  });
});
