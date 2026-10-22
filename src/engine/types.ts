import type { ComponentType, CSSProperties, ReactNode } from "react";

export type TransitionName =
  "fade" | "slide-left" | "slide-right" | "scale" | "wipe" | "none";

export interface SlideProps {
  reducedMotion: boolean;
  slideCount: number;
  /** Opt-in ambient effects for the live stage only. Thumbnails and transition snapshots stay static. */
  ambientMotion?: boolean;
}

export interface SlideDefinition {
  id: string;
  title: string;
  subtitle: string;
  chapter?: { number: string; title: string };
  component: ComponentType<SlideProps>;
  durationInFrames: number;
  fps: number;
  checkpoints: readonly number[];
  checkpointLabels: readonly string[];
  transition: TransitionName;
  transitionComponent?: ComponentType<SlideTransitionProps>;
  /** Override the deck transition duration when an individual reveal needs more time. */
  transitionFrames?: number;
  notes: string;
  background: string;
}

export interface PresentationConfig {
  title: string;
  description: string;
  width: number;
  height: number;
  transitionFrames: number;
  transitionFps: number;
  slides: readonly SlideDefinition[];
}

export interface SlideTransitionProps {
  outgoing: ReactNode;
  incoming: ReactNode;
  progress: number;
  frame: number;
  durationInFrames: number;
  direction: 1 | -1;
  fromId: string;
  toId: string;
  fromFrame: number;
  toFrame: number;
  reducedMotion: boolean;
}

export interface TransitionSnapshot {
  fromIndex: number;
  fromFrame: number;
  toFrame: number;
  direction: 1 | -1;
}

export interface PlaybackState {
  slideIndex: number;
  frame: number;
  targetFrame: number;
  phase: "playing" | "paused" | "transitioning";
  revision: number;
  transition: TransitionSnapshot | null;
}

export type TransitionEffect = (
  progress: number,
  direction: 1 | -1,
) => {
  outgoing: CSSProperties;
  incoming: CSSProperties;
};
