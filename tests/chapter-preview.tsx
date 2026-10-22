import { createRoot } from "react-dom/client";
import { Thumbnail } from "@remotion/player";
import { presentation as fullPresentation } from "../src/presentation/config";
import { chapterOneSlides } from "../src/presentation/slides";
import { chapterTwoSlides } from "../src/presentation/chapters/chapter-02/slides";
import { chapterThreeSlides } from "../src/presentation/chapters/chapter-03/slides";
import { chapterFourSlides } from "../src/presentation/chapters/chapter-04/slides";
import { chapterFiveSlides } from "../src/presentation/chapters/chapter-05/slides";
import { chapterSixSlides } from "../src/presentation/chapters/chapter-06/slides";
import { loadPresentationFonts } from "../src/presentation/fonts";
import { TransitionComposition } from "../src/engine/TransitionManager";
import type { PlaybackState, SlideDefinition } from "../src/engine/types";
import "../src/styles/index.css";

const params = new URLSearchParams(window.location.search);
const mythFact = params.has("mythfact");
const schrodi = params.has("schrodi");
const minigames = params.has("minigames");
const lessons = params.has("lessons");
const atomiq = params.has("atomiq");
const chapterTwo = params.has("chapter2");
const chapterThree = params.has("chapter3");
const chapterFour = params.has("chapter4");
const chapterFive = params.has("chapter5");
const chapterSix = params.has("chapter6");
const laterChapter = chapterThree || chapterFour || chapterFive || chapterSix;
const presentation = {
  ...fullPresentation,
  slides: mythFact ? [chapterThreeSlides[4]!] : schrodi ? [chapterThreeSlides[3]!] : minigames ? [chapterThreeSlides[2]!] : lessons ? [chapterThreeSlides[1]!] : atomiq ? [chapterThreeSlides[0]!] : chapterSix ? chapterSixSlides : chapterFive ? chapterFiveSlides : chapterFour ? chapterFourSlides : chapterThree ? chapterThreeSlides : chapterTwo ? chapterTwoSlides : chapterOneSlides,
};
const transitionFramesFor = (index: number) => (presentation.slides[index] as SlideDefinition).transitionFrames ?? presentation.transitionFrames;
const transitions = params.has("transitions");
const kinetic = params.has("kinetic");
const reviewFrames = mythFact ? [[24, 35, 44, 60, 86, 120]] : schrodi ? [[48, 64, 96, 134, 168, 222, 312, 350, 432]] : minigames ? [[28, 54, 108, 130, 174, 228, 282, 336]] : lessons ? [[28, 54, 90, 108, 114, 143, 174, 210, 252]] : atomiq ? [[0, 12, 28, 48, 68, 90]] : laterChapter
  ? presentation.slides.map((slide) => [0, Math.floor(slide.durationInFrames / 2), ...slide.checkpoints.slice(1)].filter((frame, index, frames) => frames.indexOf(frame) === index).sort((a, b) => a - b))
  : chapterTwo
  ? [[0, 31, 82], [0, 14, 31, 48, 65, 82], [0, 12, 24], [0, 10, 24]]
  : kinetic
  ? ([
      [4, 9, 18, 30],
      [31, 48, 65, 82],
      [4, 10, 16, 26],
    ] as const)
  : ([
      [0, 13, 30],
      [0, 40, 82],
      [0, 17, 26],
    ] as const);
await loadPresentationFonts();

function FrameReview() {
  return (
    <main
      data-review-ready="true"
      style={{
        background: "#e9edf1",
        minHeight: "100vh",
        padding: 28,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#17365d",
          margin: "0 0 22px",
        }}
      >
        {presentation.slides[0]!.subtitle.toUpperCase()}{" "}
        <span style={{ fontSize: 12, fontWeight: 400 }}>
          {" "}
          /{" "}
          {kinetic
            ? "Camera progression / four cue holds"
            : transitions
              ? "Transition continuity"
              : "Initial → mid-animation → settled"}
        </span>
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: kinetic ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: "24px 16px",
        }}
      >
        {transitions
          ? Array.from({ length: Math.min(2, presentation.slides.length - 1) }, (_, index) => index + 1).flatMap((slideIndex) =>
              [0, Math.floor(transitionFramesFor(slideIndex) / 2), transitionFramesFor(slideIndex) - 1].map((frame) => {
                const fromIndex = slideIndex - 1;
                const state: PlaybackState = {
                  slideIndex,
                  frame: 0,
                  targetFrame: presentation.slides[slideIndex]!.checkpoints[1]!,
                  revision: 0,
                  phase: "transitioning",
                  transition: {
                    fromIndex,
                    fromFrame:
                      presentation.slides[fromIndex]!.durationInFrames - 1,
                    toFrame: 0,
                    direction: 1,
                  },
                };
                return (
                  <section key={`${slideIndex}-${frame}`}>
                    <p
                      style={{
                        fontSize: 11,
                        margin: "0 0 9px",
                        color: "#53647a",
                      }}
                    >
                      {String(slideIndex).padStart(2, "0")} →{" "}
                      {String(slideIndex + 1).padStart(2, "0")} · FRAME {frame}
                    </p>
                    <div className="review-frame">
                      <Thumbnail
                        component={TransitionComposition}
                        inputProps={{
                          config: presentation,
                          state,
                          reducedMotion: false,
                        }}
                        frameToDisplay={frame}
                        durationInFrames={transitionFramesFor(slideIndex)}
                        fps={30}
                        compositionWidth={1920}
                        compositionHeight={1080}
                        style={{ width: "100%", aspectRatio: "16/9" }}
                      />
                    </div>
                  </section>
                );
              }),
            )
          : presentation.slides.flatMap((slide, index) =>
              reviewFrames[index]!.map((frame) => (
                <section key={`${slide.id}-${frame}`}>
                  <p
                    style={{
                      fontSize: 11,
                      margin: "0 0 9px",
                      color: "#53647a",
                    }}
                  >
                    {String(index + (mythFact ? 12 : schrodi ? 11 : minigames ? 10 : lessons ? 9 : atomiq ? 8 : chapterSix ? 20 : chapterFive ? 17 : chapterFour ? 14 : chapterThree ? 8 : chapterTwo ? 4 : 1)).padStart(2, "0")} · {slide.title} · FRAME{" "}
                    {frame}
                  </p>
                  <div className="review-frame">
                    <Thumbnail
                      component={slide.component}
                      inputProps={{
                        reducedMotion: false,
                        slideCount: presentation.slides.length,
                      }}
                      frameToDisplay={frame}
                      durationInFrames={slide.durationInFrames}
                      fps={slide.fps}
                      compositionWidth={1920}
                      compositionHeight={1080}
                      style={{ width: "100%", aspectRatio: "16/9" }}
                    />
                  </div>
                </section>
              )),
            )}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<FrameReview />);
