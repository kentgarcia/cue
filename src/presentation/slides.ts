import type { SlideDefinition } from "../engine/types";
import { Slide01Opening, openingPoster } from "./chapters/chapter-01/Slide01Opening";
import { Slide02Aspirations } from "./chapters/chapter-01/Slide02Aspirations";
import { Slide03StartNow } from "./chapters/chapter-01/Slide03StartNow";
import { chapterTheme, chapterTiming } from "./chapters/chapter-01/theme";
import { ChapterTransition } from "./chapters/chapter-01/transitions";
import { chapterTwoSlides } from "./chapters/chapter-02/slides";
import { chapterThreeSlides } from "./chapters/chapter-03/slides";
import { chapterFourSlides } from "./chapters/chapter-04/slides";
import { chapterFiveSlides } from "./chapters/chapter-05/slides";
import { chapterSixSlides } from "./chapters/chapter-06/slides";

export const chapterOneSlides = [
  {
    id: "chapter-01-opening",
    title: "Beyond the Atom",
    subtitle: "Chapter 01 · The Dream",
    chapter: { number: "01", title: "The Dream" },
    component: Slide01Opening,
    fps: 30,
    durationInFrames: chapterTiming.opening.duration,
    checkpoints: chapterTiming.opening.checkpoints,
    checkpointLabels: ["Start", "The opening"],
    transition: "fade",
    transitionComponent: ChapterTransition,
    background: openingPoster.background,
    notes:
      "MICHELLE · Welcome the students with curiosity and energy. The Beyond the Atom design is recreated as editable SVG lettering, shapes, gradients and patterns, following the supplied reference layout and event details. Subtle background flow and round flares continue while you speak; the text remains still. Reduced motion shows the static vector design. Save the application and international achievements for later chapters.",
  },
  {
    id: "chapter-01-aspirations",
    title: "What do you want to become?",
    subtitle: "Chapter 01 · The Dream",
    chapter: { number: "01", title: "The Dream" },
    component: Slide02Aspirations,
    fps: 30,
    durationInFrames: chapterTiming.aspirations.duration,
    checkpoints: chapterTiming.aspirations.checkpoints,
    checkpointLabels: [
      "Start",
      "The question",
      "Engineer",
      "Scientist",
      "Doctor",
      "Architect",
    ],
    transition: "fade",
    transitionComponent: ChapterTransition,
    transitionFrames: 20,
    background: chapterTheme.colors.light,
    notes:
      "MICHELLE · Hold on the question first. Ask, “How many of you here want to become engineers someday?” Advance once to hide the question and reveal ENGINEER? Wait for their hands and reactions. Repeat one cue at a time for scientists, doctors, and architects. All previous words stay visible. Give the audience time; the slide will wait for you.",
  },
  {
    id: "chapter-01-start-now",
    title: "Why not start now?",
    subtitle: "Chapter 01 · The Dream",
    chapter: { number: "01", title: "The Dream" },
    component: Slide03StartNow,
    fps: 30,
    durationInFrames: chapterTiming.startNow.duration,
    checkpoints: chapterTiming.startNow.checkpoints,
    checkpointLabels: ["Start", "Start now"],
    transition: "fade",
    transitionComponent: ChapterTransition,
    background: chapterTheme.colors.dark,
    notes:
      "MICHELLE · Have you ever dreamed of creating something meaningful? What if you could start right now? Let the question land and hold while you finish the introduction. Advance into Chapter 02 only when you are ready to introduce the challenge.",
  },
] as const satisfies readonly SlideDefinition[];

export const slides = [...chapterOneSlides, ...chapterTwoSlides, ...chapterThreeSlides, ...chapterFourSlides, ...chapterFiveSlides, ...chapterSixSlides] as const satisfies readonly SlideDefinition[];
