import { describe, expect, it } from "vitest";
import { PlaybackController, validatePresentation } from "./PlaybackController";
import type { PresentationConfig } from "./types";

const component = () => null;
const config: PresentationConfig = {
  title: "Test deck",
  description: "",
  width: 1920,
  height: 1080,
  transitionFrames: 10,
  transitionFps: 30,
  slides: [
    {
      id: "first",
      title: "First",
      subtitle: "",
      component,
      fps: 30,
      durationInFrames: 100,
      checkpoints: [0, 30, 60, 99],
      checkpointLabels: ["Start", "First", "Second", "Final"],
      transition: "fade",
      notes: "",
      background: "#fff",
    },
    {
      id: "second",
      title: "Second",
      subtitle: "",
      component,
      fps: 60,
      durationInFrames: 150,
      checkpoints: [0, 50, 149],
      checkpointLabels: ["Start", "Opening", "Final"],
      transition: "none",
      notes: "",
      background: "#000",
    },
  ],
};

function settle(controller: PlaybackController) {
  const state = controller.getSnapshot();
  controller.onFrame(state.targetFrame, state.revision);
}

describe("frame-bounded presentation playback", () => {
  it("plays only the opening segment and waits indefinitely at the first hold", () => {
    const controller = new PlaybackController(config);
    expect(controller.getSnapshot()).toMatchObject({
      frame: 0,
      targetFrame: 30,
      phase: "playing",
    });
    settle(controller);
    expect(controller.getSnapshot()).toMatchObject({
      frame: 30,
      phase: "paused",
      slideIndex: 0,
    });
  });

  it("advances one checkpoint per interaction, then changes slides", () => {
    const controller = new PlaybackController(config);
    for (const target of [30, 60, 99]) {
      expect(controller.getSnapshot().targetFrame).toBe(target);
      settle(controller);
      controller.next();
    }
    expect(controller.getSnapshot()).toMatchObject({
      slideIndex: 1,
      frame: 0,
      phase: "transitioning",
    });
    controller.finishTransition(controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({
      frame: 0,
      targetFrame: 50,
      phase: "playing",
    });
  });

  it("immediately starts the next cue when interrupted and rejects stale completion", () => {
    const controller = new PlaybackController(config);
    const revision = controller.getSnapshot().revision;
    controller.onFrame(12, revision);
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({ frame: 30, targetFrame: 60, phase: "playing" });
    controller.onFrame(30, revision);
    controller.onEnded(revision);
    expect(controller.getSnapshot()).toMatchObject({ frame: 30, targetFrame: 60, phase: "playing" });
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({ frame: 60, targetFrame: 99, phase: "playing" });
    controller.next();
    expect(controller.getSnapshot()).toMatchObject({ slideIndex: 1, phase: "transitioning", transition: { fromFrame: 99 } });
  });

  it("guards duplicate navigation during a slide transition", () => {
    const controller = new PlaybackController(config);
    controller.goToSlide(1);
    const state = controller.getSnapshot();
    controller.next();
    controller.previous();
    controller.seek(50);
    controller.restart();
    controller.goToSlide(0);
    controller.toggle();
    expect(controller.getSnapshot()).toBe(state);
  });

  it("clamps dropped frames to the checkpoint", () => {
    const controller = new PlaybackController(config);
    controller.onFrame(89, controller.getSnapshot().revision);
    expect(controller.getSnapshot()).toMatchObject({
      frame: 30,
      phase: "paused",
    });
  });

  it("rejects stale frame, end, and transition completion events", () => {
    const controller = new PlaybackController(config);
    const oldRevision = controller.getSnapshot().revision;
    controller.restart();
    controller.onFrame(99, oldRevision);
    controller.onEnded(oldRevision);
    expect(controller.getSnapshot().frame).toBe(0);
    controller.goToSlide(1);
    controller.finishTransition(oldRevision);
    expect(controller.getSnapshot().phase).toBe("transitioning");
  });

  it("moves backward to exact deterministic checkpoints, including from mid-animation", () => {
    const controller = new PlaybackController(config);
    settle(controller);
    controller.next();
    controller.onFrame(48, controller.getSnapshot().revision);
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({
      frame: 30,
      targetFrame: 30,
      phase: "paused",
    });
    controller.previous();
    expect(controller.getSnapshot().frame).toBe(0);
  });

  it("revisits the previous slide at its last frame", () => {
    const controller = new PlaybackController(config);
    controller.goToSlide(1);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.toggle();
    controller.previous();
    expect(controller.getSnapshot()).toMatchObject({
      slideIndex: 0,
      frame: 99,
      targetFrame: 99,
      phase: "transitioning",
    });
    controller.finishTransition(controller.getSnapshot().revision);
    expect(controller.getSnapshot().phase).toBe("paused");
  });

  it("resumes a manually paused segment without skipping its target", () => {
    const controller = new PlaybackController(config);
    controller.onFrame(12, controller.getSnapshot().revision);
    controller.toggle();
    expect(controller.getSnapshot()).toMatchObject({
      phase: "paused",
      frame: 12,
    });
    controller.toggle();
    expect(controller.getSnapshot()).toMatchObject({
      phase: "playing",
      frame: 12,
      targetFrame: 30,
    });
  });

  it("restarts in place without requiring a component remount", () => {
    const controller = new PlaybackController(config);
    settle(controller);
    controller.seek(99);
    controller.restart();
    expect(controller.getSnapshot()).toMatchObject({
      slideIndex: 0,
      frame: 0,
      targetFrame: 30,
      phase: "playing",
    });
  });

  it("stays on the last slide after the final checkpoint", () => {
    const controller = new PlaybackController(config);
    controller.goToSlide(1, true);
    controller.finishTransition(controller.getSnapshot().revision);
    const state = controller.getSnapshot();
    controller.next();
    controller.toggle();
    expect(controller.getSnapshot()).toBe(state);
  });

  it("ignores non-checkpoint seeks and out-of-range navigation", () => {
    const controller = new PlaybackController(config);
    const state = controller.getSnapshot();
    controller.seek(47);
    controller.goToSlide(-1);
    controller.goToSlide(15);
    controller.goToSlide(0.5);
    expect(controller.getSnapshot()).toBe(state);
  });

  it("ignores backwards frame reports after a seek", () => {
    const controller = new PlaybackController(config);
    settle(controller);
    controller.next();
    controller.onFrame(12, controller.getSnapshot().revision);
    expect(controller.getSnapshot().frame).toBe(30);
  });

  it("cleans up subscriptions", () => {
    const controller = new PlaybackController(config);
    let calls = 0;
    const unsubscribe = controller.subscribe(() => calls++);
    settle(controller);
    unsubscribe();
    controller.next();
    expect(calls).toBe(1);
  });

  it("publishes frame telemetry without rerendering command subscribers", () => {
    const controller = new PlaybackController(config);
    let commands = 0;
    const snapshot = controller.getCommandSnapshot();
    const unsubscribe = controller.subscribeCommands(() => commands++);
    for (let frame = 1; frame < 30; frame++)
      controller.onFrame(frame, controller.getSnapshot().revision);
    expect(controller.getSnapshot().frame).toBe(29);
    expect(controller.getCommandSnapshot()).toBe(snapshot);
    expect(commands).toBe(0);
    settle(controller);
    expect(commands).toBe(1);
    expect(controller.getCommandSnapshot().frame).toBe(30);
    unsubscribe();
    controller.next();
    expect(commands).toBe(1);
  });

  it("can finish the final animation immediately without leaving the deck", () => {
    const controller = new PlaybackController(config);
    controller.goToSlide(1);
    controller.finishTransition(controller.getSnapshot().revision);
    controller.next();
    const revision = controller.getSnapshot().revision;
    controller.next();
    controller.onEnded(revision);
    expect(controller.getSnapshot()).toMatchObject({ slideIndex: 1, frame: 149, phase: "paused" });
  });
});

describe("presentation registry validation", () => {
  it("accepts independently configured slide FPS and durations", () =>
    expect(() => validatePresentation(config)).not.toThrow());
  it("rejects an empty deck", () =>
    expect(() => validatePresentation({ ...config, slides: [] })).toThrow());
  it("rejects duplicate identifiers", () =>
    expect(() =>
      validatePresentation({
        ...config,
        slides: [config.slides[0]!, config.slides[0]!],
      }),
    ).toThrow(/Duplicate/));
  it.each([
    [0, 60, 30, 99],
    [0, 30, 30, 99],
    [0, 30, 60, 101],
    [0, 30, 60, 98],
    [0, 30.5, 60, 99],
  ])("rejects malformed checkpoints %j", (...checkpoints) => {
    expect(() =>
      validatePresentation({
        ...config,
        slides: [{ ...config.slides[0]!, checkpoints }],
      }),
    ).toThrow();
  });
});
