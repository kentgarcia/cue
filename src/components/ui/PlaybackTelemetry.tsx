import { usePlaybackSnapshot, usePresentation } from "../../engine/PresentationEngine";

export function CueTimeline() {
  const { config, controller } = usePresentation();
  const state = usePlaybackSnapshot();
  const slide = config.slides[state.slideIndex]!;
  const cueIndex = Math.max(0, slide.checkpoints.findLastIndex((frame) => frame <= state.frame));
  return (
    <div className="checkpoint-row">
      <div className="checkpoint-title">
        <span className="eyebrow">ANIMATION CUES</span>
        <span>{cueIndex} <span className="muted">/ {slide.checkpoints.length - 1}</span></span>
      </div>
      <div className="checkpoint-track">
        {slide.checkpoints.slice(1).map((frame, index) => (
          <button
            key={frame}
            className={`checkpoint ${state.frame >= frame ? "is-reached" : ""} ${state.targetFrame === frame && state.phase === "playing" ? "is-playing" : ""}`}
            aria-label={`Seek to cue ${index + 1}: ${slide.checkpointLabels[index + 1]}`}
            disabled={state.phase === "transitioning"}
            onClick={() => controller.seek(frame)}
          >
            <span className="checkpoint-rail">
              <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, (state.frame - slide.checkpoints[index]!) / (frame - slide.checkpoints[index]!)))})` }} />
            </span>
            <span className="checkpoint-label">
              <span>{String(index + 1).padStart(2, "0")}</span>
              {slide.checkpointLabels[index + 1]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FrameReadout() {
  const { config } = usePresentation();
  const state = usePlaybackSnapshot();
  const slide = config.slides[state.slideIndex]!;
  return (
    <div className="frame-display">
      <span>{String(state.frame).padStart(3, "0")}</span>
      <span className="muted"> / {slide.durationInFrames - 1} f</span>
      <span className="fps-badge">{slide.fps} FPS</span>
    </div>
  );
}
