import type { SlideProps } from "../../../engine/types";
import { JourneyPhoto } from "../shared/JourneyPhoto";
import { ideaAssets } from "./assets";

export { Slide08Meet } from "./Slide08Meet";

export { Slide10Minigames } from "./Slide10Minigames";
export { Slide09Lessons } from "./Slide09Lessons";
export { Slide11Schrodi as SlideSchrodi } from "./Slide11Schrodi";

export { Slide12MythFact as Slide10Quiz } from "./Slide12MythFact";

export function Slide11Achievement({ reducedMotion }: SlideProps) {
  return <JourneyPhoto chapter="03" asset={ideaAssets.award} title="CHAMPION — 2025" testId="award-photo" reducedMotion={reducedMotion} />;
}
