export { chapterTheme } from "../chapter-01/theme";

export const chapterFiveTiming = {
  stage: { duration: 31, checkpoints: [0, 30] },
  scale: { duration: 49, checkpoints: [0, 24, 48], countriesStart: 25 },
  result: { duration: 37, checkpoints: [0, 36] },
} as const;
