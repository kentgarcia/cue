export { chapterTheme } from "../chapter-01/theme";

// Freeze the settled feature title for 1.2 seconds, then resume its existing film.
// Keeping this on the Remotion timeline makes pause, restart and snapshots exact.
export const featureTitleHoldFrames = 36;
export function featureDemoFrame(frame: number, titleFrame: number): number {
  return frame <= titleFrame ? frame : Math.max(titleFrame, frame - featureTitleHoldFrames);
}

export const chapterThreeTiming = {
  meet: { duration: 91, checkpoints: [0, 90] },
  lessons: { duration: 253 + featureTitleHoldFrames, checkpoints: [0, 252 + featureTitleHoldFrames] },
  minigames: { duration: 337 + featureTitleHoldFrames, checkpoints: [0, 336 + featureTitleHoldFrames] },
  schrodi: { duration: 433 + featureTitleHoldFrames, checkpoints: [0, 432 + featureTitleHoldFrames] },
  quiz: { duration: 121, checkpoints: [0, 24, 120], answerStart: 25, correctStart: 48, explanationStart: 76 },
  achievement: { duration: 25, checkpoints: [0, 24] },
} as const;
