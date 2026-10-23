import { createElement, type ImgHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { presentation } from "../../config";
import { validatePresentation, PlaybackController } from "../../../engine/PlaybackController";
import { Slide10Quiz } from "./IdeaSlides";

const timeline = vi.hoisted(() => ({ frame: 0 }));
vi.mock("remotion", async (importOriginal) => ({
  ...await importOriginal<typeof import("remotion")>(),
  Img: (props: ImgHTMLAttributes<HTMLImageElement>) => createElement("img", props),
  useCurrentFrame: () => timeline.frame,
  useVideoConfig: () => ({ fps: 30 }),
}));

describe("Chapters 03–04 presenter gates", () => {
  it("registers separate feature slides once, with the human perspective appearing once", () => {
    expect(() => validatePresentation(presentation)).not.toThrow();
    expect(presentation.slides.slice(7, 16).map((slide) => slide.chapter?.number)).toEqual(["03", "03", "03", "03", "03", "03", "04", "04", "04"]);
    expect(presentation.slides.filter((slide) => slide.id === "chapter-04-human")).toHaveLength(1);
  });

  it.each([[8, 288], [9, 372], [10, 468]])("plays slide index %i through its full demo, then holds", (index, finalFrame) => {
    const controller = new PlaybackController(presentation);
    controller.goToSlide(index);
    controller.finishTransition(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, targetFrame: finalFrame, phase: "playing" });
    controller.onFrame(100, controller.getSnapshot().revision);
    controller.toggle();
    expect(controller.getSnapshot()).toMatchObject({ frame: 100, phase: "paused" });
    controller.toggle();
    expect(controller.getSnapshot()).toMatchObject({ frame: 100, targetFrame: finalFrame, phase: "playing" });
    controller.onEnded(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ slideIndex: index, frame: finalFrame, phase: "paused" });
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, phase: "paused" });
    controller.restart();
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, targetFrame: finalFrame, phase: "playing" });
  });

  it("does not put the quiz answer in rendered markup before the reveal cue, including reverse seeks", () => {
    for (const reducedMotion of [false, true]) {
      for (const [frame, revealed] of [[0, false], [24, false], [120, true], [24, false], [0, false]] as const) {
        timeline.frame = frame;
        const markup = renderToStaticMarkup(createElement(Slide10Quiz, { reducedMotion, slideCount: 15 }));
        expect(markup.includes('data-testid="quiz-answer"')).toBe(revealed);
        expect(markup.includes("potassium-40")).toBe(revealed);
      }
    }
  });

  it("holds on the vote and only targets the answer when the presenter advances", () => {
    const controller = new PlaybackController(presentation);
    controller.goToSlide(11);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.onEnded(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 24, targetFrame: 24, phase: "paused" });
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({ targetFrame: 120, phase: "playing" });
    controller.onEnded(controller.getSnapshot().revision);
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({ frame: 24, targetFrame: 24, phase: "paused" });
  });

  it.each([12, 13])("reveals the photo and title in one cue on slide index %i", (index) => {
    const controller = new PlaybackController(presentation);
    expect(presentation.slides[index]!.checkpoints).toEqual([0, 24]);
    controller.goToSlide(index);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.onEnded(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 24, phase: "paused" });
    controller.next();
    expect(controller.getSnapshot().slideIndex).toBe(index + 1);
  });
});
