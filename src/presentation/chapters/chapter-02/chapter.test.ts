import { describe, expect, it } from "vitest";
import { PlaybackController, validatePresentation } from "../../../engine/PlaybackController";
import { presentation } from "../../config";
import { chapterTwoSlides } from "./slides";
import { associations } from "./Slide04Nuclear";
import { entranceStyle } from "../chapter-01/motion";
import { characterAssets } from "./assets";

describe("Chapter 02 — The Challenge", () => {
  it("appends slides 04–07 without replacing Chapter 01", () => {
    expect(presentation.slides.slice(3, 7)).toEqual(chapterTwoSlides);
    expect(() => validatePresentation(presentation)).not.toThrow();
    expect(chapterTwoSlides.every((slide) => slide.chapter.number === "02")).toBe(true);
  });

  it("reveals each association independently and reconstructs prior holds", () => {
    const controller = new PlaybackController(presentation);
    controller.goToSlide(3);
    controller.finishTransition(controller.getSnapshot().revision);
    const settle = () => controller.onEnded(controller.getSnapshot().revision);
    for (const [index, target] of [14, 31, 48, 65, 82].entries()) {
      expect(controller.getSnapshot().targetFrame).toBe(target);
      settle();
      expect(associations.filter(({ start }) => start < target)).toHaveLength(Math.max(0, index - 1));
      if (index < 4) controller.next();
    }
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({ frame: 65, phase: "paused" });
    expect(associations.filter(({ start }) => start < controller.getSnapshot().frame)).toHaveLength(2);
  });

  it("keeps the completed comic sequence and final question on indefinite holds", () => {
    const controller = new PlaybackController(presentation);
    controller.goToSlide(4);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.onEnded(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 114, phase: "paused", slideIndex: 4 });
    controller.goToSlide(6, true);
    controller.finishTransition(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 24, phase: "paused", slideIndex: 6 });
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({ slideIndex: 7, phase: "transitioning" });
  });

  it("settles all association entrances before their holds, including reduced motion", () => {
    associations.forEach(({ start }, index) => {
      const options = { fps: 30, start, duration: 11, frame: chapterTwoSlides[0].checkpoints[index + 3]! };
      expect(entranceStyle(options)).toEqual(entranceStyle({ ...options, frame: 10000 }));
      expect(entranceStyle({ ...options, reducedMotion: true }).transform).toBeUndefined();
    });
  });

  it("plays all four comic panels as one sequence and supports restart", () => {
    expect(characterAssets.map(({ label }) => label)).toEqual(["Teenage Mutant Ninja Turtles", "Hulk", "Gagamboy", "The Powerpuff Girls"]);
    expect(characterAssets.every(({ src }) => src.startsWith("/media/slide-5/"))).toBe(true);
    const controller = new PlaybackController(presentation);
    controller.goToSlide(4);
    controller.finishTransition(controller.getSnapshot().revision);
    for (const [index, frame] of [15, 45, 75, 105].entries()) {
      controller.onFrame(frame, controller.getSnapshot().revision);
      expect(controller.getSnapshot()).toMatchObject({ targetFrame: 114, phase: "playing" });
      expect(characterAssets.filter(asset => asset.start < frame)).toHaveLength(index + 1);
    }
    controller.onEnded(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 114, phase: "paused" });
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, phase: "paused" });
    controller.restart();
    expect(controller.getSnapshot()).toMatchObject({ frame: 0, targetFrame: 114, phase: "playing" });
  });
});
