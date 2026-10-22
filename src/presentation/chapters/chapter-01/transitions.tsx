import { AbsoluteFill, useVideoConfig } from "remotion";
import type { SlideTransitionProps } from "../../../engine/types";

/** A rising white circle connects the event opener to the audience's first question. */
export function ChapterTransition({ outgoing, incoming, progress, fromId, toId, direction }: SlideTransitionProps) {
  const { width, height } = useVideoConfig();
  const openingToQuestion = direction === 1 && fromId === "chapter-01-opening" && toId === "chapter-01-aspirations";
  if (openingToQuestion) {
    const diameter = 240;
    const coverScale = (Math.hypot(width, height) + 4) / diameter;
    return <AbsoluteFill data-testid="opening-circle-transition" style={{ overflow: "hidden" }}>
      <AbsoluteFill>{outgoing}</AbsoluteFill>
      <div data-testid="transition-white-circle" style={{ position: "absolute", left: "50%", top: "50%", width: diameter, height: diameter, borderRadius: "50%", background: "#ffffff", transform: `translate(-50%, -50%) translateY(${(height / 2 + 52) * (1 - progress)}px) scale(${1 + (coverScale - 1) * progress})`, transformOrigin: "center", willChange: "transform" }} />
      <AbsoluteFill style={{ opacity: progress === 1 ? 1 : 0 }}>{incoming}</AbsoluteFill>
    </AbsoluteFill>;
  }
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <AbsoluteFill>{outgoing}</AbsoluteFill>
    <AbsoluteFill style={{ opacity: progress }}>{incoming}</AbsoluteFill>
  </AbsoluteFill>;
}
