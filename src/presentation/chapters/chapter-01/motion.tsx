import type { CSSProperties, PropsWithChildren } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { chapterTheme } from "./theme";
const gradientTextVariables = { "--slide-text-gradient": chapterTheme.colors.dark } as CSSProperties;
const entranceEasing = Easing.bezier(...chapterTheme.easing.entrance);

export function ramp(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: entranceEasing,
  });
}

interface EntranceOptions {
  frame: number;
  fps: number;
  start: number;
  duration: number;
  distance?: number;
  offsetX?: number;
  scaleFrom?: number;
  reducedMotion?: boolean;
}

export function entranceStyle({
  frame,
  start,
  duration,
  distance = 70,
  offsetX = 0,
  scaleFrom = 1,
  reducedMotion = false,
}: EntranceOptions): CSSProperties {
  const localFrame = frame - start;
  const progress =
    localFrame <= 0
      ? 0
      : localFrame >= duration
        ? 1
        : ramp(frame, start, start + duration);
  return {
    opacity: ramp(frame, start, start + Math.min(duration, 12)),
    transform: reducedMotion
      ? undefined
      : `translate3d(${offsetX * (1 - progress)}px, ${distance * (1 - progress)}px, 0) scale(${scaleFrom + (1 - scaleFrom) * progress})`,
    transformOrigin: "center center",
  };
}

export function MotionLine({
  children,
  startFrame,
  duration = 24,
  distance = 70,
  offsetX = 0,
  scaleFrom = 1,
  reducedMotion,
  style,
  testId,
}: PropsWithChildren<{
  startFrame: number;
  duration?: number;
  distance?: number;
  offsetX?: number;
  scaleFrom?: number;
  reducedMotion: boolean;
  style?: CSSProperties;
  testId?: string;
}>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      data-testid={testId}
      aria-hidden={frame <= startFrame}
      style={{
        ...style,
        ...entranceStyle({
          frame,
          fps,
          start: startFrame,
          duration,
          distance,
          offsetX,
          scaleFrom,
          reducedMotion,
        }),
      }}
    >
      {children}
    </div>
  );
}

export function ChapterCanvas({
  children,
  background,
  frame,
  chapter = "01",
}: PropsWithChildren<{ background: string; frame: number; chapter?: string }>) {
  return (
    <AbsoluteFill
      data-slide-frame={frame}
      data-chapter={chapter}
      className={`chapter-canvas${background === chapterTheme.colors.light ? " chapter-canvas--light" : ""}`}
      style={{
        ...gradientTextVariables,
        background,
        color: background === chapterTheme.colors.dark ? chapterTheme.colors.light : "#ff741d",
        fontFamily: chapterTheme.font,
        overflow: "hidden",
        fontSynthesis: "none",
        contain: "layout paint style",
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
