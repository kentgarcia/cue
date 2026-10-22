import { ChapterTransition } from "../chapter-01/transitions";
import type { SlideDefinition } from "../../../engine/types";
import { Slide12Destination, Slide13Science, Slide14Human } from "./JapanSlides";
import { chapterTheme, chapterFourTiming as timing } from "./theme";

const shared = { subtitle: "Chapter 04 · Beyond the Classroom: Japan", chapter: { number: "04", title: "Beyond the Classroom: Japan" }, fps: chapterTheme.fps, transition: "fade", transitionComponent: ChapterTransition } as const;

export const chapterFourSlides = [
  { ...shared, id: "chapter-04-destination", title: "A new destination", component: Slide12Destination, durationInFrames: timing.destination.duration, checkpoints: timing.destination.checkpoints, checkpointLabels: ["Start", "Japan · photo and title"], background: chapterTheme.colors.dark,
    notes: "The supplied japan.png team photograph and the small orange-highlighted ‘JAPAN · July 2026’ title at the bottom reveal together automatically. Hold to tell the Japan story, then advance to science beyond the classroom. There is no separate title cue." },
  { ...shared, id: "chapter-04-science", title: "Museums, equipment and nuclear facility", component: Slide13Science, durationInFrames: timing.science.duration, checkpoints: timing.science.checkpoints, checkpointLabels: ["Start", "Museums", "Monitoring equipment", "Nuclear facility"], background: chapterTheme.colors.dark,
    notes: "Three full-height columns use the supplied museum.jpg, equipment.jpg and facility.jpg photographs. The museum appears first; advance to reveal monitoring equipment, then the nuclear facility. Each photograph reveals with a white title on an orange highlight, centered at the bottom of its column. Overlapping, feathered edges blend neighboring photos. Explain what the team observed, one image at a time." },
  { ...shared, id: "chapter-04-human", transitionComponent: undefined, title: "The human perspective", component: Slide14Human, durationInFrames: timing.human.duration, checkpoints: timing.human.checkpoints, checkpointLabels: ["Start", "Listen to residents"], background: chapterTheme.colors.dark,
    notes: "Slow down. Behind every scientific issue are real people. The supplied interview-1.jpg and interview-2.jpg photographs fill two full-height columns with a softly feathered seam. Both photos reveal together with the white title on an orange highlight centered at the bottom. Share only the experiences the residents communicated; do not invent quotes or imply that one interview represents every resident. The restrained opacity reveal has no bounce, rotation, or camera movement. Hold for reflection." },

] as const satisfies readonly SlideDefinition[];
