import { describe, expect, it } from "vitest";
import { entranceStyle } from "./motion";
import { presentation as fullPresentation } from "../../config";
import { chapterOneSlides } from "../../slides";
import { PlaybackController, validatePresentation } from "../../../engine/PlaybackController";
import { cameraPoseAt } from "./camera";

const presentation = { ...fullPresentation, slides: chapterOneSlides };

describe("Chapter 01 choreography", () => {
  it("validates slide-specific transition timing", () => {
    for (const transitionFrames of [1, 1.5]) {
      const config = { ...presentation, slides: [{ ...chapterOneSlides[1], transitionFrames }] };
      expect(() => validatePresentation(config)).toThrow("Invalid transition timing");
    }
    expect(() => validatePresentation(presentation)).not.toThrow();
  });

  it("holds every camera at a fixed pose once a cue has settled", () => {
    for (const [hold, tail] of [
      [14, 17],
      [31, 34],
      [48, 51],
      [65, 68],
      [82, 10000],
    ] as const) {
      expect(cameraPoseAt("aspirations", hold)).toEqual(
        cameraPoseAt("aspirations", tail),
      );
    }
    expect(cameraPoseAt("opening", 30)).toEqual(cameraPoseAt("opening", 10000));
    expect(cameraPoseAt("start-now", 26)).toEqual(
      cameraPoseAt("start-now", 10000),
    );
  });
  it("reconstructs the same camera on reverse seeks without accumulated state", () => {
    const firstPass = cameraPoseAt("aspirations", 39);
    cameraPoseAt("aspirations", 82);
    expect(cameraPoseAt("aspirations", 39)).toEqual(firstPass);
    expect(firstPass.scale).toBeGreaterThan(1);
  });
  it("disables zooms and reframing for reduced motion at every sampled frame", () => {
    for (const frame of [0, 8, 17, 36, 52, 80, 130, 164]) {
      for (const camera of ["opening", "aspirations", "start-now"] as const) {
        expect(cameraPoseAt(camera, frame, true)).toEqual({
          x: 0,
          y: 0,
          scale: 1,
        });
      }
    }
  });
  it("clamps settled springs to an identical static pose at every later frame", () => {
    const options = {
      fps: 30,
      start: 24,
      duration: 28,
      distance: 100,
      scaleFrom: 0.88,
    };
    expect(entranceStyle({ ...options, frame: 52 })).toEqual(
      entranceStyle({ ...options, frame: 10000 }),
    );
    expect(entranceStyle({ ...options, frame: 24 }).opacity).toBe(0);
  });
  it("removes spatial motion while retaining frame-controlled opacity", () => {
    expect(
      entranceStyle({
        frame: 20,
        fps: 30,
        start: 8,
        duration: 24,
        reducedMotion: true,
      }).transform,
    ).toBeUndefined();
  });
  it("reveals one profession per cue and reverses to the previous exact state", () => {
    const controller = new PlaybackController(presentation);
    const settle = () => controller.onEnded(controller.getSnapshot().revision);
    settle();
    controller.next();
    controller.finishTransition(controller.getSnapshot().revision);
    settle();
    expect(controller.getSnapshot()).toMatchObject({
      slideIndex: 1,
      frame: 14,
      phase: "paused",
    });
    for (const target of [31, 48, 65, 82]) {
      controller.next();
      expect(controller.getSnapshot().targetFrame).toBe(target);
      settle();
    }
    controller.previous();
    expect(controller.getSnapshot().frame).toBe(65);
    controller.restart();
    settle();
    expect(controller.getSnapshot().frame).toBe(14);
  });
  it("contains exactly the requested chapter and never advances past its last hold", () => {
    expect(presentation.slides).toHaveLength(3);
    const controller = new PlaybackController(presentation);
    controller.goToSlide(2, true);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({
      slideIndex: 2,
      frame: 26,
      phase: "paused",
    });
  });
});
