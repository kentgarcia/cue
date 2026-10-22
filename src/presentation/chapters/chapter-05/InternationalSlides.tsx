import { useCurrentFrame } from "remotion";
import type { SlideProps } from "../../../engine/types";
import { ChapterCanvas, MotionLine } from "../chapter-01/motion";
import { StoryMedia } from "../shared/StoryMedia";
import { KineticType } from "../shared/KineticType";
import { internationalAsset } from "./assets";
import { chapterTheme, chapterFiveTiming } from "./theme";

const { light, dark } = chapterTheme.colors;

export function Slide16International({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return (
    <ChapterCanvas chapter="05" frame={frame} background={dark}>
      <MotionLine startFrame={0} duration={20} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", inset: 0 }}>
        <StoryMedia asset={internationalAsset} fullBleed />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 25%, #ff741d70 55%, #ff741d 100%)" }} />
      </MotionLine>
      <div style={{ position: "absolute", left: 128, right: 128, top: 720 }}>
        <KineticType lines={["The International", "Stage."]} settle={28} fontSize={116} reducedMotion={reducedMotion} />
      </div>
    </ChapterCanvas>
  );
}

export function Slide17Scale({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return (
    <ChapterCanvas chapter="05" frame={frame} background={light}>
      <MotionLine testId="competition-teams" startFrame={0} duration={20} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", left: 128, width: 760, top: 245, textAlign: "center", color: "inherit" }}>
        <KineticType lines={["17"]} settle={22} fontSize={420} reducedMotion={reducedMotion} />
        <span style={{ display: "block", fontSize: 56, lineHeight: 1.3, fontWeight: 700, letterSpacing: "-0.04em", marginTop: 16 }}>TEAMS.</span>
      </MotionLine>
      <MotionLine testId="competition-countries" startFrame={chapterFiveTiming.scale.countriesStart} duration={20} distance={0} reducedMotion={reducedMotion} style={{ position: "absolute", right: 128, width: 760, top: 245, textAlign: "center", color: "inherit" }}>
        <KineticType lines={["12"]} start={25} settle={47} fontSize={420} reducedMotion={reducedMotion} />
        <span style={{ display: "block", fontSize: 56, lineHeight: 1.3, fontWeight: 700, letterSpacing: "-0.04em", marginTop: 16 }}>COUNTRIES.</span>
      </MotionLine>
    </ChapterCanvas>
  );
}

export function Slide18Result({ reducedMotion }: SlideProps) {
  const frame = useCurrentFrame();
  return <ChapterCanvas chapter="05" frame={frame} background={dark}>
    <div style={{ position: "absolute", inset: 96, display: "grid", placeItems: "center" }}>
      <KineticType lines={["2ND", "PLACE."]} settle={30} fontSize={300} reducedMotion={reducedMotion} />
    </div>
  </ChapterCanvas>;
}
