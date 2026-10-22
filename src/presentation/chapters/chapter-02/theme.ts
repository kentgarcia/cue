export { chapterTheme } from "../chapter-01/theme";

export const chapterTwoTiming = {
  nuclear: { duration: 83, checkpoints: [0, 14, 31, 48, 65, 82], redStart: 15, redEnd: 31 },
  fiction: { duration: 83, checkpoints: [0, 14, 31, 48, 65, 82] },
  opportunity: { duration: 25, checkpoints: [0, 24] },
  question: { duration: 25, checkpoints: [0, 24] },
} as const;
