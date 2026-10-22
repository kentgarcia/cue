import type { PresentationConfig } from "../engine/types";
import { slides } from "./slides";
import { theme } from "./theme";
import { chapterTheme } from "./chapters/chapter-01/theme";

export const presentation = {
  title: "Team AtomIQ — Beyond What We Know",
  description: "The Dream / The Challenge / The Idea / Beyond the Classroom: Japan / The International Stage / The First Step · Chapters 01–06.",
  width: theme.canvas.width,
  height: theme.canvas.height,
  transitionFrames: chapterTheme.transitionFrames,
  transitionFps: 30,
  slides,
} satisfies PresentationConfig;
