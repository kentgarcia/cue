import { ChapterTransition } from "../chapter-01/transitions";
import type { SlideDefinition } from "../../../engine/types";
import { chapterTheme, chapterTwoTiming } from "./theme";
import { Slide04Nuclear } from "./Slide04Nuclear";
import { Slide05Fiction } from "./Slide05Fiction";
import { Slide06Opportunity } from "./Slide06Opportunity";
import { Slide07Question } from "./Slide07Question";

const shared = {
  subtitle: "Chapter 02 · The Challenge",
  chapter: { number: "02", title: "The Challenge" },
  fps: chapterTheme.fps,
  transition: "fade", transitionComponent: ChapterTransition,
} as const;

export const chapterTwoSlides = [
  {
    ...shared,
    id: "chapter-02-nuclear",
    title: "The word nuclear",
    component: Slide04Nuclear,
    durationInFrames: chapterTwoTiming.nuclear.duration,
    checkpoints: chapterTwoTiming.nuclear.checkpoints,
    checkpointLabels: ["Start", "Nuclear", "Shift to red", "Bombs", "Radiation", "Disasters"],
    background: chapterTheme.colors.dark,
    notes: "MICHELLE · Say ‘nuclear’ and ask the audience what they associate with it. Hold on NUCLEAR. Advance once to shift the background to red and hold before any associations appear. Then reveal the supplied Bombs, Radiation, and Disasters images one click at a time, left to right. Each full-height column covers another third of the centered NUCLEAR headline, until the three images fill the screen. There are no on-screen association labels. Pause for responses between images. These are common associations, not a complete picture of nuclear science. Do not rush the discussion.",
  },
  {
    ...shared,
    id: "chapter-02-fiction",
    title: "Fiction versus reality",
    component: Slide05Fiction,
    durationInFrames: chapterTwoTiming.fiction.duration,
    checkpoints: chapterTwoTiming.fiction.checkpoints,
    checkpointLabels: ["Start", "Ask the audience", "Ninja Turtles", "Hulk", "Gagamboy", "Powerpuff Girls"],
    background: chapterTheme.colors.light,
    notes: "MICHELLE · Hold on ‘What comes to mind?’ first. Reveal the supplied Teenage Mutant Ninja Turtles, Hulk, Gagamboy, and Powerpuff Girls images one click at a time. Each image occupies an angled full-height comic panel; earlier panels remain visible. Invite the audience to identify each example before advancing. The final four-panel composition stays on screen until you continue.",
  },
  {
    ...shared,
    id: "chapter-02-opportunity",
    title: "The opportunity",
    component: Slide06Opportunity,
    durationInFrames: chapterTwoTiming.opportunity.duration,
    checkpoints: chapterTwoTiming.opportunity.checkpoints,
    checkpointLabels: ["Start", "The app challenge"],
    background: chapterTheme.colors.dark,
    notes: "MICHELLE · Introduce ‘Myth Smashers: Nuclear Science App Challenge’ as the opportunity to address these perceptions. Explain why this challenge mattered to the team. Show the uploaded poster full-screen and hold while discussing the announcement; avoid adding unsupported competition dates or prizes to the story.",
  },
  {
    ...shared,
    id: "chapter-02-question",
    title: "The defining question",
    component: Slide07Question,
    durationInFrames: chapterTwoTiming.question.duration,
    checkpoints: chapterTwoTiming.question.checkpoints,
    checkpointLabels: ["Start", "The defining question"],
    background: chapterTheme.colors.dark,
    notes: "MICHELLE · ‘What if we could change the way people see nuclear science?’ Read it once, then pause. Let the question stand on its own. This is the final hold of Chapter 02; there is no automatic advance.",
  },
] as const satisfies readonly SlideDefinition[];
