export { chapterTheme } from "../chapter-01/theme";

export const chapterSixTiming = {
  question: { duration: 31, checkpoints: [0, 30] },
  closing: { duration: 254, checkpoints: [0, 24, 48, 72, 253], lineStarts: [0, 25, 49], brandStart: 73 },
  qr: { duration: 73, checkpoints: [0, 72] },
} as const;
