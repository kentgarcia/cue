export const theme = {
  colors: {
    paper: "#f5f1e9",
    purple: "#7254d7",
    violet: "#d5c7ff",
    orange: "#ff845c",
    ink: "#282238",
    yellow: "#f5d865",
    green: "#c8e4bc",
    white: "#ffffff",
  },
  fonts: {
    display: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
  },
  type: { display: 232, headline: 152, title: 112, body: 38, label: 23 },
  spacing: { inset: 108, gap: 40, small: 24 },
  canvas: { width: 1920, height: 1080, aspectRatio: 16 / 9 },
  motion: {
    entrance: 26,
    stagger: 4,
    transition: 10,
    spring: { damping: 12, stiffness: 100, mass: 1 },
  },
} as const;
