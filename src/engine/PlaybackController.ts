import type {
  PlaybackState,
  PresentationConfig,
  SlideDefinition,
} from "./types";

export function validatePresentation(config: PresentationConfig): void {
  if (!config.slides.length)
    throw new Error("A presentation needs at least one slide.");
  if (
    config.width <= 0 ||
    config.height <= 0 ||
    !Number.isFinite(config.width + config.height)
  )
    throw new Error("Invalid canvas dimensions.");
  if (
    !Number.isInteger(config.transitionFrames) ||
    config.transitionFrames < 2 ||
    !Number.isFinite(config.transitionFps) ||
    config.transitionFps <= 0
  )
    throw new Error("Invalid transition timing.");
  const identifiers = new Set<string>();
  for (const slide of config.slides) {
    if (identifiers.has(slide.id))
      throw new Error(`Duplicate slide id: ${slide.id}`);
    identifiers.add(slide.id);
    if (
      !Number.isInteger(slide.durationInFrames) ||
      slide.durationInFrames < 2 ||
      !Number.isFinite(slide.fps) ||
      slide.fps <= 0
    )
      throw new Error(`Invalid timing for ${slide.id}`);
    if (slide.transitionFrames !== undefined && (!Number.isInteger(slide.transitionFrames) || slide.transitionFrames < 2))
      throw new Error(`Invalid transition timing for ${slide.id}`);
    if (
      slide.checkpoints.length < 2 ||
      slide.checkpoints[0] !== 0 ||
      slide.checkpoints.at(-1) !== slide.durationInFrames - 1
    )
      throw new Error(
        `${slide.id}: checkpoints must include 0 and the final frame.`,
      );
    if (slide.checkpoints.length !== slide.checkpointLabels.length)
      throw new Error(`${slide.id}: every checkpoint needs a label.`);
    slide.checkpoints.forEach((frame, index) => {
      if (
        !Number.isInteger(frame) ||
        frame < 0 ||
        frame >= slide.durationInFrames ||
        (index > 0 && frame <= slide.checkpoints[index - 1]!)
      )
        throw new Error(
          `${slide.id}: checkpoints must be increasing integer frames.`,
        );
    });
  }
}

export class PlaybackController {
  private state: PlaybackState;
  private commandState: PlaybackState;
  private listeners = new Set<() => void>();
  private commandListeners = new Set<() => void>();

  constructor(readonly config: PresentationConfig) {
    validatePresentation(config);
    this.state = {
      slideIndex: 0,
      frame: 0,
      targetFrame: config.slides[0]!.checkpoints[1]!,
      phase: "playing",
      revision: 0,
      transition: null,
    };
    this.commandState = this.state;
  }

  getSnapshot = (): PlaybackState => this.state;
  getCommandSnapshot = (): PlaybackState => this.commandState;
  subscribeCommands = (listener: () => void): (() => void) => {
    this.commandListeners.add(listener);
    return () => this.commandListeners.delete(listener);
  };
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(patch: Partial<PlaybackState>, command = false): void {
    this.state = {
      ...this.state,
      ...patch,
      revision: this.state.revision + (command ? 1 : 0),
    };
    if (command) {
      this.commandState = this.state;
      this.commandListeners.forEach((listener) => listener());
    }
    this.listeners.forEach((listener) => listener());
  }

  private get slide(): SlideDefinition {
    return this.config.slides[this.state.slideIndex]!;
  }

  next = (): void => {
    if (this.state.phase === "transitioning") return;
    const frame = this.state.phase === "playing"
      ? this.state.targetFrame
      : this.state.frame;
    const target = this.slide.checkpoints.find(
      (checkpoint) => checkpoint > frame,
    );
    if (target !== undefined)
      this.update({ frame, targetFrame: target, phase: "playing" }, true);
    else {
      if (this.state.phase === "playing")
        this.update({ frame, targetFrame: frame, phase: "paused" }, true);
      this.goToSlide(this.state.slideIndex + 1);
    }
  };

  previous = (): void => {
    if (this.state.phase === "transitioning") return;
    const target = this.slide.checkpoints.findLast(
      (checkpoint) => checkpoint < this.state.frame,
    );
    if (target !== undefined) this.seek(target);
    else if (this.state.slideIndex > 0)
      this.goToSlide(this.state.slideIndex - 1, true);
    else this.seek(0);
  };

  toggle = (): void => {
    if (this.state.phase === "transitioning") return;
    if (this.state.phase === "playing") this.update({ phase: "paused" }, true);
    else this.next();
  };

  seek = (frame: number): void => {
    if (
      this.state.phase === "transitioning" ||
      !this.slide.checkpoints.includes(frame)
    )
      return;
    this.update({ frame, targetFrame: frame, phase: "paused" }, true);
  };

  restart = (): void => {
    if (this.state.phase === "transitioning") return;
    this.update(
      { frame: 0, targetFrame: this.slide.checkpoints[1]!, phase: "playing" },
      true,
    );
  };

  goToSlide = (index: number, atEnd = false): void => {
    if (
      this.state.phase === "transitioning" ||
      index < 0 ||
      index >= this.config.slides.length ||
      !Number.isInteger(index)
    )
      return;
    if (index === this.state.slideIndex) {
      if (atEnd) this.seek(this.slide.durationInFrames - 1);
      else this.restart();
      return;
    }
    const destination = this.config.slides[index]!;
    const frame = atEnd ? destination.durationInFrames - 1 : 0;
    const transition = {
      fromIndex: this.state.slideIndex,
      fromFrame: this.state.frame,
      toFrame: frame,
      direction: index > this.state.slideIndex ? (1 as const) : (-1 as const),
    };
    this.update(
      {
        slideIndex: index,
        frame,
        targetFrame: atEnd ? frame : destination.checkpoints[1]!,
        phase: "transitioning",
        transition,
      },
      true,
    );
  };

  finishTransition = (revision: number): void => {
    if (
      this.state.phase !== "transitioning" ||
      revision !== this.state.revision
    )
      return;
    this.update(
      {
        phase: this.state.frame < this.state.targetFrame ? "playing" : "paused",
        transition: null,
      },
      true,
    );
  };

  onFrame = (frame: number, revision: number): void => {
    if (revision !== this.state.revision || this.state.phase !== "playing")
      return;
    const bounded = Math.min(frame, this.state.targetFrame);
    if (bounded < this.state.frame) return;
    if (bounded >= this.state.targetFrame)
      this.update({ frame: this.state.targetFrame, phase: "paused" }, true);
    else if (bounded !== this.state.frame) this.update({ frame: bounded });
  };

  onEnded = (revision: number): void => {
    this.onFrame(this.state.targetFrame, revision);
  };
}
