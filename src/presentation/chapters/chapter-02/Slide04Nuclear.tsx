import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, MotionLine, ramp } from "../chapter-01/motion";
import { chapterTheme, chapterTwoTiming } from "./theme";
import { KineticType } from "../shared/KineticType";

export const nuclearRedGradient = "linear-gradient(135deg, #ef2738, #cf102d 43%, #940c24)";

export const associations = [
  { id: "bombs", label: "Bombs", src: "/media/slide-4/optimized/bombs.webp", start: 34 },
  { id: "radiation", label: "Radiation", src: "/media/slide-4/optimized/radiation.webp", start: 51 },
  { id: "disasters", label: "Disasters", src: "/media/slide-4/optimized/disasters.webp", start: 68 },
] as const;

export function Slide04Nuclear({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  return (
    <ChapterCanvas chapter="02" frame={frame} background={chapterTheme.colors.dark}>
      <div data-testid="nuclear-red-background" aria-hidden="true" style={{ position: "absolute", inset: 0, background: nuclearRedGradient, opacity: ramp(frame, chapterTwoTiming.nuclear.redStart, chapterTwoTiming.nuclear.redEnd), willChange: frame > chapterTwoTiming.nuclear.redStart && frame < chapterTwoTiming.nuclear.redEnd ? "opacity" : undefined }} />
      <div data-testid="nuclear-heading" aria-hidden={frame >= associations[2].start + 11} style={{ position: "absolute", inset: 0, padding: "0 128px", display: "grid", placeItems: "center" }}>
        <KineticType lines={["NUCLEAR."]} settle={14} fontSize={258} reducedMotion={reducedMotion} />
      </div>
      <div data-testid="nuclear-image-columns" style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 0 }}>
        {associations.map(({ id, label, src, start }) => (
          <div key={id} data-nuclear-column={id} style={{ position: "relative", overflow: "hidden" }}>
            <MotionLine startFrame={start} duration={11} distance={height} reducedMotion={reducedMotion} testId={`association-${id}`} style={{ position: "absolute", inset: 0, willChange: frame > start && frame < start + 11 ? (reducedMotion ? "opacity" : "transform, opacity") : undefined }}>
              <Img src={src} alt={label} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            </MotionLine>
          </div>
        ))}
      </div>
    </ChapterCanvas>
  );
}
