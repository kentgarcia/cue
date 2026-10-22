import { ChevronLeft, ChevronRight, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePresentation } from "../../engine/PresentationEngine";
import { PresentationPlayer } from "../../engine/PresentationPlayer";
import { TransitionManager } from "../../engine/TransitionManager";
import { IconButton } from "./IconButton";

export function PresentationStage() {
  const {
    config,
    state,
    controller,
    stageRef,
    presenting,
    exit,
    reducedMotion,
  } = usePresentation();
  const [controlsVisible, setControlsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showControls = () => {
    setControlsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setControlsVisible(false), 2200);
  };
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  useEffect(() => {
    if (presenting) stageRef.current?.focus({ preventScroll: true });
  }, [presenting, stageRef]);
  const lastSlide = state.slideIndex === config.slides.length - 1;
  const end =
    lastSlide &&
    state.frame === config.slides[state.slideIndex]!.durationInFrames - 1;
  return (
    <div
      ref={stageRef}
      tabIndex={-1}
      className={`presentation-stage ${presenting ? "is-presenting" : ""}`}
      onPointerMove={presenting ? showControls : undefined}
    >
      <div
        className="canvas"
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest(
              'button, a, input, textarea, select, [contenteditable="true"], [role="button"]',
            )
          )
            return;
          controller.next();
        }}
      >
        <PresentationPlayer
          key={config.slides[state.slideIndex]!.id}
          config={config}
          state={state}
          controller={controller}
          reducedMotion={reducedMotion}
        />
        {state.transition ? (
          <TransitionManager
            key={state.revision}
            config={config}
            state={state}
            controller={controller}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>
      {presenting ? (
        <div
          className={`presenter-controls ${controlsVisible ? "is-visible" : ""}`}
        >
          <IconButton
            label="Previous cue"
            onClick={controller.previous}
            disabled={state.phase === "transitioning"}
          >
            <ChevronLeft size={22} />
          </IconButton>
          <span>
            {state.slideIndex + 1}{" "}
            <span className="muted">/ {config.slides.length}</span>
          </span>
          <IconButton
            label="Next cue"
            onClick={controller.next}
            disabled={state.phase === "transitioning" || end}
          >
            <ChevronRight size={22} />
          </IconButton>
          <span className="dock-divider" />
          <IconButton label="Exit presentation" onClick={exit}>
            <Minimize2 size={18} />
          </IconButton>
        </div>
      ) : null}
    </div>
  );
}
