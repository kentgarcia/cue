import { Player, Thumbnail } from "@remotion/player";
import type { CallbackListener, PlayerRef } from "@remotion/player";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { PlaybackController } from "./PlaybackController";
import type {
  PlaybackState,
  PresentationConfig,
  TransitionEffect,
  TransitionName,
} from "./types";

export const transitionEffects: Record<TransitionName, TransitionEffect> = {
  fade: (progress) => ({ outgoing: {}, incoming: { opacity: progress } }),
  "slide-left": (progress, direction) => ({
    outgoing: { transform: `translateX(${-progress * 100 * direction}%)` },
    incoming: { transform: `translateX(${(1 - progress) * 100 * direction}%)` },
  }),
  "slide-right": (progress, direction) => ({
    outgoing: { transform: `translateX(${progress * 100 * direction}%)` },
    incoming: {
      transform: `translateX(${-(1 - progress) * 100 * direction}%)`,
    },
  }),
  scale: (progress) => ({
    outgoing: {},
    incoming: {
      opacity: progress,
      transform: `scale(${0.94 + 0.06 * progress})`,
    },
  }),
  wipe: (progress, direction) => ({
    outgoing: {},
    incoming: {
      clipPath:
        direction > 0
          ? `inset(0 ${100 - progress * 100}% 0 0)`
          : `inset(0 0 0 ${100 - progress * 100}%)`,
    },
  }),
  none: () => ({ outgoing: { opacity: 0 }, incoming: {} }),
};

interface TransitionProps {
  config: PresentationConfig;
  state: PlaybackState;
  reducedMotion: boolean;
}

export function TransitionComposition({
  config,
  state,
  reducedMotion,
}: TransitionProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const transition = state.transition!;
  const outgoing = config.slides[transition.fromIndex]!;
  const incoming = config.slides[state.slideIndex]!;
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    easing: Easing.bezier(0.77, 0, 0.175, 1),
    extrapolateRight: "clamp",
  });
  const outgoingArtwork = (
    <Thumbnail
      component={outgoing.component}
      inputProps={{ reducedMotion, slideCount: config.slides.length }}
      frameToDisplay={transition.fromFrame}
      durationInFrames={outgoing.durationInFrames}
      fps={outgoing.fps}
      compositionWidth={config.width}
      compositionHeight={config.height}
      style={{ width: "100%", height: "100%" }}
    />
  );
  const incomingArtwork = (
    <Thumbnail
      component={incoming.component}
      inputProps={{ reducedMotion, slideCount: config.slides.length }}
      frameToDisplay={transition.toFrame}
      durationInFrames={incoming.durationInFrames}
      fps={incoming.fps}
      compositionWidth={config.width}
      compositionHeight={config.height}
      style={{ width: "100%", height: "100%" }}
    />
  );
  const CustomTransition = incoming.transitionComponent;
  if (CustomTransition && !reducedMotion)
    return (
      <CustomTransition
        outgoing={outgoingArtwork}
        incoming={incomingArtwork}
        progress={progress}
        frame={frame}
        durationInFrames={durationInFrames}
        direction={transition.direction}
        fromId={outgoing.id}
        toId={incoming.id}
        fromFrame={transition.fromFrame}
        toFrame={transition.toFrame}
        reducedMotion={reducedMotion}
      />
    );
  const styles = transitionEffects[
    reducedMotion ? "fade" : incoming.transition
  ](progress, transition.direction);
  return (
    <AbsoluteFill style={{ background: outgoing.background }}>
      <AbsoluteFill style={styles.outgoing}>{outgoingArtwork}</AbsoluteFill>
      <AbsoluteFill
        style={{ ...styles.incoming, background: incoming.background }}
      >
        {incomingArtwork}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function TransitionFailure({
  controller,
  revision,
}: {
  controller: PlaybackController;
  revision: number;
}) {
  useEffect(
    () => controller.finishTransition(revision),
    [controller, revision],
  );
  return null;
}

export function TransitionManager({
  config,
  state,
  controller,
  reducedMotion,
}: TransitionProps & { controller: PlaybackController }) {
  const playerRef = useRef<PlayerRef>(null);
  const revision = state.revision;
  const transitionName = config.slides[state.slideIndex]!.transition;
  const transitionFrames = config.slides[state.slideIndex]!.transitionFrames ?? config.transitionFrames;
  useLayoutEffect(() => {
    if (transitionName === "none") {
      controller.finishTransition(revision);
      return;
    }
    const player = playerRef.current;
    if (!player) return;
    const onEnded: CallbackListener<"ended"> = () =>
      controller.finishTransition(revision);
    const onError: CallbackListener<"error"> = () =>
      controller.finishTransition(revision);
    player.addEventListener("ended", onEnded);
    player.addEventListener("error", onError);
    player.play();
    return () => {
      player.pause();
      player.removeEventListener("ended", onEnded);
      player.removeEventListener("error", onError);
    };
  }, [controller, revision, transitionName]);
  if (transitionName === "none") return null;
  return (
    <div className="transition-layer" aria-hidden="true">
      <Player
        ref={playerRef}
        component={TransitionComposition}
        inputProps={{ config, state, reducedMotion }}
        durationInFrames={transitionFrames}
        fps={config.transitionFps}
        compositionWidth={config.width}
        compositionHeight={config.height}
        moveToBeginningWhenEnded={false}
        initiallyMuted
        numberOfSharedAudioTags={0}
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        errorFallback={() => (
          <TransitionFailure controller={controller} revision={revision} />
        )}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
