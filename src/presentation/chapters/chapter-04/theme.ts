export { chapterTheme } from "../chapter-01/theme";

export const chapterFourTiming = {
  destination: { duration: 25, checkpoints: [0, 24] },
  science: { duration: 73, checkpoints: [0, 24, 48, 72] },
  human: { duration: 37, checkpoints: [0, 36] },
} as const;
