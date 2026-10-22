import { ChapterTransition } from "../chapter-01/transitions";
import type { SlideDefinition } from "../../../engine/types";
import { Slide19FirstStep, Slide20Closing } from "./FirstStepSlides";
import { chapterTheme, chapterSixTiming as timing } from "./theme";

const shared = {
  subtitle: "Chapter 06 · The First Step",
  chapter: { number: "06", title: "The First Step" },
  fps: chapterTheme.fps,
  transition: "fade", transitionComponent: ChapterTransition,
} as const;

export const chapterSixSlides = [
  {
    ...shared, id: "chapter-06-first-step", title: "Return to the audience", component: Slide19FirstStep,
    durationInFrames: timing.question.duration, checkpoints: timing.question.checkpoints, checkpointLabels: ["Start", "Are you willing to take the first step?"], background: chapterTheme.colors.light,
    notes: "KENT · Bring the story back to the students. Ask ‘Are you willing to take the first step?’ Pause and make eye contact. Give them time to consider their own first step. Advance when you are ready to deliver the final message.",
  },
  {
    ...shared, id: "chapter-06-closing", title: "The final message", component: Slide20Closing,
    durationInFrames: timing.closing.duration, checkpoints: timing.closing.checkpoints,
    checkpointLabels: ["Start", "Start with what you know", "Learn what you don't", "Discover what's possible", "AtomIQ · final hold"], background: chapterTheme.colors.dark,
    notes: "KENT · Say ‘Start with what you know.’ Hold. Advance as you say ‘Learn what you don't.’ Hold. Advance as you say ‘Discover what's possible.’ Let all three statements remain together. Then advance once to fade into the copied AtomIQ showcase from slide 8, including its icon, name, tagline, phone, Schrödi, entrance and idle animations. The final design holds indefinitely. Reverse restores the three statements; restart returns to the first statement.",
  },
] as const satisfies readonly SlideDefinition[];
