import { createContext, useContext } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../presentation/theme";

export const ReducedMotionContext = createContext(false);

interface AnimationProps extends PropsWithChildren {
  startFrame?: number;
  durationInFrames?: number;
  style?: CSSProperties;
}

export function useProgress(
  startFrame = 0,
  durationInFrames: number = theme.motion.entrance,
  springBased = false,
): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reduced = useContext(ReducedMotionContext);
  if (frame < startFrame) return 0;
  if (springBased && !reduced)
    return spring({
      frame: frame - startFrame,
      fps,
      durationInFrames,
      config: theme.motion.spring,
    });
  return interpolate(
    frame,
    [startFrame, startFrame + Math.max(1, durationInFrames)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
}

export function FadeIn({
  children,
  startFrame = 0,
  durationInFrames = 20,
  style,
}: AnimationProps) {
  const progress = useProgress(startFrame, durationInFrames);
  return <div style={{ ...style, opacity: progress }}>{children}</div>;
}

export function SlideIn({
  children,
  startFrame = 0,
  durationInFrames = 26,
  style,
  direction = "up",
}: AnimationProps & { direction?: "up" | "left" | "right" }) {
  const progress = useProgress(startFrame, durationInFrames, true);
  const reduced = useContext(ReducedMotionContext);
  const distance = reduced ? 0 : (1 - progress) * 70;
  const transform =
    direction === "up"
      ? `translateY(${distance}px)`
      : `translateX(${direction === "left" ? -distance : distance}px)`;
  return (
    <div style={{ ...style, opacity: Math.min(1, progress), transform }}>
      {children}
    </div>
  );
}

export function ScaleIn({
  children,
  startFrame = 0,
  durationInFrames = 26,
  style,
}: AnimationProps) {
  const progress = useProgress(startFrame, durationInFrames, true);
  const reduced = useContext(ReducedMotionContext);
  return (
    <div
      style={{
        ...style,
        opacity: Math.min(1, progress),
        transform: `scale(${reduced ? 1 : 0.9 + progress * 0.1})`,
      }}
    >
      {children}
    </div>
  );
}

export function TextReveal({
  children,
  startFrame = 0,
  durationInFrames = 26,
  style,
}: AnimationProps) {
  const progress = useProgress(startFrame, durationInFrames);
  const reduced = useContext(ReducedMotionContext);
  return (
    <div
      style={{
        ...style,
        opacity: reduced ? progress : 1,
        clipPath: reduced ? undefined : `inset(0 ${100 - progress * 100}% 0 0)`,
      }}
    >
      {children}
    </div>
  );
}

export function AnimatedText({
  text,
  animation = "spring-up",
  startFrame = 0,
  durationInFrames = 26,
  stagger = 4,
  style,
}: Omit<AnimationProps, "children"> & {
  text: string;
  animation?: "spring-up" | "fade" | "reveal";
  stagger?: number;
}) {
  const Wrapper =
    animation === "fade"
      ? FadeIn
      : animation === "reveal"
        ? TextReveal
        : SlideIn;
  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        columnGap: "0.24em",
        ...style,
      }}
    >
      {text.split(" ").map((word, index) => (
        <Wrapper
          key={`${index}-${word}`}
          startFrame={startFrame + index * stagger}
          durationInFrames={durationInFrames}
          style={{ display: "inline-block" }}
        >
          {word}
        </Wrapper>
      ))}
    </span>
  );
}

export function StaggeredText(
  props: Omit<Parameters<typeof AnimatedText>[0], "animation">,
) {
  return <AnimatedText {...props} animation="spring-up" />;
}

export function WordByWord({
  text,
  wordFrames,
  style,
}: {
  text: string;
  wordFrames: readonly number[];
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        columnGap: "0.23em",
        ...style,
      }}
    >
      {text.split(" ").map((word, index) => (
        <SlideIn
          key={`${index}-${word}`}
          startFrame={wordFrames[index] ?? index * 8}
          style={{ display: "inline-block" }}
        >
          {word}
        </SlideIn>
      ))}
    </span>
  );
}

export function ProgressiveReveal({
  children,
  atFrame,
  style,
}: PropsWithChildren<{ atFrame: number; style?: CSSProperties }>) {
  return (
    <SlideIn startFrame={atFrame} style={style}>
      {children}
    </SlideIn>
  );
}

export function AnimatedNumber({
  value,
  startFrame = 0,
  durationInFrames = 30,
  suffix = "",
  style,
}: {
  value: number;
  startFrame?: number;
  durationInFrames?: number;
  suffix?: string;
  style?: CSSProperties;
}) {
  const progress = useProgress(startFrame, durationInFrames);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {Math.round(progress * value).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function AnimatedShape({
  kind = "star",
  color = theme.colors.orange,
  size = 300,
  startFrame = 0,
  style,
}: {
  kind?: "star" | "circle" | "arch";
  color?: string;
  size?: number;
  startFrame?: number;
  style?: CSSProperties;
}) {
  const progress = useProgress(startFrame, 30, true);
  const reduced = useContext(ReducedMotionContext);
  const star =
    "50% 0%, 59% 26%, 79% 10%, 76% 36%, 100% 39%, 80% 55%, 95% 76%, 68% 75%, 66% 100%, 50% 80%, 32% 100%, 32% 74%, 7% 79%, 21% 56%, 0% 42%, 26% 36%, 21% 11%, 42% 27%";
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius:
          kind === "circle"
            ? "50%"
            : kind === "arch"
              ? "50% 50% 0 0"
              : undefined,
        clipPath: kind === "star" ? `polygon(${star})` : undefined,
        ...style,
        opacity: Math.min(progress, 1),
        transform: reduced
          ? undefined
          : `rotate(${(1 - progress) * -28}deg) scale(${0.9 + progress * 0.1})`,
      }}
    />
  );
}
