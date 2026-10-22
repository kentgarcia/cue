import type { PropsWithChildren } from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ramp } from "./motion";

export interface CameraPose {
  x: number;
  y: number;
  scale: number;
}
interface CameraKeyframe extends CameraPose {
  frame: number;
}
export type CameraName = "opening" | "aspirations" | "start-now";
const restingPose: CameraPose = { x: 0, y: 0, scale: 1 };
const cameraEasing = Easing.bezier(0.77, 0, 0.175, 1);

export const cameraTracks: Record<CameraName, readonly CameraKeyframe[]> = {
  opening: [
    { frame: 0, ...restingPose },
    { frame: 4, x: 96, y: 54, scale: 0.9 },
    { frame: 9, x: -192, y: -90, scale: 1.2 },
    { frame: 14, x: -144, y: -90, scale: 1.15 },
    { frame: 18, x: -96, y: -72, scale: 1.1 },
    { frame: 28, ...restingPose },
  ],
  aspirations: [
    { frame: 0, ...restingPose },
    { frame: 17, ...restingPose },
    { frame: 22, x: -76.8, y: -24, scale: 1.08 },
    { frame: 29, ...restingPose },
    { frame: 34, ...restingPose },
    { frame: 39, x: -76.8, y: -38, scale: 1.08 },
    { frame: 46, ...restingPose },
    { frame: 51, ...restingPose },
    { frame: 56, x: -76.8, y: -51, scale: 1.08 },
    { frame: 63, ...restingPose },
    { frame: 68, ...restingPose },
    { frame: 73, x: -76.8, y: -65, scale: 1.08 },
    { frame: 80, ...restingPose },
  ],
  "start-now": [
    { frame: 0, x: 96, y: 54, scale: 0.9 },
    { frame: 4, x: 96, y: 54, scale: 0.9 },
    { frame: 10, x: 48, y: 27, scale: 0.95 },
    { frame: 18, x: -76.8, y: -43.2, scale: 1.08 },
    { frame: 26, ...restingPose },
  ],
};

export function cameraPoseAt(
  name: CameraName,
  frame: number,
  reducedMotion = false,
): CameraPose {
  if (reducedMotion) return restingPose;
  const track = cameraTracks[name];
  const following = track.findIndex((keyframe) => keyframe.frame >= frame);
  if (following === -1) {
    const last = track.at(-1)!;
    return { x: last.x, y: last.y, scale: last.scale };
  }
  const next = track[following]!;
  if (following === 0 || frame === next.frame)
    return { x: next.x, y: next.y, scale: next.scale };
  const previous = track[following - 1]!;
  const progress = interpolate(frame, [previous.frame, next.frame], [0, 1], {
    easing: cameraEasing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    x: previous.x + (next.x - previous.x) * progress,
    y: previous.y + (next.y - previous.y) * progress,
    scale: previous.scale + (next.scale - previous.scale) * progress,
  };
}

export function CameraStage({
  children,
  name,
  frame,
  reducedMotion,
}: PropsWithChildren<{
  name: CameraName;
  frame: number;
  reducedMotion: boolean;
}>) {
  const pose = cameraPoseAt(name, frame, reducedMotion);
  return (
    <AbsoluteFill
      data-camera={name}
      style={{
        transformOrigin: "0 0",
        willChange: !reducedMotion && frame < cameraTracks[name].at(-1)!.frame ? "transform" : undefined,
        transform: reducedMotion
          ? undefined
          : `translate3d(${pose.x}px, ${pose.y}px, 0) scale(${pose.scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

export function EditorialFrame({
  frame,
  color,
  top = 188,
  bottom = 830,
  opacity = 0.16,
  exitProgress = 0,
  reducedMotion,
}: {
  frame: number;
  color: string;
  top?: number;
  bottom?: number;
  opacity?: number;
  exitProgress?: number;
  reducedMotion: boolean;
}) {
  const draw = ramp(frame, 1, 10);
  return (
    <AbsoluteFill
      data-editorial-frame="true"
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        opacity: draw * opacity * (1 - exitProgress),
      }}
    >
      {[top, bottom].map((position) => (
        <div
          key={position}
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            top: position,
            height: 1.5,
            background: color,
            transform: reducedMotion ? undefined : `scaleX(${draw})`,
            transformOrigin: "left center",
          }}
        />
      ))}
      {[96, 1824].map((position) => (
        <div
          key={position}
          style={{
            position: "absolute",
            left: position,
            top,
            width: 1.5,
            height: bottom - top,
            background: color,
            transform: reducedMotion ? undefined : `scaleY(${draw})`,
            transformOrigin: "center top",
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

export function PerspectiveRoom({
  frame,
  color,
  reducedMotion,
}: {
  frame: number;
  color: string;
  reducedMotion: boolean;
}) {
  if (reducedMotion) return null;
  const opacity = ramp(frame, 4, 8) * (1 - ramp(frame, 14, 22));
  if (opacity === 0) return null;
  const scale = interpolate(frame, [4, 11, 20], [0.95, 1.05, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cameraEasing,
  });
  return (
    <AbsoluteFill
      aria-hidden="true"
      style={{
        opacity: opacity * 0.18,
        transform: `scale(${scale})`,
        transformOrigin: "960px 540px",
        pointerEvents: "none",
      }}
    >
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      >
        <path d="M0 0 400 285H1520L1920 0M0 1080 400 795H1520L1920 1080M400 285V795M1520 285V795" />
      </svg>
    </AbsoluteFill>
  );
}
