export const openingGradient = "linear-gradient(135deg, #ffad32, #ff741d 43%, #ff8e24)";

export const chapterTheme = {
  colors: {
    ink: "#111111",
    dark: openingGradient,
    light: "#ffffff",
    muted: "#a3a3a3",
  },
  font: '"Inter", sans-serif',
  easing: { entrance: [0.23, 1, 0.32, 1], travel: [0.77, 0, 0.175, 1] },
  inset: { horizontal: 128, vertical: 96 },
  fps: 30,
  spring: { damping: 18, stiffness: 120, mass: 0.85 },
  transitionFrames: 10,
} as const;

export const chapterTiming = {
  opening: { duration: 31, checkpoints: [0, 30] },
  aspirations: { duration: 83, checkpoints: [0, 14, 31, 48, 65, 82] },
  startNow: { duration: 27, checkpoints: [0, 26] },
} as const;
