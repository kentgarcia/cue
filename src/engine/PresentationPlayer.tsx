import { Player } from "@remotion/player";
import type { CallbackListener, PlayerRef } from "@remotion/player";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PlaybackController } from "./PlaybackController";
import type { PlaybackState, PresentationConfig } from "./types";

interface Props {
  config: PresentationConfig;
  state: PlaybackState;
  controller: PlaybackController;
  reducedMotion: boolean;
}

function ReportSlideError({
  error,
  onError,
}: {
  error: Error;
  onError: (message: string) => void;
}) {
  useEffect(() => onError(error.message), [error, onError]);
  return null;
}

export const PresentationPlayer = memo(function PresentationPlayer({
  config,
  state,
  controller,
  reducedMotion,
}: Props) {
  const playerRef = useRef<PlayerRef>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const inputProps = useMemo(
    () => ({ reducedMotion, slideCount: config.slides.length, ambientMotion: true }),
    [reducedMotion, config.slides.length],
  );
  const slide = config.slides[state.slideIndex]!;
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState(0);
  const revision = state.revision;

  useLayoutEffect(() => {
    const updateFrame = () => {
      if (layerRef.current)
        layerRef.current.dataset.frame = String(controller.getSnapshot().frame);
    };
    updateFrame();
    return controller.subscribe(updateFrame);
  }, [controller]);

  useLayoutEffect(() => {
    const player = playerRef.current;
    if (!player || error) return;
    const command = controller.getSnapshot();
    let active = true;
    let correcting = false;
    const onFrame: CallbackListener<"frameupdate"> = ({ detail }) => {
      if (!active || correcting || command.phase !== "playing" || revision !== controller.getSnapshot().revision) return;
      if (detail.frame >= command.targetFrame) {
        correcting = true;
        player.pause();
        if (detail.frame !== command.targetFrame)
          player.seekTo(command.targetFrame);
        correcting = false;
      }
      controller.onFrame(detail.frame, revision);
    };
    const onEnded: CallbackListener<"ended"> = () => {
      if (!active || correcting || command.phase !== "playing" || revision !== controller.getSnapshot().revision) return;
      correcting = true;
      player.pause();
      if (player.getCurrentFrame() !== command.targetFrame)
        player.seekTo(command.targetFrame);
      correcting = false;
      controller.onEnded(revision);
    };
    const onError: CallbackListener<"error"> = ({ detail }) => {
      player.pause();
      setError(detail.error.message);
    };
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("ended", onEnded);
    player.addEventListener("error", onError);
    player.pause();
    player.seekTo(command.frame);
    if (command.phase === "playing") player.play();
    return () => {
      active = false;
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("error", onError);
      player.pause();
    };
  }, [controller, revision, error, recovery]);

  return (
    <div
      ref={layerRef}
      className="player-layer"
      style={{ background: slide.background }}
      data-testid="presentation-player"
      data-frame={state.frame}
      data-phase={state.phase}
      data-slide={slide.id}
      data-target={state.targetFrame}
    >
      <Player
        key={`${slide.id}-${recovery}`}
        ref={playerRef}
        component={slide.component}
        inputProps={inputProps}
        durationInFrames={slide.durationInFrames}
        fps={slide.fps}
        compositionWidth={config.width}
        compositionHeight={config.height}
        initialFrame={state.frame}
        outFrame={Math.max(1, state.targetFrame)}
        moveToBeginningWhenEnded={false}
        initiallyMuted
        numberOfSharedAudioTags={0}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        browserMediaControlsBehavior={{ mode: "do-nothing" }}
        errorFallback={({ error: compositionError }: { error: Error }) => (
          <ReportSlideError error={compositionError} onError={setError} />
        )}
        style={{ width: "100%", height: "100%" }}
      />
      {error ? (
        <div className="player-error" role="alert">
          <strong>This slide couldn’t render.</strong>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setRecovery((value) => value + 1);
              controller.restart();
            }}
          >
            Retry slide
          </button>
        </div>
      ) : null}
    </div>
  );
});
