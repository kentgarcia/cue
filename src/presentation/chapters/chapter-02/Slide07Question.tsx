import { useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas } from "../chapter-01/motion";
import { KineticType } from "../shared/KineticType";
import { chapterTheme } from "./theme";

export function Slide07Question({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="02" frame={frame} background={chapterTheme.colors.dark}>
    <div style={{ position: "absolute", inset: 110, display: "grid", placeItems: "center" }}>
      <KineticType lines={["What if we could", "change the way people", "see nuclear science?"]} settle={24} fontSize={126} reducedMotion={reducedMotion} />
    </div>
  </ChapterCanvas>;
}
