import { createElement, type ImgHTMLAttributes, type PropsWithChildren } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { presentation } from "../../config";
import { PlaybackController, validatePresentation } from "../../../engine/PlaybackController";
import { Slide20Closing } from "./FirstStepSlides";
import { chapterFiveSlides } from "../chapter-05/slides";
import { chapterSixSlides } from "./slides";

const timeline = vi.hoisted(() => ({ frame: 0 }));
vi.mock("remotion", async (importOriginal) => ({
  ...await importOriginal<typeof import("remotion")>(),
  useCurrentFrame: () => timeline.frame,
  Sequence: ({ children }: PropsWithChildren) => children,
  Img: (props: ImgHTMLAttributes<HTMLImageElement>) => createElement("img", props),
  useVideoConfig: () => ({ fps: 30 }),
}));

describe("Chapters 05–06", () => {
  it("removes the home slide and keeps the closing as the last of 21 slides", () => {
    expect(() => validatePresentation(presentation)).not.toThrow();
    expect(presentation.slides).toHaveLength(21);
    expect(presentation.slides.map(slide => slide.id)).not.toContain("chapter-04-home");
    expect(presentation.slides.slice(16)).toEqual([...chapterFiveSlides, ...chapterSixSlides]);
  });

  it.each([false, true])("restores each closing statement and keeps the QR behind its cue, reduced motion %s", (reducedMotion) => {
    for (const [frame, count] of [[0, 0], [24, 1], [48, 2], [72, 3], [48, 2], [24, 1]] as const) {
      timeline.frame = frame;
      const markup = renderToStaticMarkup(createElement(Slide20Closing, { reducedMotion, slideCount: 21 }));
      for (let index = 1; index <= 3; index++) expect(markup.includes(`data-testid="closing-line-${index}"`)).toBe(index <= count);
      expect(markup).not.toContain('data-testid="closing-qr"');
    }
    timeline.frame = 163;
    const markup = renderToStaticMarkup(createElement(Slide20Closing, { reducedMotion, slideCount: 21 }));
    expect(markup).toContain('data-testid="closing-qr"');
    expect(markup).toContain('data-testid="promotional-qr"');
    expect(markup).toContain('href="https://atomiq-pi.vercel.app/"');
    expect(markup).not.toContain('data-testid="atomiq-phone"');
    expect(markup).not.toContain('data-testid="closing-message"');
  });

  it("holds the three statements and final QR, with reverse and restart", () => {
    const controller = new PlaybackController(presentation);
    controller.goToSlide(20);
    controller.finishTransition(controller.getSnapshot().revision);
    for (const target of [24, 48, 72, 163]) {
      expect(controller.getSnapshot()).toMatchObject({ targetFrame: target, phase: "playing" });
      controller.onEnded(controller.getSnapshot().revision);
      expect(controller.getSnapshot()).toMatchObject({ frame: target, phase: "paused" });
      controller.next();
    }
    expect(controller.getSnapshot()).toMatchObject({ slideIndex: 20, frame: 163, phase: "paused" });
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({ frame: 72, phase: "paused" });
    controller.restart();
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, targetFrame: 24, phase: "playing" });
  });
});
