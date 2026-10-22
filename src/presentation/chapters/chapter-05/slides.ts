import { ChapterTransition } from "../chapter-01/transitions";
import type { SlideDefinition } from "../../../engine/types";
import { Slide16International, Slide17Scale, Slide18Result } from "./InternationalSlides";
import { chapterTheme, chapterFiveTiming as timing } from "./theme";

const shared = {
  subtitle: "Chapter 05 · The International Stage",
  chapter: { number: "05", title: "The International Stage" },
  fps: chapterTheme.fps,
  transition: "fade", transitionComponent: ChapterTransition,
} as const;

export const chapterFiveSlides = [
  {
    ...shared, id: "chapter-05-international", title: "Representing the Philippines", component: Slide16International,
    durationInFrames: timing.stage.duration, checkpoints: timing.stage.checkpoints, checkpointLabels: ["Start", "The International Stage"], background: chapterTheme.colors.dark,
    notes: "Introduce the ANENT Myth Smashers International Finals and the experience of representing the Philippines. The supplied international.png group photograph fills the screen. Let the photograph and headline hold while you set the scene.",
  },
  {
    ...shared, id: "chapter-05-scale", title: "The scale of the competition", component: Slide17Scale,
    durationInFrames: timing.scale.duration, checkpoints: timing.scale.checkpoints, checkpointLabels: ["Start", "17 teams", "12 countries"], background: chapterTheme.colors.light,
    notes: "17 teams. Pause. Advance once to reveal 12 countries alongside the team count. Let the large numbers communicate the scale of the competition. The slide waits at each cue until you advance.",
  },
  {
    ...shared, id: "chapter-05-result", title: "The international result", component: Slide18Result,
    durationInFrames: timing.result.duration, checkpoints: timing.result.checkpoints, checkpointLabels: ["Start", "2nd place"], background: chapterTheme.colors.dark,
    notes: "Announce ‘2nd place.’ Pause for the audience's reaction. Let this result stand on its own, then hand over to Kent for the final chapter. Advance when you are ready to return the story to the students.",
  },
] as const satisfies readonly SlideDefinition[];
