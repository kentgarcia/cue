import { useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas } from "./motion";
import { KineticType } from "../shared/KineticType";
import { chapterTheme } from "./theme";

export function Slide03StartNow({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return (
    <ChapterCanvas frame={frame} background={chapterTheme.colors.dark}>
      <div style={{ position: "absolute", inset: 96, display: "grid", placeItems: "center" }}>
        <KineticType lines={["Why not", "start now?"]} settle={26} fontSize={242} reducedMotion={reducedMotion} />
      </div>
    </ChapterCanvas>
  );
}
