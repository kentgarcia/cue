export { chapterTheme } from "../chapter-01/theme";

export const chapterSixTiming = {
  question: { duration: 31, checkpoints: [0, 30] },
  closing: { duration: 164, checkpoints: [0, 24, 48, 72, 163], lineStarts: [0, 25, 49], qrStart: 73 },
} as const;
