export { chapterTheme } from "../chapter-01/theme";

export const chapterThreeTiming = {
  meet: { duration: 91, checkpoints: [0, 90] },
  lessons: { duration: 253, checkpoints: [0, 54, 90, 174, 210, 252] },
  minigames: { duration: 337, checkpoints: [0, 54, 108, 174, 228, 282, 336] },
  schrodi: { duration: 433, checkpoints: [0, 48, 432] },
  quiz: { duration: 121, checkpoints: [0, 24, 120], answerStart: 25, correctStart: 48, explanationStart: 76 },
  achievement: { duration: 25, checkpoints: [0, 24] },
} as const;
