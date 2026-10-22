import { useCurrentFrame, useVideoConfig } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, entranceStyle, ramp } from "./motion";
import { chapterTheme } from "./theme";

export const professions = [
  { text: "ENGINEER?", start: 17, duration: 11 },
  { text: "SCIENTIST?", start: 34, duration: 12 },
  { text: "DOCTOR?", start: 51, duration: 11 },
  { text: "ARCHITECT?", start: 68, duration: 12 },
] as const;

export function AspirationsArtwork({ frame, fps, reducedMotion, background = chapterTheme.colors.light }: { frame: number; fps: number; reducedMotion: boolean; background?: string }) {
  const questionOpacity = ramp(frame, 0, 10) * (1 - ramp(frame, 14, 17));
  return (
    <ChapterCanvas frame={frame} background={background}>
      <div data-testid="aspirations-question" aria-hidden={frame > 14} style={{ position: "absolute", inset: 0, padding: "0 128px", display: "grid", placeItems: "center", textAlign: "center", opacity: questionOpacity }}>
        <h1 style={{ margin: 0, fontSize: 112, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1.1, color: "inherit" }}>What do you want to become?</h1>
      </div>
      <div style={{ position: "absolute", top: 214, left: 128, right: 128, display: "grid", gridTemplateRows: "repeat(4, 146px)", rowGap: 23, textAlign: "center" }}>
        {professions.map((profession) => {
          const p = ramp(frame, profession.start, profession.start + profession.duration);
          return <div key={profession.text} data-profession={profession.text} aria-hidden={frame <= profession.start} style={{ ...entranceStyle({ frame, fps, start: profession.start, duration: profession.duration, distance: 0, reducedMotion }), transform: reducedMotion ? undefined : `translateY(${(1 - p) * 16}px) scale(${1})`, fontSize: 144, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.065em", whiteSpace: "nowrap", color: "inherit" }}>{profession.text}</div>;
        })}
      </div>
    </ChapterCanvas>
  );
}

export function Slide02Aspirations({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <AspirationsArtwork frame={frame} fps={fps} reducedMotion={reducedMotion} />;
}
