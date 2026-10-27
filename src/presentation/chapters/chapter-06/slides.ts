import { ChapterTransition } from "../chapter-01/transitions";
import type { SlideDefinition } from "../../../engine/types";
import { Slide19FirstStep, Slide20Closing, Slide22Discover } from "./FirstStepSlides";
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
    checkpointLabels: ["Start", "Start with what you know", "Learn what you don't", "Discover what's possible", "AtomIQ reveal → automatic QR"], background: chapterTheme.colors.dark,
    autoAdvance: true,
    notes: "KENT · Say each closing statement on its own cue. Let all three remain together, then advance once for the complete AtomIQ branding reveal. The logo, name, tagline, phone and Schrödi finish their entrance, hold for three seconds, and automatically transition to the dedicated QR slide. Pause can stop this sequence. Seeking directly to the final cue or revisiting it with Left holds the brand until you advance.",
  },
  {
    ...shared, id: "chapter-06-discover", title: "Your next discovery", component: Slide22Discover,
    durationInFrames: timing.qr.duration, checkpoints: timing.qr.checkpoints,
    checkpointLabels: ["Start", "Scan · AtomIQ website"], background: "#FFF7E8",
    transition: "fade", transitionComponent: undefined, transitionFrames: 24,
    notes: "Invite the audience to scan the QR code for https://atomiq-pi.vercel.app/. The code settles and stays fixed; only Schrödi and decorative sparks drift gently. Leave it on screen while people scan. It holds indefinitely. Reduced motion keeps the scene still. Left rewinds the QR entrance; another Left returns to the final AtomIQ branding.",
  },
] as const satisfies readonly SlideDefinition[];
