import { useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, MotionLine } from "../chapter-01/motion";
import { StoryMedia } from "../shared/StoryMedia";
import { JourneyCaption, JourneyPhoto } from "../shared/JourneyPhoto";
import { japanAssets } from "./assets";
import { chapterTheme } from "./theme";

const { dark } = chapterTheme.colors;

export function Slide12Destination({ reducedMotion }: SlideProps) {
  return <JourneyPhoto chapter="04" asset={japanAssets.arrival} title="JAPAN · July 2026" testId="arrival-photo" reducedMotion={reducedMotion} />;
}

const scienceColumns = [
  { asset: japanAssets.museum, title: "Science museum", start: 0 },
  { asset: japanAssets.monitoring, title: "Monitoring equipment", start: 25 },
  { asset: japanAssets.facility, title: "Nuclear facility", start: 49 },
] as const;
const columnWidth = 640;
const seamOverlap = 96;

export function Slide13Science({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="04" frame={frame} background={dark}>
    <div data-testid="science-columns" style={{ position: "absolute", inset: 0 }}>
      {scienceColumns.map(({ asset, start }, index) => (
        <MotionLine key={asset.label} testId={`science-photo-${index}`} startFrame={start} duration={24} distance={0} reducedMotion={reducedMotion} style={{
          position: "absolute", top: 0, bottom: 0,
          left: index * columnWidth - (index > 0 ? seamOverlap : 0),
          width: columnWidth + (index > 0 ? seamOverlap : 0) + (index < 2 ? seamOverlap : 0),
          // Only the upper photo fades: the opaque photo beneath prevents a colored seam.
          maskImage: index === 0 ? undefined : `linear-gradient(to right, transparent, black ${seamOverlap * 2}px)`,
        }}>
          <StoryMedia asset={asset} fullBleed />
        </MotionLine>
      ))}
      {scienceColumns.map(({ title, start }, index) => (
        <MotionLine key={title} testId={`science-caption-${index}`} startFrame={start} duration={24} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", top: 0, bottom: 0, left: index * columnWidth, width: columnWidth }}>
          <JourneyCaption title={title} fontSize={42} inset={24} />
        </MotionLine>
      ))}
    </div>
  </ChapterCanvas>;
}

export function Slide14Human({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="04" frame={frame} background={dark}>
    <div data-testid="interview-columns" style={{ position: "absolute", inset: 0 }}>
      {[japanAssets.interviewOne, japanAssets.interviewTwo].map((asset, index) => (
        <MotionLine key={asset.label} testId={`interview-${index}`} startFrame={0} duration={24} distance={0} reducedMotion={reducedMotion} style={{
          position: "absolute", top: 0, bottom: 0,
          left: index === 0 ? 0 : 960 - seamOverlap,
          width: 960 + seamOverlap,
          maskImage: index === 0 ? undefined : `linear-gradient(to right, transparent, black ${seamOverlap * 2}px)`,
        }}>
          <StoryMedia asset={asset} fullBleed />
        </MotionLine>
      ))}
      <MotionLine testId="interview-caption" startFrame={0} duration={24} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", inset: 0 }}>
        <JourneyCaption title="Behind every scientific issue are real people." />
      </MotionLine>
    </div>
  </ChapterCanvas>;
}
