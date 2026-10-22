import { useCurrentFrame } from "remotion";
import { ChapterCanvas } from "../chapter-01/motion";
import { competitionAsset } from "./assets";
import { SlideMedia } from "./SlideMedia";
import { chapterTheme } from "./theme";

export function Slide06Opportunity() {
  const frame = useCurrentFrame();
  return (
    <ChapterCanvas chapter="02" frame={frame} background={chapterTheme.colors.dark}>
      <div style={{ position: "absolute", inset: 0 }}>
        <SlideMedia asset={competitionAsset} />
      </div>
    </ChapterCanvas>
  );
}
