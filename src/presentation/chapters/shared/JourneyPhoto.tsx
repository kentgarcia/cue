import { useCurrentFrame } from "remotion";
import { ChapterCanvas, MotionLine } from "../chapter-01/motion";
import { chapterTheme } from "../chapter-01/theme";
import { StoryMedia, type StoryAsset } from "./StoryMedia";

export function JourneyPhoto({ chapter, asset, title, testId, reducedMotion }: {
  chapter: string;
  asset: StoryAsset;
  title: string;
  testId: string;
  reducedMotion: boolean;
}) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter={chapter} frame={frame} background={chapterTheme.colors.dark}>
    <MotionLine testId={testId} startFrame={0} duration={24} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", inset: 0 }}>
      <StoryMedia asset={asset} fullBleed />
      <JourneyCaption title={title} />
    </MotionLine>
  </ChapterCanvas>;
}

export function JourneyCaption({ title, fontSize = 54, inset = 64 }: { title: string; fontSize?: number; inset?: number }) {
  return <div style={{ position: "absolute", left: inset, right: inset, bottom: 56, display: "flex", justifyContent: "center" }}>
    <h1 data-photo-caption style={{ margin: 0, padding: fontSize === 54 ? "18px 36px" : "18px 24px", maxWidth: "100%", borderRadius: 6, background: chapterTheme.colors.dark, color: chapterTheme.colors.light, fontSize, fontWeight: 750, lineHeight: 1.2, letterSpacing: "-.025em", textAlign: "center" }}>{title}</h1>
  </div>;
}
